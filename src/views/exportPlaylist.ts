import {utils} from "../utils/api";

function escapeForCsvColumn(s: string) {
    return '"' + s.replaceAll('"', '""') + '"';
}

export const exportPlaylist = async (playlisId: string, access_token: string) => {
    const playlist = await utils.apiCall("https://api.spotify.com/v1/playlists/" + playlisId, access_token);

    // Make asynchronous API calls for 100 songs at a time, and put the results (all Promises) in a list.
    let requests = [];
    for (let offset = 0; offset < playlist.tracks.total; offset = offset + 100) {
        requests.push(utils.apiCall(playlist.tracks.href.split('?')[0] + '?offset=' + offset + '&limit=100',
            access_token, offset));
    }
    let data_promise = Promise.all(requests).then(responses => { // Gather all the data from the responses in a table.
        return responses.map(response => { // apply to all responses
            return response.items.map((song: any) => { // appy to all songs in each response
                const artists = song.track.artists.map((a: { name: string }) => a.name).join(' & ');
                const title = song.track.name;
                const previewUrl = song.track.preview_url;
                const id = song.track.id;

                return {
                    artist: artists, title, previewUrl, id, spotifyPlaylist: {name: playlist.name, id: playlist.id}
                };
            });
        });
    });

    return data_promise.then(values => {
        console.log(values);
        const csvRows = values.flat().map(v => {
            const front = escapeForCsvColumn(`${v.title}`);
            const back = escapeForCsvColumn(`${(v.artist)} - ${(v.title)} <br/><iframe allow="encrypted-media" allowtransparency="true" frameborder="0" height="380" src="https://open.spotify.com/embed/track/${v.id}" width="300"></iframe>`);
            const tags = v.spotifyPlaylist.name;
            return [front, back, tags].join(",")
        });
        return csvRows.join("\n");
    });
};