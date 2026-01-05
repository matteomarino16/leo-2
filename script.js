document.addEventListener('DOMContentLoaded', () => {
  const body = document.body
  const searchBtn = document.querySelector('.search-btn')
  const menuBtn = document.querySelector('.menu-btn')
  const drawer = document.querySelector('.drawer')
  const drawerClose = document.querySelector('.drawer-close')
  const drawerOverlay = document.querySelector('.drawer-overlay')
  const searchPanel = document.querySelector('.search-panel')
  const searchInput = document.querySelector('.search-input')
  const searchForm = document.querySelector('.search-form')
  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', () => {
      body.classList.toggle('search-open')
      if (body.classList.contains('search-open') && searchInput) searchInput.focus()
    })
  }
  if (menuBtn && drawer) {
    const openDrawer = () => body.classList.add('drawer-open')
    const closeDrawer = () => body.classList.remove('drawer-open')
    menuBtn.addEventListener('click', openDrawer)
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer)
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer)
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer() })
  }
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      const q = searchInput ? searchInput.value.trim() : ''
      if (!q) return
    })
  }
  const results = document.getElementById('search-results')
  if (results) {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      results.textContent = `Results for: ${q}`
      results.style.padding = '24px'
      results.style.fontWeight = '700'
      results.style.fontSize = '20px'
    }
  }
  const svContainer = document.getElementById('sv-container')
  if (svContainer) {
    const promo = 'FREE SHIPPING FOR ALL ORDERS IN ITALY OVER €150.'
    const texts = [promo, promo]
    const numCopies = 6
    const rows = []
    texts.forEach((text, index) => {
      const parallax = document.createElement('div')
      parallax.className = 'parallax'
      const scroller = document.createElement('div')
      scroller.className = 'scroller'
      scroller.dataset.dir = index % 2 !== 0 ? '-1' : '1'
      for (let i = 0; i < numCopies; i++) {
        const span = document.createElement('span')
        span.textContent = text + ' '
        scroller.appendChild(span)
      }
      parallax.appendChild(scroller)
      svContainer.appendChild(parallax)
      rows.push({ baseX: 0, scroller, width: 0 })
    })
    const measure = () => {
      rows.forEach(row => {
        const first = row.scroller.querySelector('span')
        row.width = first ? first.offsetWidth : 0
      })
    }
    measure()
    window.addEventListener('resize', measure)
    let lastT = performance.now()
    let lastY = window.scrollY
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
    const tick = now => {
      const dt = (now - lastT) / 1000
      lastT = now
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      const vps = dt > 0 ? dy / dt : 0
      const factorMag = clamp(Math.abs(vps) / 1000 * 5, 0, 5)
      const sign = Math.sign(vps) || 1
      rows.forEach(row => {
        const dirBase = parseFloat(row.scroller.dataset.dir) || 1
        const direction = dirBase * (sign >= 0 ? 1 : -1)
        const baseVel = 100
        let move = baseVel * dt
        move += direction * move * factorMag
        row.baseX += direction * move
        const w = row.width || 1
        const wrapped = ((row.baseX % w) + w) % w - w
        row.scroller.style.transform = `translateX(${wrapped}px)`
      })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  // Close menu and search on scroll
  window.addEventListener('scroll', () => {
    if (body.classList.contains('search-open')) {
      body.classList.remove('search-open')
      if (searchInput) searchInput.blur()
    }
    if (body.classList.contains('drawer-open')) {
      body.classList.remove('drawer-open')
    }
  })

  class DecryptedText {
    constructor(element, options = {}) {
      this.element = element
      this.originalText = element.textContent.trim()
      this.speed = options.speed || 50
      this.maxIterations = options.maxIterations || 10
      this.sequential = options.sequential === true
      this.revealDirection = options.revealDirection || 'start'
      this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
      this.revealedIndices = new Set()
      this.interval = null
      this.isScrambling = false
      this.triggerElement = options.triggerElement || element
      
      this.init()
    }
  
    init() {
      this.triggerElement.addEventListener('mouseenter', () => this.start())
      this.triggerElement.addEventListener('mouseleave', () => this.stop())
    }
  
    start() {
      this.isScrambling = true
      this.revealedIndices.clear()
      let currentIteration = 0
      
      if (this.interval) clearInterval(this.interval)
      
      this.interval = setInterval(() => {
        this.revealedIndices = this.updateRevealedIndices(this.revealedIndices)
        const newText = this.shuffleText(this.originalText, this.revealedIndices)
        this.element.textContent = newText
        
        if (this.sequential) {
          if (this.revealedIndices.size >= this.originalText.length) {
            this.stop()
          }
        } else {
          currentIteration++
          if (currentIteration >= this.maxIterations) {
            this.stop()
          }
        }
      }, this.speed)
    }
  
    stop() {
      if (this.interval) clearInterval(this.interval)
      this.element.textContent = this.originalText
      this.isScrambling = false
      this.revealedIndices.clear()
    }
  
    updateRevealedIndices(currentSet) {
      if (!this.sequential) return currentSet
      
      const nextIndex = this.getNextIndex(currentSet)
      const newSet = new Set(currentSet)
      newSet.add(nextIndex)
      return newSet
    }
  
    getNextIndex(revealedSet) {
      const textLength = this.originalText.length
      switch (this.revealDirection) { 
        case 'start': 
          return revealedSet.size
        case 'end': 
          return textLength - 1 - revealedSet.size
        case 'center': { 
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealedSet.size / 2)
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1
          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) { 
            return nextIndex
          } 
          for (let i = 0; i < textLength; i++) { 
            if (!revealedSet.has(i)) return i
          } 
          return 0
        } 
        default: 
          return revealedSet.size
      } 
    }
  
    shuffleText(originalText, currentRevealed) {
      const availableChars = this.characters.split('')
      return originalText 
        .split('') 
        .map((char, i) => { 
          if (char === ' ') return ' '
          if (currentRevealed.has(i)) return originalText[i]
          return availableChars[Math.floor(Math.random() * availableChars.length)]
        }) 
        .join('')
    }
  }

  // Apply DecryptedText effect to all products
  document.querySelectorAll('.neon-card').forEach(card => {
    const priceEl = card.querySelector('.product-price')
    const nameEl = card.querySelector('.product-name')

    if (priceEl) {
      new DecryptedText(priceEl, {
        speed: 50,
        sequential: true,
        revealDirection: 'start',
        characters: '0123456789€,.',
        triggerElement: card
      })
    }

    if (nameEl) {
      new DecryptedText(nameEl, {
        speed: 50,
        sequential: true,
        revealDirection: 'start',
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        triggerElement: card
      })
    }
  })

  // Lightbox Functionality
  const galleryItems = document.querySelectorAll('.gallery-item')
  if (galleryItems.length > 0) {
    // Create lightbox elements
    const lightbox = document.createElement('div')
    lightbox.className = 'lightbox'
    lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="Full size image">
      </div>
    `
    document.body.appendChild(lightbox)

    const lightboxImg = lightbox.querySelector('.lightbox-img')
    const lightboxClose = lightbox.querySelector('.lightbox-close')

    // Open Lightbox
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img')
        if (img) {
          lightboxImg.src = img.src
          lightboxImg.alt = img.alt
          lightbox.classList.add('active')
          document.body.style.overflow = 'hidden' // Prevent scrolling
        }
      })
    })

    // Close Lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active')
      document.body.style.overflow = ''
      setTimeout(() => {
        lightboxImg.src = ''
      }, 300)
    }

    lightboxClose.addEventListener('click', closeLightbox)
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox()
      }
    })

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox()
      }
    })
  }

  // CurvedLoop Implementation
  class CurvedLoop {
    constructor(element, options = {}) {
      this.element = element
      this.marqueeText = options.marqueeText || ''
      this.speed = options.speed || 2
      this.className = options.className || ''
      this.curveAmount = options.curveAmount || 400
      this.direction = options.direction || 'left'
      this.interactive = options.interactive !== false // default true

      this.text = this.processText(this.marqueeText)
      this.spacing = 0
      this.offset = 0
      this.uid = Math.random().toString(36).substr(2, 9)
      this.pathId = `curve-${this.uid}`
      this.pathD = `M-100,100 Q500,${100 + this.curveAmount} 1540,100`
      
      this.drag = false
      this.lastX = 0
      this.currentDir = this.direction
      this.vel = 0
      this.rafId = null

      this.init()
    }

    processText(text) {
      const hasTrailing = /\s|\u00A0$/.test(text)
      return (hasTrailing ? text.replace(/\s+$/, '') : text) + '\u00A0'
    }

    init() {
      // Build DOM structure
      this.element.classList.add('curved-loop-jacket')
      if (this.interactive) {
        this.element.style.cursor = 'grab'
      }

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('class', 'curved-loop-svg')
      // Aumentiamo l'altezza del viewBox per accomodare curve più marcate
      // E usiamo curveAmount per determinare l'altezza necessaria
      const viewBoxHeight = Math.max(200, 80 + this.curveAmount + 80)
      svg.setAttribute('viewBox', `0 0 1440 ${viewBoxHeight}`)
      svg.style.maxHeight = '100%' // Assicura che l'SVG non sbordi verticalmente
      
      // Hidden text for measurement
      const measureText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      measureText.setAttribute('xml:space', 'preserve')
      measureText.style.visibility = 'hidden'
      measureText.style.opacity = '0'
      measureText.style.pointerEvents = 'none'
      measureText.textContent = this.text
      svg.appendChild(measureText)

      // Defs with path
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('id', this.pathId)
      path.setAttribute('d', this.pathD)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'transparent')
      defs.appendChild(path)
      svg.appendChild(defs)

      // Visible text wrapper
      const visibleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      visibleText.setAttribute('fontWeight', 'bold')
      visibleText.setAttribute('xml:space', 'preserve')
      if (this.className) visibleText.setAttribute('class', this.className)
      
      const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
      textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${this.pathId}`)
      textPath.setAttribute('xml:space', 'preserve')
      
      visibleText.appendChild(textPath)
      svg.appendChild(visibleText)
      this.element.appendChild(svg)

      this.measureRef = measureText
      this.textPathRef = textPath
      this.visibleText = visibleText

      // Initial measurement
      // We need to wait for DOM to render the text to measure it
      requestAnimationFrame(() => {
        this.spacing = this.measureRef.getComputedTextLength()
        this.updateContent()
        this.startAnimation()
      })

      // Interactivity
      if (this.interactive) {
        this.element.addEventListener('pointerdown', this.onPointerDown.bind(this))
        this.element.addEventListener('pointermove', this.onPointerMove.bind(this))
        this.element.addEventListener('pointerup', this.endDrag.bind(this))
        this.element.addEventListener('pointerleave', this.endDrag.bind(this))
      }
    }

    updateContent() {
      if (!this.spacing) return
      
      const textLength = this.spacing
      const totalText = textLength 
        ? Array(Math.ceil(1800 / textLength) + 2) 
            .fill(this.text) 
            .join('') 
        : this.text
      
      this.textPathRef.textContent = totalText
      
      const initial = -this.spacing
      this.textPathRef.setAttribute('startOffset', initial + 'px')
      this.offset = initial
      this.element.style.visibility = 'visible'
    }

    startAnimation() {
      const step = () => {
        if (!this.drag && this.textPathRef && this.spacing > 0) {
          const delta = this.currentDir === 'right' ? this.speed : -this.speed
          let newOffset = this.offset + delta

          const wrapPoint = this.spacing
          if (newOffset <= -wrapPoint) newOffset += wrapPoint
          if (newOffset > 0) newOffset -= wrapPoint

          this.textPathRef.setAttribute('startOffset', newOffset + 'px')
          this.offset = newOffset
        }
        this.rafId = requestAnimationFrame(step)
      }
      this.rafId = requestAnimationFrame(step)
    }

    onPointerDown(e) {
      if (!this.interactive) return
      this.drag = true
      this.lastX = e.clientX
      this.vel = 0
      this.element.setPointerCapture(e.pointerId)
      this.element.style.cursor = 'grabbing'
    }

    onPointerMove(e) {
      if (!this.interactive || !this.drag || !this.textPathRef) return
      const dx = e.clientX - this.lastX
      this.lastX = e.clientX
      this.vel = dx

      let newOffset = this.offset + dx
      const wrapPoint = this.spacing
      if (newOffset <= -wrapPoint) newOffset += wrapPoint
      if (newOffset > 0) newOffset -= wrapPoint

      this.textPathRef.setAttribute('startOffset', newOffset + 'px')
      this.offset = newOffset
    }

    endDrag() {
      if (!this.interactive) return
      this.drag = false
      this.currentDir = this.vel > 0 ? 'right' : 'left'
      this.element.style.cursor = 'grab'
    }
  }

  // Initialize CurvedLoop in .effect-section
  const effectSection = document.querySelector('.effect-section')
  if (effectSection) {
    new CurvedLoop(effectSection, {
      marqueeText: 'wehea creative studio ✦ ',
      speed: 3,
      curveAmount: 100,
      direction: 'right',
      interactive: true,
      className: 'custom-text-style'
    })
  }
})
