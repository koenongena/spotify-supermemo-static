import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue';
import Buffer from './views/Buffer.vue';
import Schedule from './views/Schedule.vue';
import SpotifyCallback from './views/SpotifyCallback.vue';
import SpotifyPlaylists from './views/SpotifyPlaylists.vue';
import PlaylistDetails from './views/PlaylistDetails.vue';
import firebase from 'firebase';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: "*",
            redirect: "/login"
        },
        {
            path: '/',
            alias: '/home',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/schedule',
            name: 'schedule',
            component: Schedule,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/callback',
            name: 'callback',
            component: SpotifyCallback,
        },
        {
            path: '/spotify-playlists',
            name: 'spotify-playlists',
            component: SpotifyPlaylists,
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
            path: '/buffer',
            name: 'buffer',
            component: Buffer
        },
        {
            path: '/playlists/:name/details',
            name: 'playlistDetails',
            component: PlaylistDetails,
            props: true
        }
    ]
});

router.beforeEach((to, from, next) => {
    let currentUser = firebase.auth().currentUser;
    let pageRequiredAuthentication = to.matched.some(t => t.meta.requiresAuth);
    let isLoginPage = to.matched.some(t => t.path === '/login');

    if (pageRequiredAuthentication && !currentUser) next('login');
    else if (currentUser && isLoginPage) next('home');
    else next()
});

export default router;
