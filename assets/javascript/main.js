//  todo Put in system to remove users from list
// todo Set up process to click on certain button, have image display and upload to firebase
// todo based off of input, set up logic to win lose
// todo display stats
// todo pull user info immediately and hide input bar if both present

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDE7r3YnvYF7KmiVh08CdNjtCZZEzcX2_M",
    authDomain: "multi-rps-20594.firebaseapp.com",
    databaseURL: "https://multi-rps-20594.firebaseio.com",
    projectId: "multi-rps-20594",
    storageBucket: "",
    messagingSenderId: "573605829935"
};
firebase.initializeApp(config);

var db = firebase.database();
var dbref = db.ref();

var p1 = false;
var p2 = false;
var player1;
var player2;
var connectedId;
var user;
var header = $("#header");
var alert = $("#alert").addClass("card-title");
var content = $("#content").addClass("card-body");
var p1name;
var p2name;
var name;
var p1Shoot;
var p2Shoot;
var winner;

var tie = 0;
var p1win = 0;
var p1loss = 0;
var p2win = 0;
var p2loss = 0;
var total = 0;


var img = "./assets/images/";
var rps = ["rock", "paper", "scissors"];

// *DB connections
var userRef = db.ref("/users");
var myConnectionsRef = db.ref("/connected");
var lastOnlineRef = db.ref("/lastOnline");
var connectedRef = db.ref(".info/connected");

$("#name").focus();

// * Retrieve data initially
userRef.on("value", function (snapshot) {

    p1 = snapshot.val().player1.p1;
    p2 = snapshot.val().player2.p2;
    p1Shoot = snapshot.val().player1.shoot;
    p2Shoot = snapshot.val().player2.shoot;
    p1name = snapshot.val().player1.p1name;
	console.log("TCL: p1name", p1name);
    p2name = snapshot.val().player2.p2name;
	console.log("TCL: p2name", p2name);

});

// *Game logic
function gameTime() {
    if (p1Shoot !== false && p2Shoot !== false) {
        if (p1Shoot === p2Shoot) {
            tie++;
            winner = "Draw this round!";
        } else if (p1Shoot === "paper" && p2Shoot === "rock" || p1Shoot === "rock" && p2Shoot === "scissors" || p1Shoot === "scissors" && p2Shoot === "paper") {
            p1win++;
            p2loss++;
            total++;
            winner = p1name + " won this round!";
        } else if (p2Shoot === "paper" && p1Shoot === "rock" || p2Shoot === "rock" && p1Shoot === "scissors" || p2Shoot === "scissors" && p1Shoot === "paper") {
            p2win++;
            p1loss++;
            total++;
            winner = p2name + " won this round!";
        }
        updateScore();
    }
}

function updateScore() {
    db.ref("/users/stats").update({
        tie: tie,
        p1win: p1win,
        p1loss: p1loss,
        total: total,
        p2win: p2win,
        p2loss: p2loss,
        winner: winner,
    });
    clearShoot();
}

db.ref("/users/stats").on("value", function (snapshot) {
    tie = snapshot.val().tie;
    p1win = snapshot.val().p1win;
    p1loss = snapshot.val().p1loss;
    total = snapshot.val().total;
    p2win = snapshot.val().p2win;
    p2loss = snapshot.val().p2loss;
    winner = snapshot.val().winner;
    displayScore();
});

function clearShoot() {
    $("p1-choice").empty();
    $("p2-choice").empty();
    p1Shoot = false;
    p2Shoot = false;
    p1Shoot = db.ref("/users/player1").update({
        shoot: false
    });
    p2Shoot = db.ref("/users/player2").update({
        shoot: false
    });
}


// * Disconnect settings

connectedRef.on('value', function (snapshot) {
    if (snapshot.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        var con = myConnectionsRef.push();

        connectedId = con.path.pieces_[1];

        con.onDisconnect().remove();

        con.set(true);

        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    }
});


// *Update stats section with score

