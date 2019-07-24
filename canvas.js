class Canvas {
  constructor (grid, tiles, tileWidth, tileHeight) {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.context.translate(0.5, 0.5)
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.grid = grid
    this.tiles = tiles
  }

  get grid () {
    return this._grid
  }

  set grid (g) {
    this._grid = g
  }

  resizeToGrid (gridWidth, gridHeight) {
    console.log('Grid Width', gridWidth, this.tileWidth)
    console.log('Grid Height', gridHeight, this.tileHeight)
    this.canvas.width = gridWidth * this.tileWidth
    this.canvas.height = gridHeight * this.tileHeight
  }

  drawBoard () {
    for (let x = 0; x <= this.grid.width; x += 1) {
      for (let y = 0; y <= this.grid.width; y += 1) {
        this.drawTile(this.tiles['grass'], x * this.tileWidth, y * this.tileHeight)
      }
    }
  }

  drawTiles () {
    for (const [x, y] of this.grid.tiles) {
      this.drawTile(this.tiles['wood'], x * this.tileWidth, y * this.tileHeight)
    }
  }

  drawPlayer (player) {
    this.drawTile(this.tiles['hero'], player.x * this.tileWidth, player.y * this.tileHeight)
  }

  drawObjective (objective) {
    this.drawTile(this.tiles['copper_mine'], objective.x * this.tileWidth, objective.y * this.tileHeight)
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

  drawTile (tile, x, y) {
    if (tile === undefined) {
      return
    }

    try {
      this.context.drawImage(tile, x, y)
    } catch (error) {
      console.error(error, tile, x, y)
    }
  }

  clearCanvas () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export { Canvas }
