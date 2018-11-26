import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {scheduleService} from "./services/StudyScheduleService";

Vue.use(Vuex);

const Mutations = {
    STUDYMOMENTS: 'STUDYMOMENTS',
    SPOTIFY_ACCESS: 'SPOTIFY_ACCESS'
};

export default new Vuex.Store({
    state: {
        studyMoments: [],
        spotifyAccessToken: null
    },
    mutations: {
        [Mutations.STUDYMOMENTS](state, studyMoments) {
            state.studyMoments = studyMoments;
            state.studyMoments.sort((a, b) => a.playlist < b.playlist);
        },
        [Mutations.SPOTIFY_ACCESS](state, accessToken) {
            state.spotifyAccessToken = accessToken;
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
                let studyMoments = context.state.studyMoments.filter(sm => sm.id !== study.id);
                context.commit(Mutations.STUDYMOMENTS, studyMoments);
            });
        },
        loadSpotifyAccessToken(context) {
            let spotifyAccessToken = localStorage.getItem('sp-accessToken');
            if (spotifyAccessToken) {
                let expirationDate = Date.parse(localStorage.getItem("sp-accessTokenExpiration"));
                if (!expirationDate || expirationDate < new Date()) {
                    context.commit(Mutations.SPOTIFY_ACCESS, null);
                    localStorage.setItem('sp-accessToken', null)
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
        registerSpotifyLoginCallback(context, hashParams){
            context.commit(Mutations.SPOTIFY_ACCESS, hashParams['access_token']);

            localStorage.setItem("sp-accessToken", hashParams['access_token']);
            localStorage.setItem("sp-accessTokenType", hashParams['token_type']);
            localStorage.setItem("sp-accessTokenExpiresIn", hashParams['expires_in']);
            localStorage.setItem("sp-accessTokenExpiration", moment(Date.now()).add(hashParams['expires_in'], 'seconds').toDate());
        }
    }
})
