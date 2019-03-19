 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyC-kN9ZIlXZDPqNMO0hRwRRuq9LHGzykmk",
     authDomain: "multiplayer-rps-6b6a2.firebaseapp.com",
     databaseURL: "https://multiplayer-rps-6b6a2.firebaseio.com",
     projectId: "multiplayer-rps-6b6a2",
     storageBucket: "multiplayer-rps-6b6a2.appspot.com",
     messagingSenderId: "801067756626"
 };
 firebase.initializeApp(config);

 var database = firebase.database();
 var dataref = database.ref();

 var rps = ["rock", "paper", "scissors"];

 var p1Ready = false;
 var p1Guess = "";
 var p2Ready = false;
 var p2Guess = "";

 var players = {
     p1Ready: p1Ready,
     p1Guess: p1Guess,
     p2Ready: p2Ready,
     p2Guess: p2Guess
 };

 dataref.set(players);

 database.ref().on("value", function (snapshot) {
         p1Ready = snapshot.val().p1Ready;
         p2Ready = snapshot.val().p2Ready;
         p1Guess = snapshot.val().p1Guess;
         p2Guess = snapshot.val().p2Guess;

         if (snapshot.child("p1").ready && snapshot.child("p2").exists()) {

         }

         // If Firebase has the players set up, hide the ability to join
         if (snapshot.child("p1").ready === true && snapshot.child("p2").ready === true) {
             console.log("TCL: snapshot.child('p2').ready", snapshot.child("p2").ready);
             console.log("TCL: snapshot.child('p1').ready", snapshot.child("p1").ready);

             $("#play").hide();
         }

     },

     function (errorObject) {
         console.log("The read failed: " + errorObject.code);
     });

 // * Users online
 var connectionsRef = database.ref("/connections");
 var connectedRef = database.ref(".info/connected");
 connectedRef.on("value", function (snap) {

     // If they are connected..
     if (snap.val()) {

         // Add user to the connections list.
         var con = connectionsRef.push(true);
         // Remove user from the connection list when they disconnect.
         con.onDisconnect().remove();
     }
 });
 connectionsRef.on("value", function (snap) {

     // Display the viewer count in the html.
     // The number of online users is the number of children in the connections list.
     $("#connected-viewers").text(snap.numChildren());
 });

 $("#play").on("click", function () {

     if (p1Ready === false) {
         $("#alert").text("You are Player 1");
         dataref.set({
             p1Ready: true
         });
         displayRPS($("#p1"));

     } else if (p2ready === false) {
         $("#alert").text("You are Player 2").delay(3000).fadeOut();
         dataref.set({
             p2Ready: true
         });
         displayRPS($("#p2"));

     } else {
         $("#play").hide();
         $("#alert").text("You are spectating");

     }

 });

 function displayRPS(location) {

     for (var i = 0; i < rps.length; i++) {
         var value = rps[i];
         var newButton = $("<button>").text(value).val(value).addClass("rps");
         location.append(newButton);

     }
 }



 // *When rps button is clicked, retrieve value and wait for opponent
 $(document).on("click", ".rps", function () {
     var choice = $(this).val();
     console.log("TCL: choice", choice);
     $("#rps").text("Wait for opponent");

 });



 // *Pull from firebase If 2 players push play then remove button



 // * Once players are present