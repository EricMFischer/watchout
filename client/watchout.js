// start slingin' some d3 here.

var gameOptions = {
  width: 800,
  height: 800,
  radius: 10,
  numEnemies: 40,
  score: 0,
  high: 0,
  collisions: 0
};

var gameBoard = d3.select(".board")
                  .append("svg")
                  .attr("class", "gameBoard")
                  .attr("width", gameOptions.width)
                  .attr("height", gameOptions.height)
                  // .append("g");


//-------------enemies----------------

var createEnemies = function(n){
  return _.range(0, n).map(function(){
    return {
      //'id': i,
      // class: "enemy",
      //'x': function() { return Math.random() * gameOptions.width; },
      //'y': function() { return Math.random() * gameOptions.width; }
      'x': Math.random()* 800,
      'y': Math.random()* 800
    };
  });
};

var enemies = gameBoard.selectAll("circle")
                  .data(createEnemies(40))
                  .enter()
                  .append("circle")
                  .attr('class', 'enemy')
                  .attr('cx',function(e){return e.x;})
                  .attr('cy',function(e){return e.y;})
                  .attr('r',10)
                  .style("fill", "white")
                  .style("stroke", "grey")
                  .style("stroke-width", 0.01);

//createEnemies(gameOptions.numEnemies);



//-------------player----------------

var player = gameBoard.append("circle")
                      .attr('class', 'player')
                      .attr('cx', (gameOptions.width/2 - gameOptions.radius))
                      .attr('cy', (gameOptions.height/2 - gameOptions.radius))
                      .attr('r', 10)
                      .style("fill", "red");


var move = function() {
          gameBoard.selectAll('.enemy')
                   .data(createEnemies(40)) // need this because my var enemies is not returning array of domElements
                   .transition().duration(1500)
                   .attr('cx', function(d){return d.x})
                   .attr('cy', function(d){return d.y});
};
setInterval(move, 1000);


//-------------make player draggable----------------

var drag = d3.behavior.drag()
            .on("drag", function(){
              player.attr('cx', d3.event.x);
              player.attr('cy', d3.event.y);
            })
            .on("dragstart", function(){
              player.style('opacity', .5);
            })
            .on("dragend", function(){
              player.style('opacity', 1);
            });

player.call(drag);

//-------------collisions----------------

var hasCollision = function() {
  var collision = false;
  enemies.each(function() {
    // get playerX playerY position
    var playerX = player.attr('cx');
    var playerY = player.attr('cy');
    // get enemyX enemyY position
    var enemyX = d3.select(this).attr('cx');
    var enemyY = d3.select(this).attr('cy');
    // x diff
    // y diff
    var xDiff = enemyX - playerX;
    var yDiff = enemyY - playerY;
    var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    // distance (Pyth. theorem)
    if (distance <= (gameOptions.radius * 2)) {
      collision = true;
      gameOptions.collisions++;
    }
  });
  return collision;
}

//-------------scoreboard----------------

var updateScore = function() {
  if (hasCollision()) {
    gameOptions.score = 0;
    d3.select(".current > span").text(gameOptions.score);
  } else {
    gameOptions.score++;
    d3.select(".current > span").text(gameOptions.score);
  }
  if (gameOptions.high < gameOptions.score) {
    gameOptions.high = gameOptions.score;
    d3.select(".high > span").text(gameOptions.high);
  }
  d3.select(".collisions > span").text(gameOptions.collisions);
  console.log(gameOptions.collisions);
}

setInterval(updateScore, 50);

// d3.select('body').selectAll('div').data([8, 3, 7])
//     .enter().append('div').style('opacity', 0)
//     .text('creating divs!')
//     .transition().duration(3000)
//     .style('opacity', 1)

// d3.select('body').selectAll('div').data([])
//     .exit().transition().duration(3000)
//     .text(function(d){return 'deleting divs '+d})
//     .style('opacity', 0)
//     .remove()

// d3.select('body').selectAll('div').data([8, 3, 7, 5])
//     .text(function(d){return 'existing divs '+d})
//     .enter().append('div').style('opacity', 0)
//     .text('creating divs!')
//     .transition().duration(3000).style('opacity', 1)

// ----------- how to draw circle ----------------------
// <svg width="50" height="50">
// 2  <circle cx="25" cy="25" r="25" fill="purple" />
// 3</svg>


// /Make an SVG Container
//  2var svgContainer = d3.select("body").append("svg")
//  3                                    .attr("width", 200)
//  4                                    .attr("height", 200);
//  5
//  6//Draw the Ellipse
//  7var circle = svgContainer.append("circle")
//  8                         .attr("cx", 50)
//  9                         .attr("cy", 50)
// 10                         .attr("rx", 50)
// 11                         .attr("ry", 50);