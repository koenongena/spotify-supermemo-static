import {utils} from "../utils/api";

function escapeForCsvColumn(s: string) {
    return '"' + s.replaceAll('"', '""') + '"';
}

export const exportPlaylist = async (playlistId: string, access_token: string) => {
    const values = await getPlaylistInformation(playlistId, access_token);

    return values.flat().map(v => {
        const front = escapeForCsvColumn(`${v.title}`);
        const back = escapeForCsvColumn(`${(v.artist)} - ${(v.title)} <br/><iframe allow="encrypted-media" allowtransparency="true" frameborder="0" height="380" src="https://open.spotify.com/embed/track/${v.id}" width="300"></iframe>`);
        const tags = v.spotifyPlaylist.name;
        return [front, back, tags].join(",")
    }).join("\n");
};

function renderFrontPreview(v: FlatArray<PlaylistInformation[], 1>) {
    if (v.previewUrl) {
        return escapeForCsvColumn(`<audio controls autoplay ><source type="audio/mpeg" src="${v.previewUrl}"></audio>`);
    } else {
        return escapeForCsvColumn(`<iframe allow="encrypted-media" allowtransparency="true" frameborder="0" height="380" src="https://open.spotify.com/embed/track/${v.id}" width="300"></iframe>`);
    }
}

export const exportPreviewAnkiFile = async (playlistId: string, access_token: string) => {
    const values = await getPlaylistInformation(playlistId, access_token);

    return values.flat().map(v => {
        const front = renderFrontPreview(v);
        const back = escapeForCsvColumn(`${(v.artist)} - ${(v.title)} <br/><iframe allow="encrypted-media" allowtransparency="true" frameborder="0" height="380" src="https://open.spotify.com/embed/track/${v.id}" width="300"></iframe>`);
        return [front, back].join(",")
    }).join("\n");
}

type PlaylistInformation = {
    artist: string,
    title: string,
    previewUrl: string,
    spotifyPlaylist: { name: string, id: string },
    id: string
}

export const getPlaylistInformation: (playlisId: string, access_token: string) => Promise<PlaylistInformation[]> = async (playlistId: string, access_token: string) => {
    const playlist = await utils.apiCall("https://api.spotify.com/v1/playlists/" + playlistId, access_token);

    // Make asynchronous API calls for 100 songs at a time, and put the results (all Promises) in a list.
    let requests = [];
    for (let offset = 0; offset < playlist.tracks.total; offset = offset + 100) {
        requests.push(utils.apiCall(playlist.tracks.href.split('?')[0] + '?offset=' + offset + '&limit=100',
            access_token, offset));
    }
    return Promise.all(requests).then(responses => { // Gather all the data from the responses in a table.
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
};