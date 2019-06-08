const canvas = document.getElementById('warp'), c = canvas.getContext('2d'), LINE_MAX = 7;
let cw, ch, initial = true, q, arrStars = [], arrTextStars = [];
window.onresize = reset;
function Star(x, y, v, w, s, fx = null, t = false) {
    this.x = x; this.y = y
    this.v = v; this.w = w
    this.s = s; this.fx = fx
    this.t = t
    this.draw = () => {
        c.beginPath()
        c.fillStyle = this.s
        c.strokeStyle = this.s
        if (!this.t) {
            c.lineWidth = this.w
            c.moveTo(this.x, this.y)
            c.lineTo(this.x + v, this.y)
            c.stroke()
        }
        c.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2, true)
        c.fill()
    }
    this.update = () => {
        if (this.fx === null) { this.x -= this.v }
        else if (this.fx !== null && this.x > this.fx) { this.x -= this.v }
        else if (this.fx !== null) { this.x = this.fx }
        this.draw()
    }
}
function init() {
    document.title = 'Evan Warner'
    resizeHandler(); starBuilder(); animate(); setTimeout(() => getPixelPoints('Evan Warner', 3, '#ffffff'), 800);
    // setTimeout(() => getPixelPoints('javascript developer', 1.8, 'rgba(255,0,0,.7)'), 2000)
    initial = false
}
function reset() {
    arrStars = []; arrTextStars = [];
    initial = true
    resizeHandler(); starBuilder(); getPixelPoints()
    initial = false
}
function starBuilder(count = q) {
    for (let i = 0; i < count; i++) {
        let x = initial ? Math.floor(Math.random() * cw) + 1 : cw,
            y = Math.random() * ch + 1,
            d = calcDist(1, 600, 2.5),
            rd = Math.floor(Math.min((255 / d) * 300, 255)),
            g = Math.floor(Math.min((255 / d) * 90, 255)),
            b = Math.floor(Math.min((255 / d) * 50, 255)),
            v = Math.min(13 / d, 3),
            w = Math.max(Math.min((LINE_MAX / d) * 7, LINE_MAX), .4),
            s = `rgba(${rd},${g},${b},1)`;
        y = Math.min(y - w, ch);
        arrStars.push(new Star(x, y, v, w, s))
    }
}
function letterParticleBuilder(color) {
    for (i = 0; i < arrTextStars.length; i++) {
        let x = cw,
            y = arrTextStars[i].y,
            v = (cw / 2 / 60) - (Math.random() * 5) + 3,
            w = Math.max(Math.floor(cw * .002), 1),
            s = color,
            fx = arrTextStars[i].x;
        arrStars.push(new Star(x, y, v, w, s, fx, true))
    }
    arrTextStars = []
}
function resizeHandler() {
    cw = canvas.width = window.innerWidth
    ch = canvas.height = window.innerHeight
    q = Math.floor((cw + ch) / 5)
}
function getPixelPoints(keyword, hDiv, color) {
    let temp = document.createElement('canvas'), tempC = temp.getContext('2d');
    temp.width = cw; temp.height = ch
    let gridX = Math.floor(cw * .003) + 1, gridY = gridX, fs = Math.floor(cw * .15);
    tempC.fillStyle = 'red'; tempC.font = `${fs}px Lato sans-serif`
    tempC.fillText(keyword, temp.width / 2 - tempC.measureText(keyword).width / 2, temp.height / hDiv)
    let idata = tempC.getImageData(0, 0, temp.width, temp.height)
    let buffer32 = new Uint32Array(idata.data.buffer)
    if (arrTextStars.length > 0) arrTextStars = []
    for (let y = 0; y < temp.height; y += gridY) {
        for (let x = 0; x < temp.width; x += gridX) {
            if (buffer32[y * temp.width + x]) {
                arrTextStars.push({ x: x, y: y })
            }
        }
    }
    temp = null; tempC = null
    letterParticleBuilder(color)
}
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,.18)'
    c.fillRect(0, 0, cw, ch)
    arrStars.sort(function (a, b) { return a.w - b.w; });
    arrStars.forEach((star, index) => {
        let pos = star.x -= star.v, cont = true
        if (pos <= 0) {
            arrStars.splice(index, 1)
            starBuilder(1)
            cont = false
        }
        if (cont) {
            star.update()
        }
    })
}
function calcDist(min, max, skew) {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = calcDist(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}
window.onload = init()