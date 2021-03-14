import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#mainCanvas');
const canvasDiv = document.querySelector('#canvasDiv');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    canvasDiv.clientWidth / canvasDiv.clientHeight,
    0.1, //near clipping pane
    1000 //far clipping pane
);
camera.position.set(5, 5, 5);
console.log();
// Update Viewport on resize
window.addEventListener("resize", function () {
    var width = canvasDiv.clientWidth;
    var height = canvasDiv.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.2;

var ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);
//object loader

function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * .4;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}


var gltfLoader = new GLTFLoader();
var root = null;
function gltfFunction(gltf) {
    // const root = gltf.scene;
    if (root) {
        scene.remove(root);
    }
    root = gltf.scene;
    console.log(gltf);
    // root.scale.set(.5,.5,.5);
    scene.add(root);

    // compute the box that contains all the stuff
    // from root and below
    const box = new THREE.Box3().setFromObject(root);

    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    // set the camera to frame the box
    frameArea(boxSize, boxSize, boxCenter, camera);
    
    document.getElementById('loading').style.visibility="collapse";
}



//game logic
var update = () => {

}
//draw scene
var render = () => {
    renderer.render(scene, camera);
}
//run game loop (update, render, repeat)
var GameLoop = () => {
    requestAnimationFrame(GameLoop);//repeat

    update();
    render();
}
GameLoop();



window.setPlanet = (planetDetails) => {
    document.getElementById('loading').style.visibility="visible";
    planetDetails = JSON.parse(planetDetails);
    // scene.remove(gltfLoader);
    gltfLoader.load(`models/${planetDetails.model}`, gltfFunction);
    document.getElementById('title').innerText = planetDetails.name ?? "";
    document.getElementById('desc').innerText = planetDetails.desc ?? "";
    document.getElementById('distance').innerText = planetDetails.distance ?? "";
    document.getElementById('radius').innerText = planetDetails.radius ?? "";
    setExplView(planetDetails.expl);
}

window.setExplView = (expl) => {
    var explContainer = document.getElementById("expl");
    explContainer.innerHTML = ``;
    console.log(expl);
    expl.forEach((item) => {
        // <figure>
        //    <img width="50" height="50"/>
        //    <figcaption>OXYGEN</figcaption>
        // </figure>
        explContainer.innerHTML += `
                <figure>
                   <img width="50" height="50" src="/imgs/expl/${item.img}"/>
                   <figcaption>${item.name}</figcaption>
                </figure>
                `;
    });
}
window.setPlanet(document.getElementById("firstRecord").value);