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
  el.style.padding = '12px 16px'
  el.style.borderRadius = '12px'
  el.style.background = 'rgba(0,0,0,0.85)'
  el.style.border = '1px solid rgba(255,255,255,0.4)'
  el.style.color = '#fff'
  el.style.fontSize = '14px'
  el.style.fontWeight = '500'
  el.style.zIndex = '99999'
  el.style.backdropFilter = 'blur(10px)'
  el.style.webkitBackdropFilter = 'blur(10px)'
  el.style.textAlign = 'center'
  el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
  document.body.appendChild(el)
  window.setTimeout(() => el.remove(), 4000)
}

document.addEventListener('click', (e) => {
  const btn = e.target instanceof Element ? e.target.closest('.card-btn') : null
  if (!btn) return

  e.preventDefault()

  const card = btn.closest('.neon-card')
  if (!card) return

  let productName = ''
  
  // Try to find the active slide if pagination exists
  const pagination = card.querySelector('.slider-pagination')
  const slider = card.querySelector('.info-slider')
  
  if (pagination && slider) {
    const dots = Array.from(pagination.querySelectorAll('.dot'))
    const activeDotIndex = dots.findIndex(dot => dot.classList.contains('active'))
    
    // If we found an active dot, use that index. Otherwise default to 0.
    const index = activeDotIndex !== -1 ? activeDotIndex : 0
    const slides = slider.querySelectorAll('.info-slide')
    const slide = slides[index]
    
    if (slide) {
        const nameEl = slide.querySelector('.product-name')
        if (nameEl) productName = nameEl.textContent.trim()
    }
  }
  
  // Fallback if no slider logic worked or no slider exists (e.g. single item cards)
  if (!productName) {
      const nameEl = card.querySelector('.product-name')
      productName = (nameEl && nameEl.textContent ? nameEl.textContent : '').trim()
  }

  // If still empty, generic fallback
  if (!productName) productName = 'Selected Item'

  // Copy product name and show message
  void copyText(productName).then((ok) => {
    toast('The name of the selected item has been copied to your clipboard! Paste it into DM!')
    
    // Small delay to ensure toast is rendered before tab switch might help visibility, 
    // but risk popup blocker. Immediate open is safer for the action.
    window.open(IG_DM_LINK, '_blank', 'noopener,noreferrer')
  })
})
