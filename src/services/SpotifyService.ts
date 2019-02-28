import axios, {AxiosResponse} from 'axios';
import SpotifyPlaylist from "../model/SpotifyPlaylist";
import SpotifyTrack from "../model/SpotifyTrack";

class SpotifyService {
    private spotifyAccessToken?: string | null;
    private userId: string;
    private headers: any;

    constructor() {
        this.updateToken(localStorage.getItem('sp-accessToken'));
        const self = this;
        this.userId = "";

        axios.get("https://api.spotify.com/v1/me", {headers: self.headers})
            .then(response => {
                self.userId = response.data.id;
            })
    }

    fetchPlaylists() {
        let responses: AxiosResponse<any>[] = [];
        return this._fetch("https://api.spotify.com/v1/me/playlists", responses)
            .then(() => {
                return responses.flatMap(response => response.data.items.map((it: any) => new SpotifyPlaylist(it)));
            });
    }

    _fetch(url: string, responses: AxiosResponse[]) {
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

    getTracks(playlist: SpotifyPlaylist) {
        let responses: AxiosResponse[] = [];
        let url = "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks ";
        return this._fetch(url, responses)
            .then(() => {
                return responses.flatMap(response => response.data.items.map((json: any) => new SpotifyTrack(
                    json.track.id,
                    playlist.name,
                    json.track.artists[0].name,
                    json.track.name,
                    json.track.uri,
                    playlist.weight
                )))
            });
    }

    createPlaylist(name: string) {
        if (this.userId === null) {
            alert("No spotify user id");
        }
        const self = this;
        return axios.post("https://api.spotify.com/v1/users/" + this.userId + "/playlists", {name: name}, {headers: self.headers})
            .then(response => response.data.id)
    }

    /**
     *
     * @param playlistId {string}
     * @param songs {Array} of {SpotifyTrack}
     * @return {Promise<any>}
     */
    addTracks(playlistId: string, songs: SpotifyTrack[]): Promise<any> {
        const self = this;
        if (songs.length === 0) {
            return new Promise((resolve) => resolve());
        } else if (songs.length > 100) {
            return Promise.all([
                this.addTracks(playlistId, songs.slice(0, 100)),
                this.addTracks(playlistId, songs.slice(100))
            ]);
        } else {
            let spotifyUris = songs.map((it) => it.uri);
            return axios.post("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks", {uris: spotifyUris}, {headers: self.headers});
        }
    }

    updateToken(accessToken: string | null) {
        this.spotifyAccessToken = accessToken;
        this.headers = {
            'Authorization': "Bearer " + accessToken
        };
    }
}

let spotifyDataService = new SpotifyService();
export {spotifyDataService};