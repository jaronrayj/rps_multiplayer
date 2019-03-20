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
var p1Score = 0;
var p2Score = 0;
var player1;
var player2;
var left;

var img = "./assets/images/";

$("#name").focus();

// * Pull prior stats
db.ref("/stats").on("value", function (snapshot) {

    p1Score = snapshot.val().p1Score;
    p2Score = snapshot.val().p2Score;

});

db.ref("/users").on("value", function (snapshot) {

    snapshot.val().score = p1Score;
    snapshot.val().score = p2Score;
    snapshot.val().name = player1;
    snapshot.val().name = player2;

});


// * Update name for player2
db.ref("/users").orderByChild("dateAdded").limitToFirst(2).on("child_added", function (snapshot) {

    if (p1 !== p2) {
        player2 = snapshot.val().name;
        $("#p2").show().text(player2);
        p2 = snapshot.key;

        $("#header").hide();
        $("#name").val("");

    }
});

// * Update name for player1
db.ref("/users").orderByChild("dateAdded").limitToFirst(1).on("child_added", function (snapshot) {

    player1 = snapshot.val().name;
    $("#p1").text(player1);
    p1 = snapshot.key;
    // $("#header").hide();
    $("#p2").text("Awaiting opponent");
    $("#name").val("");
});



var rps = ["rock", "paper", "scissors"];


// * Disconnect settings
var myConnectionsRef = db.ref("/connected");
var lastOnlineRef = db.ref("/lastOnline");
var connectedRef = db.ref(".info/connected");

connectedRef.on('value', function (snapshot) {
    if (snapshot.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        var con = myConnectionsRef.push();

        // When I disconnect, remove this device
        left = con.onDisconnect();

        // console.log('TCL: left', left);
        // db.ref("/users/" + left).remove();
        con.onDisconnect().remove();

        // todo get id from disconnect and remove from user also?

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        con.set(true);

        // When I disconnect, update the last time I was seen online
        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    }
});



// *Update stats section with score
// db.ref("/stats").on("value", function (snapshot) {

// });



// * Push users to /users when name input
$("#input").on("click", function (event) {

    event.preventDefault();

    var name = $("#name").val().trim();

    db.ref("/users").push({
        "name": name

    });

    // * Display RPS once input has been setup
    if (p2 === false) {
        displayRPS($("#p1"), "p1");
    } else {
        displayRPS($("#p2"), "p2");
    }


    // if ()

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

    db.ref("users/" + p1).update({
        "shoot": shoot
    });
    $("#p1-choice").empty().append("<img src='" + img + shoot + ".png'>");
});


$("#p2").on("click", ".rps", function () {
    var shoot = $(this).val();

    db.ref("users/" + p2).update({
        "shoot": shoot
    });
    $("#p2-choice").empty().append("<img src='" + img + shoot + ".png' >");
});