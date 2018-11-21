<template>
    <div id="app">
        <aside>
            <router-link to="/home">Home</router-link>
            <router-link to="/schedule">Schedule</router-link>
            <router-link to="/import">Import</router-link>
            <router-link to="/spotify-playlists">Spotify playlilsts</router-link>
        </aside>
        <main>
            <router-view/>
        </main>
    </div>
</template>

<style lang="scss">
    @import "./styles/style.scss";
</style>