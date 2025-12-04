// Professional SVG Decorations Manager
;(() => {
  // Create SVG Blob Shapes
  function createBlobSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute(
      "d",
      `
      M 50,50 Q 30,40 20,60 Q 10,80 20,100 Q 10,120 30,140 Q 50,150 70,150 
      Q 90,160 110,150 Q 130,150 150,140 Q 170,120 180,100 Q 190,80 180,60 
      Q 170,40 150,50 Q 130,40 110,40 Q 90,30 70,40 Q 50,40 50,50
    `,
    )
    path.setAttribute("fill", "currentColor")
    path.setAttribute("opacity", "0.8")

    svg.appendChild(path)
    return svg
  }

  // Create SVG Circles Pattern
  function createCirclePatternSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle1.setAttribute("cx", "60")
    circle1.setAttribute("cy", "60")
    circle1.setAttribute("r", "40")
    circle1.setAttribute("fill", "none")
    circle1.setAttribute("stroke", "currentColor")
    circle1.setAttribute("stroke-width", "2")
    circle1.setAttribute("opacity", "0.6")

    const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle2.setAttribute("cx", "140")
    circle2.setAttribute("cy", "140")
    circle2.setAttribute("r", "50")
    circle2.setAttribute("fill", "none")
    circle2.setAttribute("stroke", "currentColor")
    circle2.setAttribute("stroke-width", "2")
    circle2.setAttribute("opacity", "0.5")

    const circle3 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle3.setAttribute("cx", "100")
    circle3.setAttribute("cy", "100")
    circle3.setAttribute("r", "25")
    circle3.setAttribute("fill", "currentColor")
    circle3.setAttribute("opacity", "0.4")

    svg.appendChild(circle1)
    svg.appendChild(circle2)
    svg.appendChild(circle3)

    return svg
  }

  // Create SVG Grid Pattern
  function createGridPatternSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")

    for (let i = 0; i < 200; i += 25) {
      const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      hLine.setAttribute("x1", "0")
      hLine.setAttribute("y1", i)
      hLine.setAttribute("x2", "200")
      hLine.setAttribute("y2", i)
      hLine.setAttribute("stroke", "currentColor")
      hLine.setAttribute("stroke-width", "1")
      hLine.setAttribute("opacity", "0.3")

      const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      vLine.setAttribute("x1", i)
      vLine.setAttribute("y1", "0")
      vLine.setAttribute("x2", i)
      vLine.setAttribute("y2", "200")
      vLine.setAttribute("stroke", "currentColor")
      vLine.setAttribute("stroke-width", "1")
      vLine.setAttribute("opacity", "0.3")

      group.appendChild(hLine)
      group.appendChild(vLine)
    }

    svg.appendChild(group)
    return svg
  }

  // Create SVG Wave Pattern
  function createWavePatternSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute(
      "d",
      `
      M 0,100 Q 25,75 50,100 T 100,100 T 150,100 T 200,100
      L 200,150 L 0,150 Z
    `,
    )
    path.setAttribute("fill", "currentColor")
    path.setAttribute("opacity", "0.5")

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path2.setAttribute(
      "d",
      `
      M 0,80 Q 20,60 40,80 T 80,80 T 120,80 T 160,80 T 200,80
      L 200,200 L 0,200 Z
    `,
    )
    path2.setAttribute("fill", "currentColor")
    path2.setAttribute("opacity", "0.3")

    svg.appendChild(path)
    svg.appendChild(path2)

    return svg
  }

  // Create SVG Dots Pattern
  function createDotsPatternSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")

    for (let x = 20; x < 200; x += 30) {
      for (let y = 20; y < 200; y += 30) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("cx", x)
        circle.setAttribute("cy", y)
        circle.setAttribute("r", "3")
        circle.setAttribute("fill", "currentColor")
        circle.setAttribute("opacity", Math.random() * 0.6 + 0.2)
        group.appendChild(circle)
      }
    }

    svg.appendChild(group)
    return svg
  }

  // Create SVG Spiral Pattern
  function createSpiralSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute(
      "d",
      `M 100,100 Q 110,90 120,100 T 140,120 T 120,140 T 100,130 T 90,140 T 70,120 T 90,100 T 100,100`,
    )
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", "currentColor")
    path.setAttribute("stroke-width", "2")
    path.setAttribute("opacity", "0.5")

    svg.appendChild(path)
    return svg
  }

  // Create SVG Geometric Pattern
  function createGeometricSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")

    for (let i = 0; i < 5; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("x", 50 + i * 20)
      rect.setAttribute("y", 50 + i * 20)
      rect.setAttribute("width", 100 - i * 40)
      rect.setAttribute("height", 100 - i * 40)
      rect.setAttribute("fill", "none")
      rect.setAttribute("stroke", "currentColor")
      rect.setAttribute("stroke-width", "1")
      rect.setAttribute("opacity", 0.3 - i * 0.05)
      group.appendChild(rect)
    }

    svg.appendChild(group)
    return svg
  }

  // Create SVG Lines Pattern
  function createLinePatternSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 200 200")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")

    for (let i = 0; i < 200; i += 15) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", "0")
      line.setAttribute("y1", i)
      line.setAttribute("x2", "200")
      line.setAttribute("y2", i + 20)
      line.setAttribute("stroke", "currentColor")
      line.setAttribute("stroke-width", "1")
      line.setAttribute("opacity", "0.4")
      group.appendChild(line)
    }

    svg.appendChild(group)
    return svg
  }

  // SVG Pattern pool - More patterns available for variety
  const svgPatterns = [
    createBlobSVG,
    createCirclePatternSVG,
    createGridPatternSVG,
    createWavePatternSVG,
    createDotsPatternSVG,
    createSpiralSVG,
    createGeometricSVG,
    createLinePatternSVG,
  ]

  // Inject SVG decorations into sections
  function injectDecorations() {
    const sections = document.querySelectorAll("section")

    sections.forEach((section, index) => {
      if (section.classList.contains("decorated")) {
        return
      }

      // Check if section has white/light background
      const bgColor = window.getComputedStyle(section).backgroundColor
      if (!isLightBackground(bgColor)) {
        return
      }

      section.style.overflow = "hidden"
      section.style.position = "relative"

      // Wrap section content if not already wrapped
      if (!section.querySelector(".content-layer")) {
        const contentLayer = document.createElement("div")
        contentLayer.className = "content-layer"

        while (section.firstChild) {
          contentLayer.appendChild(section.firstChild)
        }

        section.appendChild(contentLayer)
        section.classList.add("relative-wrapper")
      }

      const positions = ["top-left", "top-right", "bottom-left", "bottom-right", "mid-left", "mid-right"]

      positions.forEach((position) => {
        // Don't add if already exists
        if (section.querySelector(`.svg-decoration.${position}`)) {
          return
        }

        const decorator = document.createElement("div")
        decorator.className = `svg-decoration ${position}`

        const patternIndex = (index + positions.indexOf(position)) % svgPatterns.length
        const svgElement = svgPatterns[patternIndex]()

        decorator.appendChild(svgElement)
        section.insertBefore(decorator, section.firstChild)
      })

      section.classList.add("decorated")
    })
  }

  // Check if background is light
  function isLightBackground(bgColor) {
    // Parse RGB values
    const match = bgColor.match(/\d+/g)
    if (!match || match.length < 3) return true

    const [r, g, b] = match.map(Number).slice(0, 3)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.6
  }

  // Initialize decorations
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", injectDecorations)
    } else {
      injectDecorations()
    }

    // Re-inject on dynamic content changes
    const observer = new MutationObserver(() => {
      injectDecorations()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  // Initialize
  init()
})()
