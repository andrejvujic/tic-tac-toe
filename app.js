var columns;
var players = { true: "X", false: "O" };
var players_names = { true: "X", false: "O" };
var current_player;

document.addEventListener("DOMContentLoaded", function () {
  get_columns(); // Creates column array
  update_current_player(); //  Updates the current player text
});

function get_columns() {
  var columns = document.getElementsByClassName("column");
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];

    column.addEventListener("click", clicked_field); // Adds click listener to block
    column.innerText = "?";
  }
}

function clicked_field(event) {
  target_field = event.target;
  if (
    !target_field.classList.contains("column") ||
    target_field.classList.contains("unavalible")
  ) {
    return; // If the user didn't click on an avalible block return
  }

  target_field.style.color = "black";
  target_field.innerText = players[current_player]; // Sets the block text to the player which clicked
  target_field.classList.add("unavalible"); // Marks the block as unavalible so it can't be clicked on

  update_current_player(); // Update the current player text
  check_win(); // Checks if someone won
  check_full_board(); // Checks if the board is fully filled
}

function update_current_player() {
  current_player = !current_player;
  var player_container = document.getElementsByClassName(
    "information-current-player"
  )[0];
  player_container.innerText = `Trenutni Igrač: ${players_names[current_player]}`;
}

function check_win() {
  var fields = get_fields(); // Gets bame board blocks
  var row_winner = check_rows(fields); // Checks all rows
  if (row_winner[0]) {
    set_winner(row_winner[0]); // index 0 contains player name
    animate_fields(row_winner[1]); // index 1 contains winning blocks
  }

  var column_winner = check_columns(fields); // Checks all columns
  if (column_winner[0]) {
    set_winner(column_winner[0]);
    animate_fields(column_winner[1]);
  }

  var diagonal_winner = check_diagonals(fields); // Checks first diagonal
  if (diagonal_winner[0]) {
    set_winner(diagonal_winner[0]);
    animate_fields(diagonal_winner[1]);
  }

  diagonal_winner = check_diagonals(fields.reverse()); // Checks second diagonal
  if (diagonal_winner[0]) {
    set_winner(diagonal_winner[0]);
    animate_fields(diagonal_winner[1]);
  }
}

function get_fields() {
  // Get all game board blocks
  var rows = [];

  for (var i = 0; i < 3; i++) {
    rows.push(document.getElementsByClassName(`board-row-${i + 1}`)[0]);
  }

  var fields = [];
  for (var i = 0; i < rows.length; i++) {
    fields.push(rows[i].getElementsByClassName("column"));
  }
  return fields;
}

function check_full_board() {
  // If the board is fully filled, end the game as a draw
  var unavalible_fields = document.getElementsByClassName("unavalible");
  if (unavalible_fields.length == 9) {
    set_winner("Nema pobjednika!");
  }
}

function check_rows(fields) {
  for (var i = 0; i < 3; i++) {
    var field = fields[i];
    if (field[0].innerText == "?") {
      continue;
    }
    if (
      field[0].innerText == field[1].innerText &&
      field[0].innerText == field[2].innerText
    ) {
      return [field[0].innerText, [field[0], field[1], field[2]]];
    }
  }

  return [false, []];
}

function check_columns(fields) {
  for (var i = 0; i < 3; i++) {
    var column1 = fields[0][i];
    var column2 = fields[1][i];
    var column3 = fields[2][i];

    if (column1.innerText == "?") {
      continue;
    }

    if (
      column1.innerText == column2.innerText &&
      column1.innerText == column3.innerText
    ) {
      return [column1.innerText, [column1, column2, column3]];
    }
  }

  return [false, []];
}

function check_diagonals(fields) {
  var diagonal;
  var digaonal_fields = [];

  diagonal = "";
  for (var i = 0; i < 3; i++) {
    diagonal += fields[i][i].innerText;
    digaonal_fields.push(fields[i][i]);
  }
  if (diagonal == "XXX" || diagonal == "OOO") {
    return [diagonal.substring(0, 1), digaonal_fields];
  }

  return [false, []];
}

function set_winner(game_winner) {
  // Sets winner text
  var game_information = document.getElementsByClassName(
    "main-game-information"
  )[0];

  var player_container = document.getElementsByClassName(
    "information-current-player"
  )[0];
  game_information.removeChild(player_container);

  var win_container = document.createElement("div");
  win_container.classList.add("information-winner");
  game_information.appendChild(win_container);

  var winner = document.createElement("p");
  if (game_winner != "Nema pobjednika!") {
    winner.innerText = `${game_winner} je pobjednik!`;
  } else {
    winner.innerText = `${game_winner}`;
  }

  win_container.appendChild(winner);

  var restart_container = document.createElement("div");
  restart_container.classList.add("information-restart");
  game_information.appendChild(restart_container);

  var restart_button = document.createElement("button");
  restart_button.innerText = "Nova Igra";
  restart_button.addEventListener("click", restart);
  restart_container.appendChild(restart_button);

  disable_clicking(); // Disables clicking on the game board
}

function disable_clicking() {
  var fields = get_fields();

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      fields[i][j].style.opacity = "0.7";

      if (!fields[i][j].classList.contains("unavalible")) {
        fields[i][j].removeEventListener("click", clicked_field);
      }
    }
  }
}

function restart() {
  // Starts new game
  window.location.reload();
}

function animate_fields(winning_fields) {
  // Set winning block's color to green
  for (var i = 0; i < winning_fields.length; i++) {
    var field = winning_fields[i];

    field.style.background = "green";
    field.style.opacity = "0.7";
  }
}
