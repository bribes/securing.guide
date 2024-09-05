var none = "00000000000000000";
var steamId = none;
var check = 0;

async function updateSteamID() {
    try {
        var prev = check;
        try {
            clearInterval(window.wow)
        } catch { }
        window.wow = setTimeout(async () => {
            if (prev == check) {
                const steamAPI = await fetch("https://cors.faav.top/steam/" + encodeURIComponent(document.getElementById('vanity').value))
                if (steamAPI.status == 200) {
                    const steamData = await steamAPI.json();
                    if (!steamData.error) {
                        document.getElementById('steamid').setAttribute("style", "")
                        document.getElementById('steamid').style.opacity = '1';

                        steamId = steamData.id;
                        document.getElementById('steamid').value = steamId;
                    } else {
                        document.getElementById('steamid').setAttribute("style", "");
                        document.getElementById('steamid').style.opacity = '.15';

                        steamId = none;
                        document.getElementById('steamid').value = steamId;
                    }
                }
            }
        }, 275)
    } catch {
        document.getElementById('steamid').setAttribute("style", "");
        document.getElementById('steamid').style.opacity = '.15';

        steamId = none;
        document.getElementById('steamid').value = steamId;
    }
}

const detectSteam = (path) => {
    var splitArr = document.getElementById('vanity').value.split(path);
    var detectedSteam = splitArr[splitArr.length-1].split('/')[0];
    document.getElementById('vanity').value = detectedSteam;
}

document.getElementById('vanity').addEventListener('input', async function () {
    if (document.getElementById('vanity').value.includes('profiles/')) detectSteam('profiles/')
    else if (document.getElementById('vanity').value.includes('id/')) detectSteam('id/');

    document.getElementById('vanity').value = document.getElementById('vanity').value.replace(/ /g, '');
    check++
    if (document.getElementById('vanity').value.length == 0) {
        document.getElementById('steamid').setAttribute("style", "");
        document.getElementById('steamid').style.opacity = '.15';

        steamId = none;
        document.getElementById('steamid').value = steamId;
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

document.getElementById('steamid').addEventListener('click', () => copyTextToClipboard(steamId));