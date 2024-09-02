const vanity = document.getElementById('vanity');
var steamId = "00000000000000000";
var check = 0;

async function updateSteamID() {
    try {
        check++
        var prev = check;
        var wow = setTimeout(async () => {
            if (prev == check) {
                const steamAPI = await fetch("https://cors.faav.top/steam/" + vanity.value)
                if (steamAPI.status == 200) {
                    const steamData = await steamAPI.json();
                    if (!steamData.error) {
                        steamId = steamData.id;
                        document.getElementById('steamid').innerHTML = "1" + String(steamData.id) + "1";
                        document.getElementById('steamid').style.opacity = '1';
                    } else {
                        steamId = "00000000000000000";
                        document.getElementById('steamid').innerHTML = "1" + "00000000000000000" + "1";
                        document.getElementById('steamid').style.opacity = '';
                    }
                }
            } else {
                clearTimeout(wow)
            }
        }, 250)
    } catch {
        steamId = "00000000000000000";
        document.getElementById('steamid').innerHTML = "1" + "00000000000000000" + "1";
        document.getElementById('steamid').style.opacity = '';
    }
}

vanity.addEventListener('input', async function () {
    if (vanity.value.length == 0 || vanity.value.length > 32 || vanity.value.length < 3) {
        steamId = "00000000000000000";
        document.getElementById('steamid').innerHTML = "1" + "00000000000000000" + "1";
        document.getElementById('steamid').style.opacity = '';
    } else {
        await updateSteamID();
    }
})

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

document.getElementById('steamid').addEventListener('click', () => copyTextToClipboard(steamId))

tippy('#steamid', {
    content: "Copied!",
    trigger: 'click',
    animation: 'shift-away',
    hideOnClick: false,
    theme: 'translucent',
    offset: [0, -10],
    onShow(instance) {
        setTimeout(() => {
            instance.hide();
        }, 500);
    }
});

document.getElementById('steamid').innerHTML = "1" + "00000000000000000" + "1";