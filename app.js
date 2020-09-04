var board_size = 11; // Game board size in blocks
var x_direction = 0; // Horizontal movement
var y_direction = 0; // Vertical movement
var grid = []; // Contains game board blocks
var snake_parts = []; // Contains snake parts
var alive = true; // Is the player alive or not

document.addEventListener("DOMContentLoaded", function () {
  // Start the game on intial load
  create_fields(); // Creates grid array
  create_apple(); // Generates an apple at a random position

  document.addEventListener("keydown", key_pressed);
  set_score(0); // Set the intial score to 0
  draw(); // Start the game
});

function create_fields() {
  // Creates grid array
  var game_board = document.getElementsByClassName("main-game-board")[0];

  for (var i = 0; i < board_size; i++) {
    var row = document.createElement("div");
    var grid_row = [];

    row.classList.add(`game-board-row`);
    game_board.appendChild(row);

    for (var j = 0; j < board_size; j++) {
      var column = document.createElement("div");
      column.classList.add("game-board-column");
      column.classList.add("disable-selection");

      if (i == 5 && j == 5) {
        // Places the snake in the center when game starts
        column.classList.add("game-snake-part");
        snake_parts.push(column);
      }
      column.innerText = `${j}`;

      row.appendChild(column);
      grid_row.push(column);
    }

    grid.push(grid_row);
  }
}

function create_apple() {
  var x_apple = Math.floor(Math.random() * board_size); // Random x (0 to board_size)
  var y_apple = Math.floor(Math.random() * board_size); // Random y (0 to board_size)

  if (grid[y_apple][x_apple].classList.contains("game-snake-part")) {
    // If the x and y belong to the snake, generate new ones
    create_apple();
  } else {
    // Creates the apple at the x and y
    grid[y_apple][x_apple].classList.add("game-apple");
  }
}

function check_apple() {
  // Checks if the player ate the apple
  var apple = document.getElementsByClassName("game-apple")[0];
  if (apple.classList.contains("game-snake-part")) {
    apple.classList.remove("game-apple");
    update_score(); // Increase score by 1
    create_apple(); // Create new apple
    increase_snake(); // Increase snake length by 1
  }
}

function key_pressed(event) {
  // Handles keyboard input
  var target_key = event.key.toUpperCase();

  if (target_key == "A" && x_direction == 0) {
    // Move horizontally to the left
    x_direction = -1;
    y_direction = 0;
  } else if (target_key == "D" && x_direction == 0) {
    // Move horizontally to the right
    x_direction = 1;
    y_direction = 0;
  } else if (target_key == "S" && y_direction == 0) {
    // Move vertically down
    y_direction = 1;
    x_direction = 0;
  } else if (target_key == "W" && y_direction == 0) {
    // Move vertically up
    y_direction = -1;
    x_direction = 0;
  }
}

function move_snake() {
  // Handles snake movement
  var snake_head = snake_parts[0];
  for (var y = 0; y < board_size; y++) {
    for (var x = 0; x < board_size; x++) {
      var field = grid[y][x];
      if (field == snake_head) {
        if (
          // Checks if the next snake position is valid
          x + x_direction >= 0 &&
          x + x_direction < board_size &&
          y + y_direction >= 0 &&
          y + y_direction < board_size
        ) {
          snake_parts[snake_parts.length - 1].classList.remove(
            "game-snake-part"
          );
          snake_parts.pop();

          var new_snake_part = grid[y + y_direction][x + x_direction];
          if (new_snake_part.classList.contains("game-snake-part")) {
            // Checks if the snake ate itself
            game_over();
          }
          new_snake_part.classList.add("game-snake-part");
          snake_parts.splice(0, 0, new_snake_part);

          return;
        } else {
          // If the position is not valid end the game
          game_over();
        }
      }
    }
  }
}

function increase_snake() {
  // Handles snake growth
  snake_parts.push(grid[0][0]);
}

function game_over() {
  // Handles game over
  alive = false; // Disables snake movement
  document.removeEventListener("keydown", key_pressed); // Disables keyboard input
  x_direction = 0; // Stops horizontal movement
  y_direction = 0; // Stops vertical movement

  var game_score = document.getElementsByClassName("main-game-score")[0];
  var final_score = snake_parts.length;
  game_score.innerHTML = `
  <p>Game over!</p>
  <p>Your final score was: ${final_score}</p>`; // Sets game over message

  var restart_button = document.createElement("button");
  restart_button.innerText = "New game";
  restart_button.classList.add("restart-button");
  restart_button.setAttribute("onclick", "window.location.reload()"); // Starts new game when clicked
  game_score.appendChild(restart_button);
}

function update_score() {
  // Handles score updates
  var game_score = document.getElementsByClassName("main-game-score")[0];
  game_score.innerText = `Score: ${snake_parts.length}`;
}

function set_score(score) {
  // Sets score on initial game start
  var game_score = document.getElementsByClassName("main-game-score")[0];
  game_score.innerText = `Score: ${score}`;
}

function draw() {
  // Main game loop
  move_snake(); // Move snake every frame
  check_apple(); // Check if the snake ate the apple

  if (alive) {
    setTimeout(function () {
      window.requestAnimationFrame(draw);
    }, 1000 / 10); // Start new frame every second if the snake is still alive
  }
}
