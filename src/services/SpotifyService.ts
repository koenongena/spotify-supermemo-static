import axios, {AxiosResponse} from 'axios';
import SpotifyPlaylist from "../model/SpotifyPlaylist";
import SpotifyTrack from "../model/SpotifyTrack";
import {CreateSpotifyPlaylistResponse} from "@/model/Playlist";

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

    async fetchPlaylists(url: string = "https://api.spotify.com/v1/me/playlists"):Promise<SpotifyPlaylist[]> {
        const self = this;
        let firstPlaylistts = await axios.get(url, {headers: self.headers});
        let playlists = firstPlaylistts.data.items.map((it: any) => new SpotifyPlaylist(it));

        if (firstPlaylistts.data.next) {
            let nextPlaylists = await this.fetchPlaylists(firstPlaylistts.data.next);
            return playlists.concat(nextPlaylists)
        }

        return playlists;
    }

    _fetch(url: string, responses: AxiosResponse[]) {
        const self = this;
        return new Promise<void>((resolve) => {
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
                return responses.flatMap(response => response.data.items.map((json: any) => {
                    let trackWeight = 0;
                    if (playlist.weightedByPopularity) {
                        trackWeight = json.track.popularity;
                    } else {
                        trackWeight = playlist.weight;
                    }

                    return new SpotifyTrack(
                        json.track.id,
                        playlist.name,
                        json.track.artists[0].name,
                        json.track.name,
                        json.track.uri,
                        trackWeight
                    );
                }));
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

    async createPlaylist2(name: string) {
        if (this.userId === null) {
            alert("No spotify user id");
        }

        const self = this;
        let response = await axios.post("https://api.spotify.com/v1/users/" + this.userId + "/playlists", {name: name}, {headers: self.headers});
        return {id: response.data.id, uri: response.data.uri} as CreateSpotifyPlaylistResponse;
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
            return new Promise<void>((resolve) => resolve());
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