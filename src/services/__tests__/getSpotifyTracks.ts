import {getTracksFromPlaylist, spotifyDataService} from "@/services/SpotifyService";
import SpotifyPlaylist from "@/model/SpotifyPlaylist";
import SpotifyTrack from "@/model/SpotifyTrack";
import {TRACKS_OF_PLAYLIST} from "@/services/__tests__/sampleSpotifyResponses";

describe("Get the tracks from a playlist", () => {
    let subject: (playlist: SpotifyPlaylist) => Promise<SpotifyTrack[]>;

    beforeEach(() => {
        subject = getTracksFromPlaylist(() => Promise.resolve({data: TRACKS_OF_PLAYLIST}))
    });

    it("has less than 50 tracks", async () => {
        const tracks = await subject(new SpotifyPlaylist({
            id: "somerandomid",
            name: "My Playlist",
            weight: 90
        }));

        expect(tracks).toEqual([]);
    });
})