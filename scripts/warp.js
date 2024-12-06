const canvas = document.getElementById('warp'), ctx = canvas.getContext('2d'), LINE_MAX = 7;
let cnvsWidth, cnvsHeight, firstRender = true, quantStars, arrStars = [], arrTextStars = [], gaussMean = cnvsHeight/2;
window.onresize = reset;

function Star(valXPos, valYPos, valVelocity, valDiameter, valRGB, finalX = null, t = false) {
    this.x = valXPos; this.y = valYPos
    this.v = valVelocity; this.w = valDiameter
    this.s = valRGB; this.fx = finalX
    this.t = t
    this.draw = () => {
        ctx.beginPath()
        ctx.fillStyle = this.s
        ctx.strokeStyle = this.s
        if (!this.t) {
            ctx.lineWidth = this.w
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + valVelocity, this.y)
            ctx.stroke()
        }
        ctx.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2, true)
        ctx.fill()
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
    firstRender = false
}

function reset() {
    arrStars = []; arrTextStars = [];
    firstRender = true
    resizeHandler(); starBuilder(); getPixelPoints()
    firstRender = false
}

//generate parameters for stars
function starBuilder(count = quantStars) {
    for (let i = 0; i < count; i++) {
        let xPos = firstRender ? Math.floor(Math.random() * cnvsWidth) + 1 : cnvsWidth,
            yPos = randomGaussian(cnvsHeight/2,380),
            zPos = calcDist(1, 600, 2.5),
            rgbRed = 255,
            rgbGreen = Math.floor(Math.min((255 / (zPos*Math.random())*70), 210)),
            rgbBlue = Math.floor(Math.min((255 / (zPos*Math.random())*35), 165)),
            velocity = Math.min(15 / zPos, 3),
            diameter = Math.max(Math.min((LINE_MAX / (zPos/2)) * 7, LINE_MAX), .4),
            rgbFinal = `rgba(${rgbRed},${rgbGreen},${rgbBlue},1)`;
        yPos = Math.min(yPos - diameter, cnvsHeight);
        arrStars.push(new Star(xPos, yPos, velocity, diameter, rgbFinal))
    }
}

function letterParticleBuilder(color) {
    for (i = 0; i < arrTextStars.length; i++) {
        let x = cnvsWidth,
            y = arrTextStars[i].y,
            v = (cnvsWidth / 2 / 60) - (Math.random() * 5) + 3,
            w = Math.max(Math.floor(cnvsWidth * .0015), 1),
            s = color,
            fx = arrTextStars[i].x;
        arrStars.push(new Star(x, y, v, w, s, fx, true))
    }
    arrTextStars = []
}

//reevaluate canvas dimensions on resize
function resizeHandler() {
    cnvsWidth = canvas.width = window.innerWidth
    cnvsHeight = canvas.height = window.innerHeight
    quantStars = 900
}

function getPixelPoints(keyword, hDiv, color) {
    //establish temporary canvas, used to break text into pixel data
    let temp = document.createElement('canvas'), tempC = temp.getContext('2d');
    temp.width = cnvsWidth; temp.height = cnvsHeight

    //define sample density for pixels from text in temporary canvas, smaller x increases density (cnvsWidth * x)
    let gridX = Math.floor(cnvsWidth * .003) + 1, gridY = gridX, fs = Math.floor(cnvsWidth * .06);
    
    //set parameters with which to draw text from 'keyword'
    tempC.fillStyle = 'red'; tempC.font = `${fs}px Lato sans-serif`
    tempC.fillText(keyword, temp.width / 2 - tempC.measureText(keyword).width / 2, temp.height / hDiv)
    
    //evaluate image and define pixel positions
    let idata = tempC.getImageData(0, 0, temp.width, temp.height)
    let buffer32 = new Uint32Array(idata.data.buffer)
    
    //clear arrTextStars if data is already present
    arrTextStars = []

    //
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

    //clear previous frame
    ctx.clearRect(0,0,ctx.width,ctx.height)
    //set background color
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, cnvsWidth, cnvsHeight)
    arrStars.sort(function (a, b) { return a.w - b.w; });
    arrStars.forEach((star, index) => {
        ctx.globalAlpha = 1 / (star.v/12)
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
    requestAnimationFrame(animate)
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

function randomGaussian(mean = 0, stdDev = 3) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1] to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  }

window.onload = init()