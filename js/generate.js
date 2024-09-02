const urlParams = new URLSearchParams(window.location.search);
var stepParam = urlParams.get('step');
try {
    if (stepParam) stepParam = Number(stepParam) - 1;
} catch {
    stepParam = null;
}
var currentPage = stepParam ?? 0;
var list = document.getElementById("list");
var pointDisplay = document.getElementById("pointDisplay");
var prevEl = document.getElementById("prevEl");
var nextEl = document.getElementById("nextEl");

function nextPage() {
    if (currentPage == steps.length - 1) return;
    currentPage++
    loadPage(currentPage)
}

function prevPage() {
    if (currentPage == 0) return;
    currentPage--
    loadPage(currentPage)
}

function loadPage(page) {
    if (typeof steps != 'undefined' && steps && steps.length > 0) {
        steps[page].points.forEach((point, i) => {
            var liEl = document.createElement('li');
            var hasMdLink = /^(?=.*\[)(?=.*\])(?=.*\()(?=.*\)).*$/.test(point);

            if (hasMdLink) {
                var textAreaTag = document.createElement("textarea");
                textAreaTag.textContent = point;
                point = textAreaTag.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

                var elements = point.match(/\[.*?\)/g);
                if (elements && elements.length > 0) {
                    for (el of elements) {
                        let text = el.match(/\[(.*?)\]/)[1];
                        let url = el.match(/\((.*?)\)/)[1];
                        let aTag = document.createElement("a");
                        let urlHref = new URL(url);
                        urlHref.protocol = "https:";
                        aTag.href = urlHref;
                        aTag.target = '_blank';
                        aTag.textContent = text;
                        point = point.replace(el, aTag.outerHTML)
                    }
                }
            }

            if (list.children[i]) {
                list.children[i].style.animation = 'fadeInAndOut .35s';
                setTimeout(() => {
                    list.children[i].innerHTML = point;
                    setTimeout(() => list.children[i].style.animation = '', 75)
                }, 175)
            } else {
                liEl.innerHTML = point;
                list.append(liEl)
            }
        });

        if (currentPage == 0) prevEl.setAttribute("disabled", "");
        else prevEl.removeAttribute("disabled")

        if (currentPage == steps.length - 1) nextEl.setAttribute("disabled", "");
        else nextEl.removeAttribute("disabled")

        stepDisplay.innerHTML = `step ${currentPage + 1} of ${steps.length}`;

        if (currentPage == 0) history.pushState('', '', location.pathname)
        else history.pushState('', '', '?step=' + (currentPage + 1));
    }
}

loadPage(currentPage)