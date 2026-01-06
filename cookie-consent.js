document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'cookie_consent_v1'
  const stored = localStorage.getItem(storageKey)
  if (stored === 'accepted') return

  const banner = document.createElement('section')
  banner.className = 'cookie-banner'
  banner.setAttribute('role', 'dialog')
  banner.setAttribute('aria-live', 'polite')
  banner.setAttribute('aria-label', 'Cookie consent')

  banner.innerHTML = `
    <div class="cookie-banner-inner">
      <div class="cookie-banner-text">
        <div class="cookie-banner-title">Cookies</div>
        <div class="cookie-banner-desc">
          Usiamo cookie per migliorare l’esperienza sul sito. Continuando, accetti i cookie.
          <a class="cookie-banner-link" href="cookies.html">Leggi la cookie policy</a>.
        </div>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="cookie-btn cookie-btn-accept">Accetta</button>
      </div>
    </div>
  `

  const acceptBtn = banner.querySelector('.cookie-btn-accept')
  const accept = () => {
    try {
      localStorage.setItem(storageKey, 'accepted')
    } catch {}
    document.cookie = `cookie_consent=accepted; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
    banner.remove()
    document.body.classList.remove('cookie-banner-visible')
  }

  if (acceptBtn) acceptBtn.addEventListener('click', accept)

  document.body.appendChild(banner)
  document.body.classList.add('cookie-banner-visible')
})

