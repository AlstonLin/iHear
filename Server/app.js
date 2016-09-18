var NUM_CLASSES = 7;
var THRESHOLD = 0.995;
var request = require("request");
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var PORT = 8080;

var previousSymbol = -1;

var API_PATH = "https://ussouthcentral.services.azureml.net/workspaces/4fca6d68dfcb441da2822b12932931a9/services/60afbbe5138b43aba5da36412e5dacc1/execute?api-version=2.0&details=true";
var API_TOKEN ="lhkDRaI02faeW5ubz3gASH8beeAc+BrRTCZwIiApRpyMObXr3lp9C+0Z+Ko34T9HsLnSwH6H7eiFuj6krgNFew==";

var jsonParser = bodyParser.json();

app.use(express.static('public'));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/entry", jsonParser, function(req, res){
  var data = {
    "Inputs": {
      "input1": {
        "ColumnNames": [
          "finger1x",
          "finger1y",
          "finger1z",
          "finger2x",
          "finger2y",
          "finger2z",
          "finger3x",
          "finger3y",
          "finger3z",
          "finger4x",
          "finger4y",
          "finger4z",
          "finger5x",
          "finger5y",
          "finger5z"
        ],
        "Values": [req.body]
      }
    },
    "GlobalParameters": {}
  };
  request.post({
    url: API_PATH,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(data).length,
      "Authorization": "Bearer " + API_TOKEN
    },
    body: data,
    json: true
  }, function (err, response, body){
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      var values = body.Results.output1.value.Values[0];
      var label = values[values.length - 1];
      var probabilities = [];
      for (var i = values.length - 2; i > values.length - NUM_CLASSES - 3; i--){
        probabilities.unshift(values[i]);
      }

      var probability = probabilities[label];
      if (probability > THRESHOLD && label != previousSymbol){
        previousSymbol = label;
        console.log("Saying label " + label);
      }
    }
  });
  res.end();
});

app.listen(PORT, function(){
  console.log("Listening on port " + PORT);
});
