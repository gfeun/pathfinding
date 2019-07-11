class Canvas {
  constructor (grid, tileWidth, tileHeight) {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.context.translate(0.5, 0.5)
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.grid = grid
  }

  get grid () {
    return this._grid
  }

  set grid (g) {
    this._grid = g
  }

  resizeToGrid (gridWidth, gridHeight) {
    this.canvas.width = gridWidth * this.tileWidth
    this.canvas.height = gridHeight * this.tileHeight
  }

  drawBoard () {
    for (var x = 0; x <= this.grid.width; x += 1) {
      this.context.beginPath()
      this.context.moveTo(x * this.tileWidth, 0)
      this.context.lineTo(x * this.tileWidth, this.grid.height * this.tileWidth)
      this.context.strokeStyle = 'black'
      this.context.stroke()
    }

    for (var y = 0; y <= this.grid.height; y += 1) {
      this.context.beginPath()
      this.context.moveTo(0, y * this.tileHeight)
      this.context.lineTo(this.grid.width * this.tileWidth, y * this.tileHeight)
      this.context.strokeStyle = 'black'
      this.context.stroke()
    }
  }

  drawTiles () {
    for (const [x, y] of this.grid.tiles) {
      this.context.beginPath()
      this.context.rect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight)
      this.context.fillStyle = 'black'
      this.context.fill()
    }
  }

  drawPlayer (player) {
    this.context.beginPath()
    this.context.arc(player.x * this.tileWidth + this.tileWidth / 2, player.y * this.tileHeight + this.tileHeight / 2, this.tileWidth / 2, 0, 2 * Math.PI, false)
    this.context.fillStyle = 'green'
    this.context.fill()
    this.context.lineWidth = 1
    this.context.strokeStyle = '#003300'
    this.context.stroke()
  }

  drawObjective (objective) {
    this.context.beginPath()
    this.context.arc(objective.x * this.tileWidth + this.tileWidth / 2, objective.y * this.tileHeight + this.tileHeight / 2, this.tileWidth / 2, 0, 2 * Math.PI, false)
    this.context.fillStyle = 'yellow'
    this.context.fill()
    this.context.lineWidth = 1
    this.context.strokeStyle = '#003300'
    this.context.stroke()
  }

  drawArrows (directionMap) {
    for (let i = 0; i < directionMap.dest.length; i++) {
      if (directionMap.source[i][0] < directionMap.dest[i][0]) {
        this.context.beginPath()
        this.context.moveTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2)
        this.context.lineTo(directionMap.dest[i][0] * this.tileWidth + 3 * this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2)
        this.context.strokeStyle = 'black'
        this.context.stroke()

        this.context.beginPath()
        this.context.arc(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2 - this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2, this.tileWidth / 8, 0, 2 * Math.PI, false)
        this.context.fillStyle = 'orange'
        this.context.fill()
        this.context.lineWidth = 1
        this.context.strokeStyle = '#003300'
        this.context.stroke()
      } else if (directionMap.source[i][0] > directionMap.dest[i][0]) {
        this.context.beginPath()
        this.context.moveTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2)
        this.context.lineTo(directionMap.dest[i][0] * this.tileWidth + 3 * this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2)
        this.context.strokeStyle = 'black'
        this.context.stroke()

        this.context.beginPath()
        this.context.arc(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2 + this.tileWidth / 4, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2, this.tileWidth / 8, 0, 2 * Math.PI, false)
        this.context.fillStyle = 'orange'
        this.context.fill()
        this.context.lineWidth = 1
        this.context.strokeStyle = '#003300'
        this.context.stroke()
      } else if (directionMap.source[i][1] < directionMap.dest[i][1]) {
        this.context.beginPath()
        this.context.moveTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 4)
        this.context.lineTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + 3 * this.tileHeight / 4)
        this.context.strokeStyle = 'black'
        this.context.stroke()

        this.context.beginPath()
        this.context.arc(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2 - this.tileHeight / 4, this.tileWidth / 8, 0, 2 * Math.PI, false)
        this.context.fillStyle = 'orange'
        this.context.fill()
        this.context.lineWidth = 1
        this.context.strokeStyle = '#003300'
        this.context.stroke()
      } else if (directionMap.source[i][1] > directionMap.dest[i][1]) {
        this.context.beginPath()
        this.context.moveTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 4)
        this.context.lineTo(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + 3 * this.tileHeight / 4)
        this.context.strokeStyle = 'black'
        this.context.stroke()

        this.context.beginPath()
        this.context.arc(directionMap.dest[i][0] * this.tileWidth + this.tileWidth / 2, directionMap.dest[i][1] * this.tileHeight + this.tileHeight / 2 + this.tileHeight / 4, this.tileWidth / 8, 0, 2 * Math.PI, false)
        this.context.fillStyle = 'orange'
        this.context.fill()
        this.context.lineWidth = 1
        this.context.strokeStyle = '#003300'
        this.context.stroke()
      }
    }
  }

  clearCanvas () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawBoard()
  }
}

export { Canvas }
