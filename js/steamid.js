const vanity = document.getElementById('vanity');
var none = "00000000000000000";
var steamId = none;
var check = 0;
var noAnim = "transition: opacity 1.8s ease-in-out !important;";

function reInit(data, cb = null) {
    setTimeout(() => {
        if (cb) cb()

        var codeEl = document.createElement('code');
        codeEl.innerHTML = data;
        codeEl.style.opacity = '1';
        codeEl.style['margin-top'] = '10px';
        codeEl.style['padding-bottom'] = '10px';
        codeEl.id = 'steamid';
        codeEl.classList.value = "stat-number odometer odometer-auto-theme";
        document.getElementById('steamid').remove();
        document.getElementById('vanity').after(codeEl);

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
    }, 1760)
}

async function updateSteamID() {
    try {
        var prev = check;
        var wow = setTimeout(async () => {
            if (prev == check) {
                const steamAPI = await fetch("https://cors.faav.top/steam/" + encodeURIComponent(vanity.value))
                if (steamAPI.status == 200) {
                    const steamData = await steamAPI.json();
                    if (!steamData.error) {
                        steamId = steamData.id;

                        document.getElementById('steamid').setAttribute("style",noAnim)
                        document.getElementById('steamid').style.opacity = '1';

                        new Odometer({
                            el: document.getElementById('steamid')
                        });

                        document.getElementById('steamid').innerHTML = steamData.id;
                        reInit(steamData.id)
                    } else {
                        steamId = none;

                        document.getElementById('steamid').setAttribute("style",noAnim);

                        new Odometer({
                            el: document.getElementById('steamid'),
                            value: Number(document.getElementById('steamid').innerText)
                        });

                        document.getElementById('steamid').innerHTML = none;
                    }
                }
            } else {
                clearTimeout(wow)
            }
        }, 240)
    } catch {
        steamId = none;

        document.getElementById('steamid').setAttribute("style",noAnim);

        new Odometer({
            el: document.getElementById('steamid'),
            value: Number(document.getElementById('steamid').innerText)
        });

        document.getElementById('steamid').innerHTML = none;
    }
}

vanity.addEventListener('input', async function () {
    check++
    if (vanity.value.length == 0) {
        steamId = none;

        document.getElementById('steamid').setAttribute("style",noAnim);

        new Odometer({
            el: document.getElementById('steamid'),
            value: Number(document.getElementById('steamid').innerText)
        });

        document.getElementById('steamid').innerHTML = none;
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

new Odometer({
    el: document.getElementById('steamid')
});

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