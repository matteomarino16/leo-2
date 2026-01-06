document.addEventListener('DOMContentLoaded', () => {
  const videos = Array.from(document.querySelectorAll('video'))
  if (videos.length === 0) return

  const configure = video => {
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.controls = false
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('loop', '')
    video.setAttribute('preload', 'auto')
    video.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback nofullscreen')
    video.setAttribute('disablepictureinpicture', '')
    video.setAttribute('disableremoteplayback', '')
    video.tabIndex = -1
    video.setAttribute('aria-hidden', 'true')
  }

  const tryPlay = async video => {
    configure(video)
    try {
      await video.play()
    } catch {}
  }

  videos.forEach(video => {
    tryPlay(video)
    video.addEventListener('loadedmetadata', () => tryPlay(video), { once: true })
    video.addEventListener('canplay', () => tryPlay(video), { once: true })
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return
    videos.forEach(video => tryPlay(video))
  })
})

