export const utils = {

    async apiCall(url: string, access_token: string, delay = 0) {
        await new Promise(r => setTimeout(r, delay)); // JavaScript equivalent of sleep(delay)
        let response = await fetch(url, {headers: {'Authorization': 'Bearer ' + access_token}});
        if (response.ok) {
            return response.json();
        } else if (response.status == 401) {
            alert('Spotify token expired');
        } else {
            alert("The server returned an HTTP " + response.status + " response.");
        } // the caller will fail
    },
}
