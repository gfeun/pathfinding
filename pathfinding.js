class Grid {
  constructor (width, height) {
    this._width = width
    this._height = height
    this.resetTiles()
  }

  get width () {
    return this._width
  }

  set width (w) {
    this._width = w
  }

  get height () {
    return this._height
  }

  set height (h) {
    this._height = h
  }

  get tiles () {
    return this._tiles
  }

  set tiles (t) {
    this._tiles = t
  }

  resetTiles () {
    this._tiles = (function (width, height) {
      const t = new Array(width)
      for (let x = 0; x < width; x += 1) {
        t[x] = new Array(height)
        for (let y = 0; y < height; y += 1) {
          t[x][y] = false
        }
      }
      return t
    })(this.width, this.height)
  }

  inBounds (id) {
    return ((id.x >= 0) && (id.x < this.width)) && ((id.y >= 0) && (id.y < this.height))
  }

  passable (id) {
    return !(this.tiles[id.x][id.y])
  }

  neighbors (id) {
    let results = [{ x: id.x + 1, y: id.y }, { x: id.x, y: id.y - 1 }, { x: id.x - 1, y: id.y }, { x: id.x, y: id.y + 1 }]
    // if (x+y) % 2 == 0;
    results = results.filter(this.inBounds, this)
    results = results.filter(this.passable, this)
    return results
  }

  breadthFirstSearch (objective) {
    const frontier = new Queue()
    frontier.put(objective)
    const directionMap = new Array(this._width)
    for (let i = 0; i < this._width; i++) {
      directionMap[i] = new Array(this._height)
    }

    while (!frontier.empty()) {
      const current = frontier.get()
      for (const next of this.neighbors(current)) {
        if ((directionMap[next.x][next.y] === undefined) && !(isIn2dArray(this.tiles, next))) {
          frontier.put(next)
          directionMap[next.x][next.y] = current
        }
      }
    }

    return directionMap
  }

  playerToObjective (player, objective) {
    const directionMap = this.breadthFirstSearch(objective)

    const playerToObjectivePath = new Array(this._width)
    for (let i = 0; i < this._width; i++) {
      playerToObjectivePath[i] = new Array(this._height)
    }

    directionMap[objective.x][objective.y] = objective

    let currentPos = directionMap[player.x][player.y]
    playerToObjectivePath[player.x][player.y] = directionMap[player.x][player.y]

    if (typeof currentPos === 'undefined') { // No path from player to objective exists
      return playerToObjectivePath
    }

    while ((currentPos.x !== objective.x) || (currentPos.y !== objective.y)) {
      playerToObjectivePath[currentPos.x][currentPos.y] = directionMap[currentPos.x][currentPos.y]
      currentPos = directionMap[currentPos.x][currentPos.y]
    }
    return playerToObjectivePath
  }

  draw () {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (!([i, j] in this.tiles)) {
          console.log('.')
        } else {
          console.log('#')
        }
      }
    }
  }
}

class Queue {
  constructor () {
    this.queue = []
  }

  empty () {
    return !(this.queue.length > 0)
  }

  put (x) {
    this.queue.push(x)
  }

  get () {
    return this.queue.shift()
  }
}

function isIn2dArray (arr, val) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j][0] === val.x && arr[i][j][1] === val.y) {
        return true
      }
    }
  }
  return false
}

export { Grid }