function displayScore() {

    var newDiv = $("<div>");
    var textTies = $("<div>").text("Ties: " + tie);
    newDiv.append(textTies);
    $("#stats").empty().append(newDiv);

    // *P1 win/losses
    var p1Div = $("<div>");
    var p1user = $("<div>").text(p1name);
    var p1Yes = $("<div>").text("Wins: " + p1win);
    var p1No = $("<div>").text("Losses: " + p1loss);
    p1Div.append(p1user).append(p1Yes).append(p1No);
    $("#p1stats").empty().append(p1Div);

    // *P2 win/losses
    var p2Div = $("<div>");
    var p2user = $("<div>").text(p2name);
    var p2Yes = $("<div>").text("Wins: " + p2win);
    var p2No = $("<div>").text("Losses: " + p2loss);
    p2Div.append(p2user).append(p2Yes).append(p2No);
    $("#p2stats").empty().append(p2Div);

    // *Winner display
    content.text(winner);
}





// * Push users to /users when name input
$("#input").on("click", function (event) {

    event.preventDefault();

    name = $("#name").val().trim();

    if (p1 === true && p2 === false) {
        user = "player2";
        p2 = true;
        p2name = name;

        var player2 = {
            p2: p2,
            p2name: name,
            connectedID: connectedId,
            player: user,
            shoot: false,
        };

        db.ref("/users/stats").set({
            tie: 0,
            p1win: 0,
            p1loss: 0,
            total: 0,
            p2win: 0,
            p2loss: 0,
            winner: "",
        });

        displayScore();

        // * Display RPS once input has been setup
        displayRPS($("#p2"), "p2");

        // * Set new location for this user
        db.ref("/users/" + user).set(player2);
        db.ref("/users/" + user).onDisconnect().remove();
        db.ref("/users/" + user).onDisconnect(function () {
            db.ref("/users/stats").remove();
        });
        alert.text("Rock, Paper, Scissors...SHOOT!").append(content);
        header.hide();

    } else if ((p1 === false && p2 === true) || (p1 === false && p2 === false)) {
        user = "player1";
        p1 = true;
        p1name = name;

        var player1 = {
            p1: p1,
            p1name: name,
            connectedID: connectedId,
            player: user,
            shoot: false,
        };

        displayScore();

        // * Display RPS once input has been setup
        displayRPS($("#p1"), "p1");

        db.ref("/users/stats").set({
            tie: 0,
            p1win: 0,
            p1loss: 0,
            total: 0,
            p2win: 0,
            p2loss: 0,
            winner: "",
        });

        // * Set new location for this user
        db.ref("/users/" + user).set(player1);
        db.ref("/users/" + user).onDisconnect().remove();
        db.ref("/users/" + user).onDisconnect(function () {
            db.ref("/users/stats").remove();
        });
        header.hide();
        alert.text("Rock, Paper, Scissors...SHOOT!").append(content);

    } else {
        alert.text("Seats taken, you may spectate").append(content);
    }




});


// *Display RPS buttons
function displayRPS(location, user) {

    var newDiv = $("<div>");
    for (var i = 0; i < rps.length; i++) {
        var value = rps[i];
        var newButton = $("<button>").text(value).val(value).addClass("rps btn btn-warning").addClass(user);
        newDiv.append(newButton);
        location.append(newDiv);

    }
}

// * On specific click send it to firebase and check for value, match based off of that

$("#p1").on("click", ".rps", function () {
    var shoot = $(this).val();

    db.ref("users/" + user).update({
        "shoot": shoot
    });
    $("#p1-choice").empty().append("<img src='" + img + shoot + ".png'>");
    gameTime();
});


$("#p2").on("click", ".rps", function () {
    var shoot = $(this).val();

    db.ref("users/" + user).update({
        "shoot": shoot
    });
    $("#p2-choice").empty().append("<img src='" + img + shoot + ".png' >");
    gameTime();
});

$("#reset").on("click", function () {
    userRef.remove();
    header.show();
    $("#p1").empty();
    $("#p1-choice").empty();
    $("#p2").empty();
    $("#p2-choice").empty();
    alert.text("Choose a name").append(content);
    content.text("");
    p1 = false;
    p2 = false;
    tie = 0;
    p1win = 0;
    p1loss = 0;
    p2win = 0;
    p2loss = 0;
    displayScore();
});