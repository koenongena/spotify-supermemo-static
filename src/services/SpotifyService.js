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
        let self = this;

        const fetch = function (url, responses) {
            return new Promise((resolve) => {
                axios.get(url, {headers: self.headers})
                    .then(response => {
                        responses.push(response);
                        if (response.data.next) {
                            fetch(response.data.next, responses).then(() => resolve());
                        } else {
                            resolve();
                        }
                    })
            });
        };
        let responses = [];
        return fetch("https://api.spotify.com/v1/me/playlists", responses)
            .then(() => {
                return responses.flatMap(response => response.data.items.map(it  => new SpotifyPlaylist(it)));
            });


    }

    /**
     *
     * @param playlist {SpotifyPlaylist}
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getTracks(playlist) {
        //TODO als er meer dan 100 items in de lijst zitten => blijven scannen
        const self = this;
        return axios.get("https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks ", {headers: self.headers})
            .then(response => response.data.items.map(it => SpotifyTrack.parse(it)));
    }
}

let spotifyDataService = new SpotifyService();
export {spotifyDataService};