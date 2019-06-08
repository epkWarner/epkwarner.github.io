let isMobile,
    observer2,
    nav = document.querySelector('nav'),
    canv = document.querySelector('canvas'),
    x = null,
    y = null,
    navLI = false,
    canvLI = true;
const mobileCheck = () => {
    let mob = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    if (!mob) {
        console.log('startObserver')
        startObserver()
    } else {
        document.getElementById('mMenu').classList.replace('hide', 'moMenu')
        nav.classList.add('mobile')
        window.ontouchstart = handleStart
        window.ontouchmove = handleMove
        window.onclick = handleTap
    }
    isMobile = mob
}
const handleStart = e => {
    let fTouch = e.touches[0]
    x = fTouch.clientX
    y = fTouch.clientY
}
const handleMove = e => {
    if (!x || !y) { return }
    let nX = e.changedTouches[0].clientX,
        nY = e.changedTouches[0].clientY,
        xDiff = x - nX,
        yDiff = y - nY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            nav.classList.add('open')
            nav.classList.replace('closeLTR', 'open')
        } else {
            nav.classList.replace('open', 'closeLTR')
        }
    }
    x = null; y = null;
}
const handleTap = e => {
    if (e.clientX < window.innerWidth / 2) {
        nav.classList.replace('open', 'closeLTR')
    } else if (e.target.localName === "a") {
        nav.classList.replace('open', 'closeLTR')
    }
}
const startObserver = () => {
    observer = new IntersectionObserver(handleNavIntersect)
    observer.observe(canv)
}
const handleNavIntersect = (entries, observer) => {
    entries.forEach(entry => {
        let target = entry.target.nodeName,
            intersecting = entry.isIntersecting,
            ratio = entry.intersectionRatio;
        if (intersecting && canvLI === false) {
            nav.classList.remove('sticky')
            canvLI = true
        } else if (!intersecting && canvLI === true) {
            nav.classList.add('sticky')
            canvLI = false
        }
    })
}
window.onload = mobileCheck