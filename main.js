import { Grid } from './pathfinding.js'
import { Canvas } from './canvas.js'
import { images, tiles } from './images.js'

window.onload = function () {
// Box width
  var bw = 768
  // Box height
  var bh = 768

  var tileWidth = 64
  var tileHeight = 64

  var leftClickAction = fillOnMouseMove
  var rightClickAction = eraseOnMouseClick
  var tileType = 'black'

  var g = new Grid(10, 10)
  //  g.tiles = [[2, 0], [2, 2]]

  var c = new Canvas(g, tiles, tileWidth, tileHeight)
  var canvas = c.canvas

  var player = {
    x: 1,
    y: 1
  }

  var objective = {
    x: 3,
    y: 3
  }

  function getMousePos (canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }

  function canvasToGrid (x, y) {
    return { x: Math.floor(x / tileWidth), y: Math.floor(y / tileHeight) }
  }

  function fillOnMouseMove (event) {
  // console.log(event);
    const mousePos = getMousePos(canvas, event)
    // console.log(mousePos);
    const { x, y } = canvasToGrid(mousePos.x, mousePos.y)
    if (!((x === player.x && y === player.y) || (x === objective.x && y === objective.y))) {
      g.tiles.push([x, y])
    }

    directionMap = g.breadthFirstSearch([objective.x, objective.y])
  }

  function eraseOnMouseClick (event) {
  // console.log(event);
    const mousePos = getMousePos(canvas, event)
    // console.log(mousePos);

    const { x, y } = canvasToGrid(mousePos.x, mousePos.y)
    g.tiles = g.tiles.filter((t) => !((t[0] === x) && (t[1] === y)))

    directionMap = g.breadthFirstSearch([objective.x, objective.y])
  }

  function placeObjective (event) {
    const mousePos = getMousePos(canvas, event)
    objective = canvasToGrid(mousePos.x, mousePos.y)

    directionMap = g.breadthFirstSearch([objective.x, objective.y])
  }

  canvas.addEventListener('mousedown', function (event) {
    switch (event.which) {
      case 1:
        leftClickAction(event)
        canvas.addEventListener('mousemove', leftClickAction)
        break
      case 3:
        rightClickAction(event)
        canvas.addEventListener('mousemove', rightClickAction)
        break
    }
  })

  canvas.addEventListener('mouseup', function (event) {
    switch (event.which) {
      case 1:
        canvas.removeEventListener('mousemove', leftClickAction)
        break
      case 3:
        canvas.removeEventListener('mousemove', rightClickAction)
        break
    }
  })

  function selectWallTile () {
    leftClickAction = fillOnMouseMove
    tileType = 'brown'
  }

  function selectWaterTile () {
    leftClickAction = fillOnMouseMove
    tileType = 'blue'
  }

  function selectObjective () {
    leftClickAction = placeObjective
  }

  function reset () {
    g.tiles = []
    directionMap = g.breadthFirstSearch([objective.x, objective.y])
  }

  var clearCanvasButton = document.getElementById('resetButton')
  clearCanvasButton.addEventListener('click', reset)

  document.getElementById('wallTileButton').addEventListener('click', selectWallTile)
  document.getElementById('waterTileButton').addEventListener('click', selectWaterTile)
  document.getElementById('selectObjectiveButton').addEventListener('click', selectObjective)

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }

    const keyName = event.key

    if (keyName === 'ArrowUp') {
      player.y -= 1
      if (player.y < 0) {
        player.y = 0
      }
      event.preventDefault()
    } else if (keyName === 'ArrowDown') {
      player.y += 1
      if (player.y >= ((bw / tileWidth) - 1)) {
        player.y = bw / tileWidth - 1
      }
      event.preventDefault()
    } else if (keyName === 'ArrowLeft') {
      player.x -= 1
      if (player.x < 0) {
        player.x = 0
      }
      event.preventDefault()
    } else if (keyName === 'ArrowRight') {
      player.x += 1
      if (player.x >= ((bh / tileHeight) - 1)) {
        player.x = bh / tileHeight - 1
      }
      event.preventDefault()
    }
  }, false)

  function update () {
  }

  function render () {
    c.clearCanvas()
    c.drawBoard(g)
    c.drawTiles(g)
    c.drawObjective(objective)
    c.drawArrows(directionMap)
    c.drawPlayer(player)
  }

  const widthSlider = document.getElementById('widthSlider')
  widthSlider.onchange = function () {
    g.width = this.value
    c.resizeToGrid(g.width, g.height)
  }

  const heightSlider = document.getElementById('heightSlider')
  heightSlider.onchange = function () {
    g.height = this.value
    c.resizeToGrid(g.width, g.height)
  }

  c.resizeToGrid(g.width, g.height)

  // g.draw()
  var directionMap = g.breadthFirstSearch([5, 5])

  render()
  setInterval(render, 1000 / 30)
  setInterval(update, 1000)
}
