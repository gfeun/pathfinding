
window.onload = function() {
  // Box width
  var bw = 400;
  // Box height
  var bh = 400;

  var tileWidth = 40;
  var tileHeight = 40;

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var leftClickAction = fillOnMouseMove;
  var rightClickAction = eraseOnMouseClick;
  var tileType = "black"
  var player = {
    x : 1,
    y : 1
  }

  var objective = {
    x : 3,
    y : 3
  }

  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.tiles = (function(width, height) {
        let t = new Array(width);
        for (let x = 0; x < width; x +=1) {
          t[x] = new Array(height);
          for (let y = 0; y < height; y +=1) {
            t[x][y] = 0;
          }
        }
        return t;
      })(this.width, this.height);

    }

    in_bounds(id) {
      let [x, y] = id;
      return ((0 <= x) && (x < this.width)) && ((0 <= y) && (y < this.height));
    }

    passable(id) {
      return !(id in this.tiles);
    }

    neighbors(id) {
      let [x, y] = id;
      let results = [[x + 1, y], [x, y-1], [x-1, y], [x, y+1]]
      //if (x+y) % 2 == 0;
      results = results.filter(this.in_bounds, this);
      results = results.filter(this.passable, this);
      return results;
    }
  }

  class Queue {
    constructor() {
      this.queue = [];
    }

    empty() {
      return !(this.queue.length > 0);
    }

    put(x) {
      this.queue.push(x);
    }

    get() {
      return this.queue.shift();
    }
  }


  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function canvasToGrid(x, y) {
    return { x: Math.floor(x / tileWidth), y: Math.floor(y / tileHeight)};
  }

  function fillOnMouseMove(event) {
    //console.log(event);
    mousePos = getMousePos(canvas, event);
    //console.log(mousePos);
    let {x, y} = canvasToGrid(mousePos.x, mousePos.y);
    if (!((x == player.x && y == player.y) || (x == objective.x && y == objective.y))) {
      g.tiles.push([x,y]);
    }

    direction_map = breadth_first_search(g, [objective.x, objective.y])
  }

  function eraseOnMouseClick(event) {
    //console.log(event);
    mousePos = getMousePos(canvas, event);
    //console.log(mousePos);

    let {x, y} = canvasToGrid(mousePos.x, mousePos.y);
    g.tiles = g.tiles.filter((t) => !((t[0] == x) && (t[1] == y)));

    direction_map = breadth_first_search(g, [objective.x, objective.y])
  }

  function placeObjective(event) {
    mousePos = getMousePos(canvas, event);
    objective = canvasToGrid(mousePos.x, mousePos.y);

    direction_map = breadth_first_search(g, [objective.x, objective.y])
  }

  canvas.addEventListener('mousedown', function(event) {
    switch (event.which) {
      case 1:
        leftClickAction(event);
        canvas.addEventListener('mousemove', leftClickAction);
        break;
      case 3:
        rightClickAction(event);
        canvas.addEventListener('mousemove', rightClickAction);
        break;
    }
  });

  canvas.addEventListener('mouseup', function(event) {
    switch (event.which) {
      case 1:
        canvas.removeEventListener('mousemove', leftClickAction);
        break;
      case 3:
        canvas.removeEventListener('mousemove', rightClickAction);
        break;
    }
  });


  function drawBoard(){
    for (var x = 0; x <= g.width; x += 1) {
      context.beginPath();
      context.moveTo(x * tileWidth, 0);
      context.lineTo(x * tileWidth, g.height * tileWidth);
      context.strokeStyle = "black";
      context.stroke();
    }

    for (var y = 0; y <= g.height; y += 1) {
      context.beginPath();
      context.moveTo(0, y * tileHeight);
      context.lineTo(g.width * tileWidth , y * tileHeight);
      context.strokeStyle = "black";
      context.stroke();
    }

  }

  function drawTiles() {
    for (let [x, y] of g.tiles) {
      context.beginPath();
      context.rect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      context.fillStyle = "black";
      context.fill();
    }
  }

  function drawPlayer() {
    context.beginPath();
    context.arc(player.x * tileWidth + tileWidth / 2, player.y * tileHeight + tileHeight / 2, tileWidth / 2, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  function drawObjective() {
    context.beginPath();
    context.arc(objective.x * tileWidth + tileWidth / 2, objective.y * tileHeight + tileHeight / 2, tileWidth / 2, 0, 2 * Math.PI, false);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }


  function drawArrows(cameFrom) {
    for(let i = 0; i < direction_map.dest.length; i++) {
      if (direction_map.source[i][0] < direction_map.dest[i][0]) {
        context.beginPath();
        context.moveTo(direction_map.dest[i][0] * tileWidth + tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2);
        context.lineTo(direction_map.dest[i][0] * tileWidth + 3 * tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2);
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(direction_map.dest[i][0] * tileWidth + tileWidth / 2 - tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2, tileWidth / 8, 0, 2 * Math.PI, false);
        context.fillStyle = 'orange';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
      } else if (direction_map.source[i][0] > direction_map.dest[i][0]) {
        context.beginPath();
        context.moveTo(direction_map.dest[i][0] * tileWidth + tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2);
        context.lineTo(direction_map.dest[i][0] * tileWidth + 3 * tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2);
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(direction_map.dest[i][0] * tileWidth + tileWidth / 2 + tileWidth / 4, direction_map.dest[i][1] * tileHeight + tileHeight / 2, tileWidth / 8, 0, 2 * Math.PI, false);
        context.fillStyle = 'orange';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
      } else if (direction_map.source[i][1] < direction_map.dest[i][1]) {
        context.beginPath();
        context.moveTo(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + tileHeight / 4);
        context.lineTo(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + 3 * tileHeight / 4);
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + tileHeight / 2 - tileHeight / 4, tileWidth / 8, 0, 2 * Math.PI, false);
        context.fillStyle = 'orange';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
      } else if (direction_map.source[i][1] > direction_map.dest[i][1]) {
        context.beginPath();
        context.moveTo(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + tileHeight / 4);
        context.lineTo(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + 3 * tileHeight / 4);
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(direction_map.dest[i][0] * tileWidth + tileWidth / 2, direction_map.dest[i][1] * tileHeight + tileHeight / 2 + tileHeight / 4, tileWidth / 8, 0, 2 * Math.PI, false);
        context.fillStyle = 'orange';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
      }

    }

  }


  function selectWallTile() {
    leftClickAction = fillOnMouseMove;
    tileType = "brown";
  }

  function selectWaterTile() {
    leftClickAction = fillOnMouseMove;
    tileType = "blue";
  }

  function selectObjective() {
    leftClickAction = placeObjective;
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
  }

  function reset() {
    g.tiles = [];
    direction_map = breadth_first_search(g, [objective.x, objective.y])
  }

  var clearCanvasButton = document.getElementById("resetButton");
  resetButton.addEventListener('click', reset);

  document.getElementById("wallTileButton").addEventListener('click', selectWallTile);
  document.getElementById("waterTileButton").addEventListener('click', selectWaterTile);
  document.getElementById("selectObjectiveButton").addEventListener('click', selectObjective);

  document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName === 'ArxUp') {
      player.y -= 1;
      if (player.y < 0) {
        player.y = 0;
      }
    } else if (keyName === 'ArxDown') {
      player.y += 1;
      if (player.y >= ((bw / tileWidth)-1)) {
        player.y = bw/tileWidth - 1;
      }
    } else if (keyName === 'ArxLeft') {
      player.x -= 1;
      if (player.x < 0) {
        player.x = 0;
      }
    } else if (keyName === 'ArxRight') {
      player.x += 1;
      if (player.x >= ((bh / tileHeight) - 1)) {
        player.x = bh/tileHeight - 1;
      }
    }
  }, false);

  context.translate(0.5, 0.5);

  function update() {
  }


  function is_in_2d_array(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === val[0] && arr[i][1] === val[1]) {
        return true;
      }
    }
    return false;

  }
  function breadth_first_search(graph, start_pos) {
    let frontier = new Queue();
    frontier.put(start_pos);
    let came_from = {source: [], dest: []};
    came_from.source.push(start_pos);
    came_from.dest.push(start_pos);

    while (! frontier.empty()) {
      let current = frontier.get();
      for (let next of graph.neighbors(current)) {
        if (! (is_in_2d_array(came_from.dest, next)) && !(is_in_2d_array(graph.tiles, next))) {
          frontier.put(next);
          came_from.source.push(current);
          came_from.dest.push(next);
        }
      }

    }
    return came_from;
  }

  function draw_grid(g) {
    for(i = 0; i < g.height; i++) {
      for(j = 0; j < g.width; j++) {
        if (! ([i,j] in g.tiles)) {
          console.log(".");
        } else {
          console.log("#");
        }
      }
    }
  }

  function render() {
    clearCanvas();
    drawBoard();
    drawTiles();
    drawObjective();
    drawArrows();
    drawPlayer();
  }

  function gameLoop() {
    update();
    render();
  }

  let widthSlider = document.getElementById("widthSlider");
  widthSlider.onchange = function() {
    g.width = this.value;
    canvas.width = g.width * tileWidth;
  }

  let heightSlider = document.getElementById("heightSlider");
  heightSlider.onchange = function() {
    g.height = this.value;
    canvas.height = g.height * tileHeight;
  }

  g = new Grid(10, 10);

  g.tiles = [[2,0],[2,2]];

  canvas.width = g.width * tileWidth;
  canvas.height = g.height * tileHeight;

  draw_grid(g);
  let direction_map = breadth_first_search(g, [5, 5]);

  render();
  setInterval(render, 1000 / 30);
  setInterval(update, 1000);
};