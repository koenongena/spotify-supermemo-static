import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {scheduleService} from "./services/StudyScheduleService";
import {spotifyDataService} from "./services/SpotifyService";
import {bufferService} from "./services/BufferService";
import {CreateSpotifyPlaylistResponse, StudyMoment} from "@/model/Playlist";
import SpotifyTrack from "@/model/SpotifyTrack";
import SpotifyPlaylist from "@/model/SpotifyPlaylist";
import {shuffle} from "@/utils/arrays";

Vue.use(Vuex);

const Mutations = {
    STUDYMOMENTS: 'STUDYMOMENTS',
    SPOTIFY_ACCESS: 'SPOTIFY_ACCESS',
    BUFFER: 'BUFFER',
    LOADING: "LOADING",
    TRACKED_PLAYLISTS: "TRACKED_PLAYLISTS"
};

interface MyState {
    studyMoments: StudyMoment[];
    spotifyAccessToken: string | null;
    unscannedPlaylists: SpotifyPlaylist[];
    trackedPlaylists: SpotifyPlaylist[];
    newSongs: SpotifyTrack[];
    loading: boolean;
    loadingMessage: string;
    buffer: SpotifyTrack[];
}

const state: MyState = {
    studyMoments: [],
    spotifyAccessToken: null,
    unscannedPlaylists: [],
    newSongs: [],
    loading: false,
    loadingMessage: "",
    buffer: [],
    trackedPlaylists: []

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
        },
        [Mutations.BUFFER](state, buffer) {
            state.buffer = buffer;
        },
        [Mutations.LOADING](state, l) {
            state.loading = l;
        },
        [Mutations.TRACKED_PLAYLISTS](state, playlists) {
            state.trackedPlaylists = playlists;
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

        addPlaylist(context, spotifyPlaylistId?: string) {
            scheduleService.create(new Date(), spotifyPlaylistId)
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
        spotifyLogin(context) {
            const CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
            const REDIRECT_URI = process.env.VUE_APP_SPOTIFY_REDIRECT_URL;

            function getLoginURL(scopes: string[]) {
                return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                    '&scope=' + encodeURIComponent(scopes.join(' ')) +
                    '&response_type=token';
            }

            const url = getLoginURL(['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public']),
                width = 450,
                height = 730,
                left = (screen.width / 2) - (width / 2),
                top = (screen.height / 2) - (height / 2);


            const spotifyLoginWindow = window.open(url,
                'Spotify',
                'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
            );

            spotifyLoginWindow!!.onbeforeunload = function () {
                context.dispatch('registerSpotifyToken');
            };
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
            context.state.loadingMessage = "Scanning playlists";
            spotifyDataService
                .fetchPlaylists()
                .then(async playlists => {
                    context.state.loadingMessage = `Found ${playlists.map((p) => p.name)}`;
                    await addPlaylists(playlists);
                    context.state.loading = false;

                });
        },
        async findNewSongs(context) {
            context.state.newSongs = [];

            async function handleNewTrack(track: SpotifyTrack) {
                scheduleService.getBuffered(track.id).then((bufferedTrack) => {
                    if (bufferedTrack && bufferedTrack.weight < track.weight) {
                        context.state.newSongs.push(track);
                    } else if (!bufferedTrack) {
                        context.state.newSongs.push(track);
                    }
                });
            }

            function investigateTracks(tracks: SpotifyTrack[]) {
                for (const track of tracks) {
                    scheduleService.isStudied(track).then(newSong => {
                        if (newSong) {
                            handleNewTrack(track)
                        }

                    })
                }
            }

            context.state.loading = true;

            const playlists = await scheduleService.getTrackedPlaylists();
            for (const playlist of playlists) {
                context.state.loadingMessage = "Getting tracks of playlist " + playlist.name;

                const tracks = await spotifyDataService.getTracks(playlist);
                if (playlist.restudy) {
                    await tracks.forEach((track) => handleNewTrack(track));
                } else {
                    await investigateTracks(tracks);
                }
            }

            context.state.loading = false;
        },
        async scanPlaylist(context, playlist: SpotifyPlaylist) {
            await scanSpotifyPlaylist(playlist, (loading: boolean) => {
                context.commit(Mutations.LOADING, loading);
            });
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
        },
        loadBuffer(context) {
            context.commit(Mutations.LOADING, true);
            context.commit(Mutations.BUFFER, []);

            return bufferService.getBuffer()
                .then(it => context.commit(Mutations.BUFFER, it))
                .then(() => context.commit(Mutations.LOADING, false))
        },
        loadTrackedPlaylists(context) {
            return scheduleService.getTrackedPlaylists().then(playlists => {
                context.commit(Mutations.TRACKED_PLAYLISTS, playlists);
            });
        },
        popFromBuffer(context, count) {
            createFromBuffer(context, count, context.state.buffer);
        },
        randomFromBuffer(context, count) {
            createFromBuffer(context, count, shuffle(context.state.buffer));
        }

    }
})

const createFromBuffer = async (context: any, count: number, buffer: SpotifyTrack[]) => {
    await context.commit(Mutations.LOADING, true);

    const songsToAddToPlaylist = buffer.slice(0, count);
    let songsToKeepInBuffer = buffer.slice(count);

    let playlistName = moment().format("YYYY-MM-DD");

    let spotifyPlaylist = await scheduleService.getPlaylistsWithName(playlistName);

    if (!spotifyPlaylist.id) {
        //create spotify playlist and add to table
        let createResponse: CreateSpotifyPlaylistResponse = await spotifyDataService.createPlaylist2(playlistName);
        spotifyPlaylist = new SpotifyPlaylist({
            id: createResponse.id,
            uri: createResponse.uri,
            name: playlistName,
            scanned: false
        });
        await scheduleService.savePlaylist(spotifyPlaylist);

        await scheduleService.create(new Date(), spotifyPlaylist.id);
    }


    await spotifyDataService.addTracks(spotifyPlaylist.id, songsToAddToPlaylist);
    await bufferService.deleteFromBuffer(songsToAddToPlaylist);

    await context.commit(Mutations.BUFFER, songsToKeepInBuffer);
    await context.commit(Mutations.LOADING, false);
};

export const scanSpotifyPlaylist = async (playlist: SpotifyPlaylist, toggleLoading: (b: boolean) => void) => {
    toggleLoading(true);

    const tracks = await spotifyDataService.getTracks(playlist);
    // save tracks
    await Promise.all(tracks.map(track => scheduleService.saveTrack(track)));
    //set playlist to scanned
    playlist.scanned = true;

    await scheduleService.savePlaylist(playlist);

    toggleLoading(false);
};