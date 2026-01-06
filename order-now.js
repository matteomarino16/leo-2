const IG_DM_LINK = 'https://ig.me/m/weheacreativestudio'

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {}

  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.top = '-9999px'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

const toast = (text) => {
  const el = document.createElement('div')
  el.textContent = text
  el.style.position = 'fixed'
  el.style.left = '50%'
  el.style.bottom = '22px'
  el.style.transform = 'translateX(-50%)'
  el.style.padding = '10px 12px'
  el.style.borderRadius = '12px'
  el.style.background = 'rgba(0,0,0,0.75)'
  el.style.border = '1px solid rgba(255,255,255,0.4)'
  el.style.color = '#fff'
  el.style.fontSize = '14px'
  el.style.zIndex = '99999'
  el.style.backdropFilter = 'blur(10px)'
  el.style.webkitBackdropFilter = 'blur(10px)'
  document.body.appendChild(el)
  window.setTimeout(() => el.remove(), 2200)
}

document.addEventListener('click', (e) => {
  const btn = e.target instanceof Element ? e.target.closest('.card-btn') : null
  if (!btn) return

  const card = btn.closest('.neon-card')
  const nameEl = card ? card.querySelector('.product-name') : null
  const productName = (nameEl && nameEl.textContent ? nameEl.textContent : '').trim()
  const message = productName ? `Ciao! Vorrei ordinare: ${productName}` : 'Ciao! Vorrei ordinare un prodotto.'

  window.open(IG_DM_LINK, '_blank', 'noopener,noreferrer')

  void copyText(message).then((ok) => {
    toast(ok ? 'Messaggio copiato. Incollalo in DM e invia.' : 'Apri DM e incolla il messaggio.')
  })
})

