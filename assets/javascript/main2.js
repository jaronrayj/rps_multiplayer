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

 var db = firebase.database();
 var dbref = db.ref();

 var rps = ["Rock", "Paper", "Scissors"];

 var p1Name;
 var p2Name;
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

 dbref.set(players);

 dbref.on("value", function (snapshot) {
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
 var usersRef = database.ref("/users");
 var connectedRef = database.ref(".info/users");
 connectedRef.on("value", function (snap) {

     // If they are connected..
     if (snap.val()) {
         // Add user to the connections list.
         var con = usersRef.push(true);
         // Remove user from the connection list when they disconnect.
     }
     con.onDisconnect().remove();

 });
 usersRef.on("value", function (snap) {

    //  Display the viewer count in the html.
     // The number of online users is the number of children in the connections list.
     $("#connected-viewers").text(snap.numChildren());
 });

 $("#input").on("click", function (event) {

     event.preventDefault();

     if (p1Ready === false) {
         p1Name = $("#name").val().trim();
         console.log('TCL: p1Name', p1Name);
         $("#alert1").text(p1Name + ", you are Player 1");
         players.p1Ready = name;
         dataref.set(players);
         displayRPS($("#p1"), "p1");
         $("#name").val("");
         //* Once it's ready  $("#header").hide();

     } else if (p2Ready === false) {
         p2Name = $("#name").val().trim();
         console.log('TCL: p2Name', p2Name);
         $("#alert2").text(p2Name + ", you are Player 2");
         players.p2Ready = name;
         dataref.set(players);
         displayRPS($("#p2"), "p2");
         $("#name").val("");
         $("#header").hide();
     }

 });

 function displayRPS(location, user) {

     for (var i = 0; i < rps.length; i++) {
         var value = rps[i];
         var newButton = $("<button>").text(value).val(value).addClass("rps").addClass(user);
         location.append(newButton);

     }
 }



 // *When rps button is clicked, retrieve value and wait for opponent
 $(document).on("click", ".rps", function () {
     var choice = $(this).val();
     console.log("TCL: choice", choice);
     $("#rps").text("Wait for opponent");

 });

 $(document).on("click", ".p1", function () {

     var choice = $(this).val();
 });

 $(document).on("click", ".p2", function () {

     var choice = $(this).val();
     console.log('TCL: choice', choice);
 });


 // *Pull from firebase If 2 players push play then remove button



 // * Once players are present