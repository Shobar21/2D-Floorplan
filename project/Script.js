const data = {
  Regions: [
    [
      { X: 0, Y: 0, Z: 52.49343832020996 },
      {
        X: 38.27436931869327,
        Y: 34.868392433523155,
        Z: 52.49343832020996,
      },
    ],
    [
      { X: 0, Y: 100, Z: 52.49343832020996 },
      {
        X: 55.65625908245986,
        Y: 34.86839243352309,
        Z: 52.49343832020996,
      },
    ],
    [
      { X: 100, Y: 100, Z: 52.49343832020996 },
      {
        X: 55.656259082459876,
        Y: 44.38282812906108,
        Z: 52.49343832020996,
      },
    ],
    [
      { X: 100, Y: 0, Z: 52.49343832020996 },
      {
        X: 38.27436931869315,
        Y: 44.38282812906114,
        Z: 52.49343832020996,
      },
    ],
  ],
  Doors: [
    {
      Location: {
        X: 38.11032732394258,
        Y: 37.32902235448528,
        Z: 52.49343832020996,
      },
      Rotation: 4.712388980384696,
      Width: 4.284776902887138,
    },
  ],
  Furnitures: [
    {
      MinBound: { X: -7, Y: -7, Z: -2.4868995751603507e-14 },
      MaxBound: { X: 10, Y: 20, Z: 2.7887139107611625 },
      equipName: 'Equipment 1',
      xPlacement: 80,
      yPlacement: 30,
      rotation: 1.5707963267948966,
      color: '#f4fd59',
    },
    {
      MinBound: {
        X: -2,
        Y: -2,
        Z: -2.6645352591003757e-15,
      },
      MaxBound: {
        X: 2,
        Y: 2,
        Z: 7.083333333333304,
      },
      equipName: 'Equipment 2',
      xPlacement: 70,
      yPlacement: 60,
      rotation: 3.141592653589793,
      color: '#ff6347',
    },
    {
      MinBound: {
        X: -3,
        Y: -3,
        Z: -4.440892098500626e-16,
      },
      MaxBound: {
        X: 3,
        Y: 3,
        Z: 3.2972440944882178,
      },
      equipName: 'Equipment 3',
      xPlacement: 40,
      yPlacement: 60,
      rotation: 3.141592653589793,
      color: '#4682b4',
    },
  ],
}

const canvas = document.getElementById('floorPlanCanvas')
const ctx = canvas.getContext('2d')
const box = document.getElementById('box')

let scaleFactor = 5
let panX = 0
let panY = 0
let isDragging = false
let startX
let startY

const furnitureData = []

function drawFloorPlan() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(panX, panY)
  ctx.scale(scaleFactor, scaleFactor)

  data.Regions.forEach((region) => {
    const startX = region[0].X
    const startY = region[0].Y
    const endX = region[1].X
    const endY = region[1].Y

    ctx.fillStyle = '#d1e7ff'
    ctx.fillRect(startX, startY, endX - startX, endY - startY)
    ctx.strokeRect(startX, startY, endX - startX, endY - startY)
  })

  data.Doors.forEach((door) => {
    const doorX = door.Location.X
    const doorY = door.Location.Y
    const doorWidth = door.Width
    const rotation = door.Rotation

    ctx.save()
    ctx.translate(doorX, doorY)
    ctx.rotate(rotation)
    ctx.fillStyle = '#8b4513'
    ctx.fillRect(-doorWidth / 2, -2, doorWidth, 4)
    ctx.restore()
  })

  data.Furnitures.forEach((furniture) => {
    const xPlacement = furniture.xPlacement
    const yPlacement = furniture.yPlacement
    const width = furniture.MaxBound.X - furniture.MinBound.X
    const height = furniture.MaxBound.Y - furniture.MinBound.Y
    const rotation = furniture.rotation

    ctx.save()
    ctx.translate(xPlacement, yPlacement)
    ctx.rotate(rotation)
    ctx.fillStyle = furniture.color
    ctx.fillRect(-width / 2, -height / 2, width, height)
    ctx.restore()

    furnitureData.push({
      x: xPlacement - width / 2,
      y: yPlacement - height / 2,
      width,
      height,
      equipName: furniture.equipName,
    })
  })

  ctx.restore()
}

drawFloorPlan()

function showbox(equipName, x, y) {
  box.style.left = `${x + 10}px`
  box.style.top = `${y + 10}px`
  box.textContent = equipName
  box.style.display = 'block'
}

function hidebox() {
  box.style.display = 'none'
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect()
  const mouseX = (event.clientX - rect.left - panX) / scaleFactor
  const mouseY = (event.clientY - rect.top - panY) / scaleFactor
  let isHovering = false

  furnitureData.forEach((furniture) => {
    if (
      mouseX >= furniture.x &&
      mouseX <= furniture.x + furniture.width &&
      mouseY >= furniture.y &&
      mouseY <= furniture.y + furniture.height
    ) {
      showbox(furniture.equipName, event.clientX, event.clientY)
      isHovering = true
    }
  })

  if (!isHovering) {
    hidebox()
  }
})

canvas.addEventListener('wheel', (event) => {
  event.preventDefault()
  const zoomFactor = 1.1
  if (event.deltaY < 0) {
    scaleFactor *= zoomFactor
  } else {
    scaleFactor /= zoomFactor
  }
  drawFloorPlan()
})

canvas.addEventListener('mousedown', (event) => {
  isDragging = true
  startX = event.clientX - panX
  startY = event.clientY - panY
  canvas.style.cursor = 'grabbing'
})

canvas.addEventListener('mouseup', () => {
  isDragging = false
  canvas.style.cursor = 'grab'
})

canvas.addEventListener('mousemove', (event) => {
  if (isDragging) {
    panX = event.clientX - startX
    panY = event.clientY - startY
    drawFloorPlan()
  }
})

document.getElementById('up').addEventListener('click', () => {
  panY -= 10
  drawFloorPlan()
})

document.getElementById('down').addEventListener('click', () => {
  panY += 10
  drawFloorPlan()
})

document.getElementById('left').addEventListener('click', () => {
  panX -= 10
  drawFloorPlan()
})

document.getElementById('right').addEventListener('click', () => {
  panX += 10
  drawFloorPlan()
})
