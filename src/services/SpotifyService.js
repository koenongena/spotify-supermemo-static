import axios from 'axios';
import SpotifyPlaylist from "../model/SpotifyPlaylist";
import SpotifyTrack from "../model/SpotifyTrack";

class SpotifyService {

    constructor() {
        this.spotifyAccessToken = localStorage.getItem('sp-accessToken');
        this.headers = {
            'Authorization': "Bearer " + localStorage.getItem('sp-accessToken')
        };
    }

    fetchPlaylists() {
        let responses = [];
        return this._fetch("https://api.spotify.com/v1/me/playlists", responses)
            .then(() => {
                return responses.flatMap(response => response.data.items.map(it => new SpotifyPlaylist(it)));
            });
    }

    _fetch(url, responses) {
        const self = this;
        return new Promise((resolve) => {
            axios.get(url, {headers: self.headers})
                .then(response => {
                    responses.push(response);
                    if (response.data.next) {
                        self._fetch(response.data.next, responses).then(() => resolve());
                    } else {
                        resolve();
                    }
                })
        });
    }

    /**
     *
     * @param playlist {SpotifyPlaylist}
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getTracks(playlist) {
        let responses = [];
        let url = "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks ";
        return this._fetch(url, responses)
            .then(() => {
                return responses.flatMap(response => response.data.items.map(json => new SpotifyTrack(json.track.id, playlist.name, json.track.artists[0].name, json.track.name)))
            });
    }
}

let spotifyDataService = new SpotifyService();
export {spotifyDataService};