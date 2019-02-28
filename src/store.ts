import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {scheduleService} from "./services/StudyScheduleService";
import {spotifyDataService} from "./services/SpotifyService";
import {bufferService} from "./services/BufferService";
import {Playlist, StudyMoment} from "@/model/Playlist";
import SpotifyTrack from "@/model/SpotifyTrack";
import SpotifyPlaylist from "@/model/SpotifyPlaylist";

Vue.use(Vuex);

const Mutations = {
    STUDYMOMENTS: 'STUDYMOMENTS',
    SPOTIFY_ACCESS: 'SPOTIFY_ACCESS'
};

interface MyState {
    studyMoments: StudyMoment[];
    spotifyAccessToken: string | null;
    unscannedPlaylists: SpotifyPlaylist[];
    newSongs: SpotifyTrack[];
    loading: boolean;
    loadingMessage:string;
}

const state: MyState = {
    studyMoments: [],
    spotifyAccessToken: null,
    unscannedPlaylists: [],
    newSongs: [],
    loading: false,
    loadingMessage: ""

};

export default new Vuex.Store({
    state: state,
    mutations: {
        [Mutations.STUDYMOMENTS](state, studyMoments) {
            state.studyMoments = studyMoments;
            state.studyMoments.sort();
        },
        [Mutations.SPOTIFY_ACCESS](state, accessToken) {
            state.spotifyAccessToken = accessToken;
            spotifyDataService.updateToken(accessToken);
        }
    },
    actions: {
        loadStudyMoments(context) {
            scheduleService.getTodoList().then(studyMoments => {
                context.commit(Mutations.STUDYMOMENTS, studyMoments);
            });

        },
        setPlaylistDone(context, study) {
            scheduleService.setDone(study).then(() => {
                let studyMoments = context.state.studyMoments.filter((sm: any) => sm.id !== study.id);
                context.commit(Mutations.STUDYMOMENTS, studyMoments);
            });
        },

        addPlaylist() {
            scheduleService.create(new Date())
                .then((playlistName) => alert("Playlist " + playlistName + " added successfully"))
        },
        loadSpotifyAccessToken(context) {
            let spotifyAccessToken = localStorage.getItem('sp-accessToken');
            if (spotifyAccessToken) {
                let expirationDate = Date.parse(localStorage.getItem("sp-accessTokenExpiration")!!);
                if (!expirationDate || new Date(expirationDate) < new Date()) {
                    context.commit(Mutations.SPOTIFY_ACCESS, null);
                    localStorage.setItem('sp-accessToken', "")
                } else {
                    context.commit(Mutations.SPOTIFY_ACCESS, spotifyAccessToken);
                }
            }
        },
        registerSpotifyToken(context) {
            let accessToken = localStorage.getItem('sp-accessToken');
            //let expiration = localStorage.getItem('sp-accessTokenExpiresIn');
            context.commit(Mutations.SPOTIFY_ACCESS, accessToken);
        },
        registerSpotifyLoginCallback(context, hashParams) {
            context.commit(Mutations.SPOTIFY_ACCESS, hashParams['access_token']);

            localStorage.setItem("sp-accessToken", hashParams['access_token']);
            localStorage.setItem("sp-accessTokenType", hashParams['token_type']);
            localStorage.setItem("sp-accessTokenExpiresIn", hashParams['expires_in']);
            localStorage.setItem("sp-accessTokenExpiration", moment(Date.now()).add(hashParams['expires_in'], 'seconds').toDate().toISOString());
        },
        fetchUnscannedPlaylists(context) {
            context.state.unscannedPlaylists = [];

            let _isSupermemoPlaylist = function (pl: SpotifyPlaylist) {
                return new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(pl.name);

            };

            let addIfUnscanned = function (pl: SpotifyPlaylist) {
                scheduleService.getPlaylistsWithName(pl.name)
                    .then(playlist => {
                        if (!playlist.scanned) {
                            // playlists.push(pl);
                            context.state.unscannedPlaylists.push(pl);
                        }
                    });
            };

            let addPlaylists = function (playlists: SpotifyPlaylist[]) {
                for (const playlist of playlists) {
                    if (_isSupermemoPlaylist(playlist)) {
                        addIfUnscanned(playlist);
                    }
                }
            };

            context.state.loading = true;
            context.state.loadingMessage = "Fetching playlists";
            spotifyDataService
                .fetchPlaylists()
                .then(playlists => {
                    context.state.loadingMessage = `Found ${playlists.map((p) => p.name)}`;
                    addPlaylists(playlists)

                });
        },
        async findNewSongs(context) {
            context.state.newSongs = [];

            function handleNEwTrack(track: SpotifyTrack) {
                let existingTrack = context.state.newSongs.find((s) => s.id === track.id);
                if (existingTrack) {
                    if (existingTrack.weight < track.weight)
                        existingTrack.weight = track.weight;
                } else {
                    context.state.newSongs.push(track);
                }
            }

            function investigateTracks(tracks: SpotifyTrack[]) {
                for (const track of tracks) {
                    scheduleService.isNew(track).then(b => {
                        if (b) {
                            handleNEwTrack(track);
                        }
                    })
                }
            }

            context.state.loading = true;

            const playlists = await scheduleService.getTrackedPlaylists();
            for (const playlist of playlists) {
                context.state.loadingMessage = "Getting tracks of playlist " + playlist.name;

                const tracks = await spotifyDataService.getTracks(playlist);
                await investigateTracks(tracks);
            }

            context.state.loading = false;
        },
        scanPlaylist(context, playlist) {
            let markPlaylistScanned = function () {
                playlist.scanned = true;
                return scheduleService.savePlaylist(playlist);
            }.bind(this);

            let saveTracks = function (tracks: SpotifyTrack[]) {
                return Promise.all(tracks.map(track => scheduleService.saveTrack(track)))
                    .then(() => markPlaylistScanned());
            };
            return spotifyDataService.getTracks(playlist)
                .then(tracks => saveTracks(tracks));
        },
        createPlaylistFromNewSongs(context) {
            spotifyDataService.createPlaylist("New playlist")
                .then((playlistId) => {
                    spotifyDataService.addTracks(playlistId, context.state.newSongs)
                });
        },
        addToBuffer(context) {
            bufferService.addToBuffer(context.state.newSongs)
                .then(() => {
                    context.state.newSongs = [];
                });
        }
    }
})
