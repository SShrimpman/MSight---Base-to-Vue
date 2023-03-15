import * as StoreScene from "../stores/scene";
import * as THREE from "three";
import { cameraConfigs } from "../configs/camera";
import { getLineVector } from "./generic/vectors";
import { Vector3 } from "three";
import { pickAxlePlane } from "./raytracing";
import { getModelsCenterPoint } from "./meshes";

function getCameraData() {
  const camera = StoreScene.camera;

  // get rotation

  const pointLookedAt = pickAxlePlane();

  // get position
  camera.updateMatrixWorld();
  const vPosition = camera.position.clone();
  // vPosition.applyMatrix3(camera.matrixWorld);

  return {
    position: vPosition,
    pointLookedAt: pointLookedAt,
  };
}

// function setCameraData(id) {
function setCameraData(savedView) {
  const controls = StoreScene.controls;

  controls.enabled = false;

  // configs
  const frames = cameraConfigs.framesPerAnimation;

  // rotation
  const pointLookingAt = pickAxlePlane();
  const finalPointLookedAt = savedView.camera.pointLookedAt;
  const movementVectorRotation = getLineVector(pointLookingAt, finalPointLookedAt);
  const vecByFrameRotation = getFrameVector(movementVectorRotation, frames);

  const currentPointBeingLookedAt = new Vector3();
  currentPointBeingLookedAt.copy(pointLookingAt);

  // position
  const startingPosition = StoreScene.camera.position;
  const finalPosition = savedView.camera.position;
  const movementVectorPosition = getLineVector(startingPosition, finalPosition);
  const vecByFramePosition = getFrameVector(movementVectorPosition, frames);
  const currentPosition = new Vector3();
  currentPosition.copy(startingPosition);

  // animation
  let counter = 0;

  animationLoop();

  //
  // Aux functions in scope
  //
  function animationLoop() {
    if (counter == frames) {
      controls.enabled = true;
      return;
    }
    setTimeout(() => {
      rotationTweening();
      positionTweening();
      counter++;
      animationLoop();
    }, 1);
  }

  function rotationTweening() {
    const newPointLooked = new THREE.Vector3();
    newPointLooked.copy(currentPointBeingLookedAt);
    newPointLooked.add(vecByFrameRotation);

    // Update camera point looked at
    setCameraLookingPoint(newPointLooked);
    // Update current point looked at, for next frame
    currentPointBeingLookedAt.copy(newPointLooked);
  }

  function positionTweening() {
    const newPosition = new THREE.Vector3();
    newPosition.copy(currentPosition);
    newPosition.add(vecByFramePosition);

    // Update camera point looked at
    setCameraPosition(newPosition);
    // Update current point looked at, for next frame
    currentPosition.copy(newPosition);
  }
}

function setCameraLookingPointHere(mouseX, mouseY) {
  const controls = StoreScene.controls;
  const camera = StoreScene.camera;

  // convert mouse position to normalized device coordinates
  const mouse = new THREE.Vector2(
    (mouseX / window.innerWidth) * 2 - 1,
    -(mouseY / window.innerHeight) * 2 + 1
  );

  // create a raycaster
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // intersect with objects in the scene
  const intersects = raycaster.intersectObjects(StoreScene.scene.children, true);

  if (intersects.length > 0) {
    // focus the camera on the first intersected object
    controls.target.copy(intersects[0].point);
    controls.update();
  }
}

function setCameraLookingPoint(point) {
  const controls = StoreScene.controls;
  controls.target = point;
  controls.update();
}

function setCameraLookingWorldCenter() {
  const center = getModelsCenterPoint();
  setCameraLookingPoint(center);
}

function setCameraPosition(point) {
  const camera = StoreScene.camera;
  camera.position.copy(point);
}

function getFrameVector(movementVector, frames) {
  const frameVector = new THREE.Vector3();
  frameVector.copy(movementVector);
  frameVector.divideScalar(frames);
  return frameVector;
}

export { getCameraData, setCameraData, setCameraLookingPoint, setCameraLookingWorldCenter, setCameraPosition, setCameraLookingPointHere };
