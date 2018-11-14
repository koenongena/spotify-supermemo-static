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
        return this._fetchPlaylists("https://api.spotify.com/v1/me/playlists");
    }

    _fetchPlaylists(url) {
        let self = this;


        return axios.get(url, {headers: self.headers})
            .then(response => {
                let data = response.data;
                let playlists = data.items.map(it => new SpotifyPlaylist(it));
                if (data.next) {
                    self._fetchPlaylists(data.next)
                        .then(pls => playlists = playlists.concat(pls));
                }
                return playlists;
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