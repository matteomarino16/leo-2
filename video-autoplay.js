document.addEventListener('DOMContentLoaded', () => {
  const videos = Array.from(document.querySelectorAll('video'))
  if (videos.length === 0) return

  const playVideo = async (video) => {
    try {
      video.muted = true
      video.playsInline = true
      
      if (video.paused) {
        await video.play()
        video.classList.add('playing')
      }
    } catch (err) {
      console.log('Autoplay attempt failed:', err)
      video.classList.remove('playing')
    }
  }

  const configure = video => {
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    
    // Attributes
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('loop', '')
    video.setAttribute('preload', 'auto')
    video.setAttribute('disablepictureinpicture', '')
    video.setAttribute('disableremoteplayback', '')
    
    // Hide controls
    video.controls = false
    video.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback nofullscreen')
    
    // Accessibility
    video.tabIndex = -1
    video.setAttribute('aria-hidden', 'true')
  }

  videos.forEach(video => {
    configure(video)
    playVideo(video)
  })

  // Re-try play on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      videos.forEach(playVideo)
    }
  })

  // Fallback for Mobile/Low Power Mode: Play on first interaction
  const onInteraction = () => {
    videos.forEach(playVideo)
    // We can remove the listeners once we've tried playing
    document.removeEventListener('touchstart', onInteraction)
    document.removeEventListener('click', onInteraction)
  }

  document.addEventListener('touchstart', onInteraction, { passive: true })
  document.addEventListener('click', onInteraction, { passive: true })
  document.addEventListener('scroll', onInteraction, { passive: true, once: true })
})
