var none = "00000000000000000";
var steamId = none;
var check = 0;
window.initializing = false;

const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

function eventInit() {
    var codeEl = document.createElement('code');
    codeEl.style.opacity = '1';
    codeEl.id = 'steamid';
    codeEl.classList.value = "stat-number odometer odometer-auto-theme";
    var spanEl = document.createElement('span');
    spanEl.innerHTML = steamId;
    spanEl.classList.value = "odometer-digit odometer-digit-spacer";
    if (isMobile) {
        codeEl.style['margin-bottom'] = '-.035em'
        codeEl.style['margin-top'] = '.1825em'
        spanEl.style['line-height'] = "1.35em"
    } else {
        codeEl.style['margin-bottom'] = '.0125em'
        codeEl.style['margin-top'] = '.1825em'
        spanEl.style['line-height'] = "1.2em";
    }
    codeEl.append(spanEl)
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
    window.initializing = false;
    document.getElementById('steamid').removeEventListener('odometerdone', eventInit)
}

function reInit() {
    if (window.initializing == true) return;
    window.initializing = true;

    document.getElementById('steamid').addEventListener('odometerdone', eventInit)
}

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

                        reInit()
                        new Odometer({
                            el: document.getElementById('steamid'),
                            value: steamId
                        });

                        steamId = steamData.id;
                        document.getElementById('steamid').innerHTML = steamId;
                    } else {

                        document.getElementById('steamid').setAttribute("style", "");
                        document.getElementById('steamid').style.opacity = '.15';

                        new Odometer({
                            el: document.getElementById('steamid'),
                            value: steamId
                        });

                        steamId = none;
                        document.getElementById('steamid').innerHTML = steamId;
                    }
                }
            }
        }, 375)
    } catch {
        document.getElementById('steamid').setAttribute("style", "");
        document.getElementById('steamid').style.opacity = '.15';

        new Odometer({
            el: document.getElementById('steamid'),
            value: steamId
        });

        steamId = none;
        document.getElementById('steamid').innerHTML = steamId;
    }
}

document.getElementById('vanity').addEventListener('input', async function () {
    document.getElementById('vanity').value = document.getElementById('vanity').value.trim();
    check++
    if (document.getElementById('vanity').value.length == 0) {
        document.getElementById('steamid').setAttribute("style", "");
        document.getElementById('steamid').style.opacity = '.15';

        new Odometer({
            el: document.getElementById('steamid'),
            value: steamId
        });

        steamId = none;
        document.getElementById('steamid').innerHTML = steamId;
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