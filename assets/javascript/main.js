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

$("#name").focus();

// * Pull prior stats
// db.ref("/stats").on("value", function (snap) {

//     p1Score = snap.val().p1.p1Score;
//     p2Score = snap.val().p2.p2Score;

// });

db.ref("/users").on("value", function (snap) {
    console.log('TCL: snap', snap.val());

    snap.val().score = p1Score;
    snap.val().score = p2Score;
    snap.val().name = player1;
    snap.val().name = player2;

});


// * Update name for player
db.ref("/users").orderByChild("dateAdded").limitToFirst(2).on("child_added", function (snapshot) {

    if (p1 !== p2) {
        player2 = snapshot.val().name;
        $("#p2").show().text(player2);
        p2 = snapshot.key;
    }
});

// * Update name for player
db.ref("/users").orderByChild("dateAdded").limitToFirst(1).on("child_added", function (snapshot) {

    player1 = snapshot.val().name;
    $("#p1").text(player1);
    p1 = snapshot.key;
    $("#p2").text("Awaiting opponent");
});



var rps = ["Rock", "Paper", "Scissors"];

var usersRef = dbref.set("/users");

// *Update stats section with score
// db.ref("/stats").update({

// });

// * Push users to /users when name input
$("#input").on("click", function (event) {

    event.preventDefault();

    var name = $("#name").val().trim();

    db.ref("/users").push({
        "name": name

    });

    // if ()

});