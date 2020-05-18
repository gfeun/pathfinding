import { Grid } from './pathfinding'
import { Canvas } from './canvas'
import { tiles } from './images'

window.onload = function () {
//let test = function () {
// Box width
  var bw = 768
  // Box height
  var bh = 768

  var tileWidth = 64
  var tileHeight = 64

  var leftClickAction = fillOnMouseMove
  var rightClickAction = eraseOnMouseClick

  var g = new Grid(8, 8)
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
    const mousePos = getMousePos(canvas, event)
    const { x, y } = canvasToGrid(mousePos.x, mousePos.y)
    if (!((x === player.x && y === player.y) || (x === objective.x && y === objective.y))) {
      g.tiles[x][y] = true
    }

    directionMap = g.playerToObjective(player, objective)
  }

  function eraseOnMouseClick (event) {
    const mousePos = getMousePos(canvas, event)

    const { x, y } = canvasToGrid(mousePos.x, mousePos.y)
    g.tiles[x][y] = false

    directionMap = g.playerToObjective(player, objective)
  }

  function placeObjective (event) {
    const mousePos = getMousePos(canvas, event)
    objective = canvasToGrid(mousePos.x, mousePos.y)

    directionMap = g.playerToObjective(player, objective)
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
  }

  function selectWaterTile () {
    leftClickAction = fillOnMouseMove
  }

  function selectObjective () {
    leftClickAction = placeObjective
  }

  function reset () {
    g.resetTiles()
    directionMap = g.playerToObjective(player, objective)
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
    if ((objective.x === player.x) && (objective.y === player.y)) {
      return
    }

    const futurePos = directionMap[player.x][player.y]
    if (futurePos === undefined) {
      return
    }

    player.x = futurePos.x
    player.y = futurePos.y
  }

  function render () {
    c.clearCanvas()
    c.drawBoard()
    c.drawTiles()
    c.drawObjective(objective)
    c.drawArrows(directionMap)
    c.drawPlayer(player)
  }

  const widthSlider = document.getElementById('widthSlider')
  widthSlider.onchange = function (e: Event) {
    g.width = (e.target as HTMLInputElement).value
    c.resizeToGrid(g.width, g.height)
  }

  const heightSlider = document.getElementById('heightSlider')
  heightSlider.onchange = function (e) {
    g.height = (e.target as HTMLInputElement).value
    c.resizeToGrid(g.width, g.height)
  }

  c.resizeToGrid(g.width, g.height)

  // g.draw()
  var directionMap = g.playerToObjective(player, objective)

  render()
  setInterval(render, 1000 / 10)
  setInterval(update, 1000)
}

window.setTimeout(test, 5000)
