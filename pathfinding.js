class Grid {
  constructor (width, height) {
    this._width = width
    this._height = height
    this._tiles = (function (width, height) {
      const t = new Array(width)
      for (let x = 0; x < width; x += 1) {
        t[x] = new Array(height)
        for (let y = 0; y < height; y += 1) {
          t[x][y] = 0
        }
      }
      return t
    })(this.width, this.height)
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

  inBounds (id) {
    const [x, y] = id
    return ((x >= 0) && (x < this.width)) && ((y >= 0) && (y < this.height))
  }

  passable (id) {
    return !(id in this.tiles)
  }

  neighbors (id) {
    const [x, y] = id
    let results = [[x + 1, y], [x, y - 1], [x - 1, y], [x, y + 1]]
    // if (x+y) % 2 == 0;
    results = results.filter(this.inBounds, this)
    results = results.filter(this.passable, this)
    return results
  }

  breadthFirstSearch (startPos) {
    const frontier = new Queue()
    frontier.put(startPos)
    const cameFrom = { source: [], dest: [] }
    cameFrom.source.push(startPos)
    cameFrom.dest.push(startPos)

    while (!frontier.empty()) {
      const current = frontier.get()
      for (const next of this.neighbors(current)) {
        if (!(isIn2dArray(cameFrom.dest, next)) && !(isIn2dArray(this.tiles, next))) {
          frontier.put(next)
          cameFrom.source.push(current)
          cameFrom.dest.push(next)
        }
      }
    }
    return cameFrom
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
    if (arr[i][0] === val[0] && arr[i][1] === val[1]) {
      return true
    }
  }
  return false
}

export { Grid }
