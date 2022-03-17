import {extractSpotifyPlaylistID} from "@/services/SpotifyService";

describe("extract playlist ID", () => {
    const url = "https://open.spotify.com/playlist/18kEO9urKcJlxkcdAovmn3?si=3ea8aa360efd44eb";

    it('should keep IDs', function () {
        expect(extractSpotifyPlaylistID("18kEO9urKcJlxkcdAovmn3")).toEqual("18kEO9urKcJlxkcdAovmn3");
    });

    it('should extract the ID', function () {
        expect(extractSpotifyPlaylistID(url)).toEqual("18kEO9urKcJlxkcdAovmn3");
    });
})