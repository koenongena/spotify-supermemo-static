import { utils } from "../utils/api";

export const exportPlaylist = async (playlisId: string, access_token: string) => {
    const playlist = await utils.apiCall("https://api.spotify.com/v1/playlists/" + playlisId, access_token);

    // Make asynchronous API calls for 100 songs at a time, and put the results (all Promises) in a list.
    let requests = [];
    for (let offset = 0; offset < playlist.tracks.total; offset = offset + 100) {
        requests.push(utils.apiCall(playlist.tracks.href.split('?')[0] + '?offset=' + offset + '&limit=100',
            access_token, offset));
    }
    // "returns a single Promise that resolves when all of the promises passed as an iterable have resolved"
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    let artist_ids = new Set();
    let data_promise = Promise.all(requests).then(responses => { // Gather all the data from the responses in a table.
        return responses.map(response => { // apply to all responses
            return response.items.map((song: any) => { // appy to all songs in each response
                song.track.artists.forEach((a: any) => {
                    if (a.id) {
                        artist_ids.add(a.id)
                    }
                });
                return [song.track.id, '"' + song.track.artists.map((artist: any) => {
                    return artist.id
                }).join(',') + '"',
                    '"' + song.track.name.replace(/"/g, '') + '"', '"' + song.track.album.name.replace(/"/g, '') + '"',
                    '"' + song.track.artists.map((artist: any) => {
                        return artist.name
                    }).join(',') + '"', song.track.album.release_date,
                    song.track.duration_ms, song.track.popularity, song.added_by.uri, song.added_at];
            });
        });
    });

    // Make queries on all the artists, because this json is where genre information lives. Unfortunately this
    // means a second wave of traffic, 50 artists at a time the maximum allowed.
    let genre_promise = data_promise.then(() => {
        let aids = Array.from(artist_ids); // Make groups of 50 artists, to all be queried together
        let artist_chunks = [];
        while (aids.length) {
            artist_chunks.push(aids.splice(0, 50));
        }

        let artists_promises = artist_chunks.map((chunk_ids, i) => utils.apiCall(
            'https://api.spotify.com/v1/artists?ids=' + chunk_ids.join(','), access_token, 100 * i));
        return Promise.all(artists_promises).then(responses => {
            let artist_genres = {};
            // @ts-ignore
            responses.forEach(response => response.artists.forEach((artist: any) => artist_genres[artist.id] = artist.genres.join(',')));
            return artist_genres;
        });
    });

    // Make queries for song audio features, 100 songs at a time. Depends on genre_promise too to build in delays.
    let features_promise = Promise.all([data_promise, genre_promise]).then(values => {
        let data = values[0];
        let songs_promises = data.map((chunk, i) => { // remember data is an array of arrays, each subarray 100 tracks
            let ids = chunk.map((song: any) => song[0]).join(','); // the id lives in the first position
            return utils.apiCall('https://api.spotify.com/v1/audio-features?ids=' + ids, access_token, 100 * i);
        });
        return Promise.all(songs_promises).then(responses => {
            return responses.map(response => { // for each response
                return response.audio_features.map((feats: any) => {
                    return feats ? [feats.danceability, feats.energy, feats.key, feats.loudness, feats.mode,
                        feats.speechiness, feats.acousticness, feats.instrumentalness, feats.liveness, feats.valence,
                        feats.tempo, feats.time_signature] : Array(12);
                });
            });
        });
    });

    // join the tables, label the columns, and put all data in a single csv string
    return Promise.all([data_promise, genre_promise, features_promise]).then(values => {
        let [data, artist_genres, features] = values;
        // add genres
        data = data.flat();
        data.forEach(row => {
            let artists = row[1].substring(1, row[1].length - 1).split(','); // strip the quotes
            // @ts-ignore
            let deduplicated_genres = new Set(artists.map((a: any) => artist_genres[a]).join(",").split(",")); // in case multiple artists
            row.push('"' + Array.from(deduplicated_genres).filter(x => x != "").join(",") + '"'); // remove empty strings
        });
        // add features
        features = features.flat();
        data.forEach((row, i) => features[i].forEach((feat: any) => row.push(feat)));
        // add titles
        data.unshift(["Spotify ID", "Artist IDs", "Track Name", "Album Name", "Artist Name(s)", "Release Date",
            "Duration (ms)", "Popularity", "Added By", "Added At", "Genres", "Danceability", "Energy", "Key", "Loudness",
            "Mode", "Speechiness", "Acousticness", "Instrumentalness", "Liveness", "Valence", "Tempo", "Time Signature"]);
        // make a string
        let csv = '';
        data.forEach(row => {
            csv += row.join(",") + "\n"
        });
        console.log(csv);
        return csv;
    });
};