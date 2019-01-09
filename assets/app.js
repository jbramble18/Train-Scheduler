var config = {
  apiKey: "AIzaSyALd-jMUp23fBqY5CttvGpu6VlmQJI2uT4",
  authDomain: "train-scheduler-544b4.firebaseapp.com",
  databaseURL: "https://train-scheduler-544b4.firebaseio.com",
  projectId: "train-scheduler-544b4",
  storageBucket: "train-scheduler-544b4.appspot.com",
  messagingSenderId: "930304648319"
};

firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var destination = "";
var frequency = "";
var firstArrival = "";


$("#addTrain").on("click", function () {
  event.preventDefault();
  trainName = $("#train-name").val().trim();
  destination = $("#train-dest").val().trim();
  frequency = $("#train-freq").val().trim();
  firstArrival = $("#train-time").val().trim();

  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstArrival: firstArrival,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(newTrain);

  // console.log(newTrain.trainName);
  // console.log(newTrain.destination);
  // console.log(newTrain.firstArrival);
  // console.log(newTrain.frequency);

  $("#train-name").val("");
  $("#train-dest").val("");
  $("#train-time").val("");
  $("#train-freq").val("");



})
firebase.database().ref().on('child_added', function (childSnapshot) {
  console.log(childSnapshot.val());

  var tName = childSnapshot.val().trainName;
  var tDest = childSnapshot.val().destination;
  var tArrival = childSnapshot.val().firstArrival;
  var tFreq = childSnapshot.val().frequency;

  // console.log(tName,tDest,tArrival,tFreq);

  var tFrequency = tFreq;
  // frequency
  var firstTime = tArrival;
// firstArrival
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  var currentTime = moment();
  // console.log("current time: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  // console.log("Difference in Time:" + diffTime);

  var tRemainder = diffTime % tFrequency;
  // console.log("Remaining Minutes" + tRemainder);

  var tMinutesTillTrain = tFrequency - tRemainder;
  // console.log("Minutes Till Train: " + tMinutesTillTrain);

  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
  // console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" +
    tDest + "</td><td>" + tFreq + "</td><td>" + nextTrain + "</td><td>" +
    tMinutesTillTrain + "</td>");
    

  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


