import { Grid, breadthFirstSearch } from './pathfinding.js'
import { Canvas } from './canvas.js'

window.onload = function () {
// Box width
  var bw = 400
  // Box height
  var bh = 400

  var tileWidth = 40
  var tileHeight = 40

  var leftClickAction = fillOnMouseMove
  var rightClickAction = eraseOnMouseClick
  var tileType = 'black'

  var g = new Grid(10, 10)
  //  g.tiles = [[2, 0], [2, 2]]

  var c = new Canvas(g, tileWidth, tileHeight)
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

    directionMap = breadthFirstSearch(g, [objective.x, objective.y])
  }

  function eraseOnMouseClick (event) {
  // console.log(event);
    const mousePos = getMousePos(canvas, event)
    // console.log(mousePos);

    const { x, y } = canvasToGrid(mousePos.x, mousePos.y)
    g.tiles = g.tiles.filter((t) => !((t[0] === x) && (t[1] === y)))

    directionMap = breadthFirstSearch(g, [objective.x, objective.y])
  }

  function placeObjective (event) {
    const mousePos = getMousePos(canvas, event)
    objective = canvasToGrid(mousePos.x, mousePos.y)

    directionMap = breadthFirstSearch(g, [objective.x, objective.y])
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
    directionMap = breadthFirstSearch(g, [objective.x, objective.y])
  }

  var clearCanvasButton = document.getElementById('resetButton')
  clearCanvasButton.addEventListener('click', reset)

  document.getElementById('wallTileButton').addEventListener('click', selectWallTile)
  document.getElementById('waterTileButton').addEventListener('click', selectWaterTile)
  document.getElementById('selectObjectiveButton').addEventListener('click', selectObjective)

  document.addEventListener('keydown', (event) => {
    const keyName = event.key

    if (keyName === 'ArxUp') {
      player.y -= 1
      if (player.y < 0) {
        player.y = 0
      }
    } else if (keyName === 'ArxDown') {
      player.y += 1
      if (player.y >= ((bw / tileWidth) - 1)) {
        player.y = bw / tileWidth - 1
      }
    } else if (keyName === 'ArxLeft') {
      player.x -= 1
      if (player.x < 0) {
        player.x = 0
      }
    } else if (keyName === 'ArxRight') {
      player.x += 1
      if (player.x >= ((bh / tileHeight) - 1)) {
        player.x = bh / tileHeight - 1
      }
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

  g.draw()
  var directionMap = breadthFirstSearch(g, [5, 5])

  render()
  setInterval(render, 1000 / 30)
  setInterval(update, 1000)
}
