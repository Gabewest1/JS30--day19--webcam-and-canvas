const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

video.addEventListener("canplay", paintToCanvas)

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
getVideo()
