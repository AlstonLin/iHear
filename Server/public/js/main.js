// Variables
var WAITING_TIME = 5000;
var TRAINING_TIME = 10000;
var TIME_BETWEEN_PREDICT_REQUESTS = 1000;

var lastPredictRequest = -1;
var training = false;
var data = [];
var classId = -1;
// As the only thing that matters is the finger positions relative to each other,
// we can safely center each axis such that the mean of all the fingers is zero.
// This adds consistency. Also rounds the numbers
var centerData = function(data) {
  var xSum = 0, ySum = 0, zSum = 0;
  for (var i = 0; i < data.length; i++){
    xSum += data[i][0];
    ySum += data[i][1];
    zSum += data[i][2];
  }
  var xAvrg = xSum / data.length;
  var yAvrg = ySum / data.length;
  var zAvrg = zSum / data.length;
  for (var i = 0; i < data.length; i++){
    data[i][0] = Math.round(data[i][0] - xAvrg);
    data[i][1] = Math.round(data[i][1] - xAvrg);
    data[i][2] = Math.round(data[i][2] - xAvrg);
  }
  return data;
}

// Transforms the data to a 1d vector, with the classId at the start
var unRollData = function(data){
  var unrolled = [classId];
  for (var i = 0; i < data.length; i++){
    for (var j = 0; j < data[i].length; j++){
      unrolled.push(data[i][j]);
    }
  }
  return unrolled;
}
// Logs to csv format
var logInCSV = function(data){
  var str = "";
  for (var j = 0; j < data.length; j++){
    var entry = data[j];
    for (var i = 0; i < entry.length; i++){
      if (i != 0){
        str += ",";
      }
      str += entry[i];
    }
    str += "\n";
  }
  console.log(str);
}
// Leap motion setup
Leap.loop({optimizeHMD: true}, function(frame){
  // Stuff that checks the position of fingers
  if (frame.data.pointables.length != 5){
    // Need to detect 5 fingers
    return;
  }
  var stablizedPositions = _.map(frame.data.pointables, function(item){
    return item.stabilizedTipPosition;
  });
  var unrolled = unRollData(stablizedPositions);
  // stablizedPositions = centerData(stablizedPositions);
  if (training){
    data.push(unrolled); 
  } else {
    if (Date.now() - lastPredictRequest < TIME_BETWEEN_PREDICT_REQUESTS){
      return;
    }
    lastPredictRequest = Date.now();
    $.ajax({
      url: "/entry",
      type: "POST",
      data: JSON.stringify([
        unrolled[1],
        unrolled[2],
        unrolled[3],
        unrolled[4],
        unrolled[5],
        unrolled[6],
        unrolled[7],
        unrolled[8],
        unrolled[9],
        unrolled[10],
        unrolled[11],
        unrolled[12],
        unrolled[13],
        unrolled[14],
        unrolled[15],
      ]),
      contentType:"application/json; charset=utf-8",
      dataType: "json"
    });
  }
}).on("handFound", function(frame){
}).on("handLost", function(frame){
}).use('riggedHand', {
    helper: true,
    dotsMode: true,
    opacity: 1,
    offset: new THREE.Vector3(0, 0, 0),
    scale: 1,
    positionScale: 1,
    checkWebGL: true
});
// Relection set up
var scene = Leap.loopController.plugins.riggedHand.scene;
var camera = Leap.loopController.plugins.riggedHand.camera;
var renderer = Leap.loopController.plugins.riggedHand.renderer;
var canvas = new THREE.Mesh(
  new THREE.PlaneGeometry(80,80),
  new THREE.MeshPhongMaterial({wireframe: false})
);
camera.lookAt(canvas.position);
// Jquery
$("#train").click(function(){
  if (training) {
    return;
  }
  // Headers
  data = [["class", "finger1x", "finger1y", "finger1z", "finger2x", "finger2y", "finger2z",
    "finger3x", "finger3y", "finger3z","finger4x", "finger4y", "finger4z",
    "finger5x", "finger5y", "finger5z"]];
  classId = $("#classId").val();
  // Timer
  $("#countdown").text("Training will begin in a few seconds...");
  setTimeout(function(){
    training = true;
    $("#countdown").text("Training...");
  }, WAITING_TIME);
  setTimeout(function(){
    training = false;
    logInCSV(data); 
    data = [];
    $("#countdown").text("");
  }, TRAINING_TIME + WAITING_TIME);
});
