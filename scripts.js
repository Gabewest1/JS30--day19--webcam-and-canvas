const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

video.addEventListener("canplay", paintToCanvas)
getVideo()

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.src = window.URL.createObjectURL(stream)
            video.play()
        })
        .catch(err => console.log(err))
}

function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        let pixels = ctx.getImageData(0, 0, width, height)

        let effect = getEffect()
        pixels = effect(pixels)

        ctx.putImageData(pixels, 0, 0)
    }, 16)
}

function takePhoto() {
    snap.currentTime = 0
    snap.play()

    const data = canvas.toDataURL("img/jpeg")
    const link = document.createElement("a")
    link.href = data
    link.setAttribute("download", "handsome")
    link.innerHTML = `<img src=${data} alt="handsome person" />`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for (var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 100
        pixels.data[i + 1] = pixels.data[i + 1] - 50
        pixels.data[i + 2] = pixels.data[i + 2] * .5 
    }

    return pixels
}

function rgbSplit(pixels) {
    for (var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i]
        pixels.data[i + 100] = pixels.data[i + 1]
        pixels.data[i - 150] = pixels.data[i + 2]
    }

    return pixels
}

function greenScreen(pixels) {
    const levels = {}

    document.querySelectorAll(".rgb input").forEach(input => {
        levels[input.name] = input.value
    })
    console.log("AYYY:", levels)
    for (var i = 0; i < pixels.data.length; i += 4) {
        let red = pixels.data[i]
        let green = pixels.data[i + 1]
        let blue = pixels.data[i + 2]
        let alpha = pixels.data[i + 3]

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax
        ) {
            pixels.data[i + 3] = 0
        }
    }

    return pixels
}

function getEffect() {
    const effectStrategies = {
        "redEffect": redEffect,
        "splitEffect": rgbSplit,
        "greenEffect": greenScreen,
        "default": (pixels) => pixels
    }
    const effects = Array.from(document.querySelectorAll("input[name=effect]"))
    const selectedEffect = effects.find(effect => effect.checked)

    if (selectedEffect) {
        return effectStrategies[selectedEffect.value]
    } else {
        return effectStrategies.default
    }
}
