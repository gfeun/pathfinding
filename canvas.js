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
    for (let i = 0; i < this.grid.tiles.length; i++) {
      for (let j = 0; j < this.grid.tiles[i].length; j++) {
        if (this.grid.tiles[i][j]) {
          this.drawTile(this.tiles['wood'], i * this.tileWidth, j * this.tileHeight)
        }
      }
    }
  }

  drawPlayer (player) {
    this.drawTile(this.tiles['hero'], player.x * this.tileWidth, player.y * this.tileHeight)
  }

  drawObjective (objective) {
    this.drawTile(this.tiles['copper_mine'], objective.x * this.tileWidth, objective.y * this.tileHeight)
  }

  // todo: fix inconsistencies between canvas position and grid position
  //
  // x and y are in grid positions
  drawHorizontalLine (x, y) {
    this.context.beginPath()
    this.context.moveTo(x * this.tileWidth + this.tileWidth / 4, y * this.tileHeight + this.tileHeight / 2)
    this.context.lineTo(x * this.tileWidth + 3 * this.tileWidth / 4, y * this.tileHeight + this.tileHeight / 2)
    this.context.strokeStyle = 'black'
    this.context.stroke()
  }

  // x and y are in grid positions
  drawVerticalLine (x, y) {
    this.context.beginPath()
    this.context.moveTo(x * this.tileWidth + this.tileWidth / 2, y * this.tileHeight + this.tileHeight / 4)
    this.context.lineTo(x * this.tileWidth + this.tileWidth / 2, y * this.tileHeight + 3 * this.tileHeight / 4)
    this.context.strokeStyle = 'black'
    this.context.stroke()
  }

  // x and y are in canvas position
  drawCircle (x, y) {
    this.context.beginPath()
    this.context.arc(x, y, this.tileWidth / 8, 0, 2 * Math.PI, false)
    this.context.fillStyle = 'orange'
    this.context.fill()
    this.context.lineWidth = 1
    this.context.strokeStyle = '#003300'
    this.context.stroke()
  }

  drawArrows (directionMap) {
    for (let i = 0; i < directionMap.length; i++) {
      for (let j = 0; j < directionMap[i].length; j++) {
        if (typeof directionMap[i][j] === 'undefined') {
          continue
        }
        const nextX = directionMap[i][j].x
        const nextY = directionMap[i][j].y

        if (i < nextX) {
          this.drawHorizontalLine(i, j)
          this.drawCircle(i * this.tileWidth + this.tileWidth / 2 - this.tileWidth / 4, j * this.tileHeight + this.tileHeight / 2)
        } else if (i > nextX) {
          this.drawHorizontalLine(i, j)
          this.drawCircle(i * this.tileWidth + this.tileWidth / 2 + this.tileWidth / 4, j * this.tileHeight + this.tileHeight / 2)
        } else if (j < nextY) {
          this.drawVerticalLine(i, j)
          this.drawCircle(i * this.tileWidth + this.tileWidth / 2, j * this.tileHeight + this.tileHeight / 2 - this.tileHeight / 4)
        } else if (j > nextY) {
          this.drawVerticalLine(i, j)
          this.drawCircle(i * this.tileWidth + this.tileWidth / 2, j * this.tileHeight + this.tileHeight / 2 + this.tileHeight / 4)
        }
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
