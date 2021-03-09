export const files = {
    saveAs: (blob, filename) => {
        var a = document.createElement('a');
        const name = filename || blob.name || 'download';
        a.download = name;
        a.rel = 'noopener'; // tabnabbing
        // TODO: detect chrome extensions & packaged apps
        // a.target = '_blank'


        // Support blobs
        a.href = URL.createObjectURL(blob);
        setTimeout(function () {
            URL.revokeObjectURL(a.href);
        }, 4E4); // 40s

        setTimeout(function () {
            click(a);
        }, 0);

    }
}

function click(node) {
    try {
        node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        node.dispatchEvent(evt);
    }
}
