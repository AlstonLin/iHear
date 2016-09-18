Leap.loop({optimizeHMD: true}, function(frame){
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

var scene = Leap.loopController.plugins.riggedHand.scene;
var camera = Leap.loopController.plugins.riggedHand.camera;
var renderer = Leap.loopController.plugins.riggedHand.renderer;
var canvas = new THREE.Mesh(
  new THREE.PlaneGeometry(80,80),
  new THREE.MeshPhongMaterial({wireframe: false})
);

camera.lookAt(canvas.position);
