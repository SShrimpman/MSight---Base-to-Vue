import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import * as ClippingPlanesStore from "../stores/clippingPlanes.js";
import * as Models from "../stores/models.js";
import * as RaycastStore from "../stores/raycast.js";
import * as Scene from "../stores/scene.js";
import * as SelectedStore from "../stores/selection.js";
import * as THREE from "three";
import { userInteractions } from "../stores/userInteractions.js";

/**
 * Gets users' mouse position, casts a ray to intercept objects on the render and returns their properties
 * @param {Event} event event triggered
 * @param {Boolean} isSelection is user selection or hover highlighting
 */
async function pickObject(event, isPicking, isSelection = false) {
  setupCast(event);

  // Casts a ray for each model uploaded, returns object
  const found = await castEachModel();

  if (!found) {
    RaycastStore.resetFound();

    if (!isPicking) return false;

    if (isSelection) {
      SelectedStore.resetSelectedProperties();
    } else {
      SelectedStore.resetHighlightedProperties();
    }
    return;
  }

  if (!isPicking) {
    return found;
  }

  RaycastStore.setFound(found);
  const response = await storeFoundObjectProperties(isSelection);
  return response;
}

/**
 * Gets users' mouse position, casts a ray to intercept planes on the render
 * @param {Event} event event triggered
 * @return true if plane is found, false otherwise
 */
async function pickClippingPlane(event) {
  setupCast(event, "plane");

  const planeFound = castPlanes();

  if (!planeFound) {
    ClippingPlanesStore.resetFoundPlane();
    return false;
  }

  ClippingPlanesStore.setFoundPlane(planeFound);
  return true;

  // aux functions
  /**
   * Uses raycasting to intersect visual planes with user input
   * @returns Intersection object, if found. Otherwise, false
   */
  function castPlanes() {
    const visualPlanes = ClippingPlanesStore.visualPlanes;
    const results = RaycastStore.raycaster.intersectObjects(visualPlanes);
    const boxDimensions = {
      min: ClippingPlanesStore.edgePositions.currentMin,
      max: ClippingPlanesStore.edgePositions.currentMax,
    };

    for (let idx = 0; idx < results.length; idx++) {
      const object = results[idx];
      const point = object.point;
      if (isPointInsideBox(boxDimensions, point)) return object;
    }

    return false;
  }
}

async function pickCrossPlane(event) {
  setupCast(event);

  const result = new THREE.Vector3();
  for (let idx = 0; idx < ClippingPlanesStore.crossPlane.planes.length; idx++) {
    const plane = ClippingPlanesStore.crossPlane.planes[idx];
    RaycastStore.raycaster.ray.intersectPlane(plane, result);
    const coordinates = { ...({ x, y, z } = result) };
    for (const key in coordinates) {
      if (result[key] != 0) return result;
    }
  }
  return false;
}

function pickAxlePlane() {
  RaycastStore.raycaster.setFromCamera(new THREE.Vector2(), Scene.camera);

  const planes = [];
  const normals = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
  };

  for (const axle in normals) {
    const normal = normals[axle];

    const crossPlane = new THREE.Plane(normal, 0);
    planes.push(crossPlane);

    // const helper = new THREE.PlaneHelper(crossPlane, 1000, 0x000000);
    // Scene.scene.add(helper);
  }

  // Casts a ray for each model uploaded, returns object
  const results = [];
  for (let idx = 0; idx < planes.length; idx++) {
    const result = new THREE.Vector3();
    const plane = planes[idx];
    RaycastStore.raycaster.ray.intersectPlane(plane, result);

    if (result) {
      results.push(result);
    }
  }

  const result = getRaycastingResultPoint();
  function getRaycastingResultPoint() {
    const distances = results.map((pos) => pos.distanceTo(RaycastStore.raycaster.camera.position));
    const minDistance = Math.min(...distances);
    const idx = distances.indexOf(minDistance);
    return results[idx];
  }
  return result;
}

//
// AUX Functions

function setupCast(event, type = false) {
  // Computes the position of the mouse on the screen
  const bounds = Scene.threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  RaycastStore.mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  RaycastStore.mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse

  RaycastStore.raycaster.setFromCamera(RaycastStore.mouse, Scene.camera);
}

async function castEachModel() {
  const results = [];

  let boxDimensions = undefined;
  if (userInteractions.clippingPlanes) {
    boxDimensions = {
      min: ClippingPlanesStore.edgePositions.currentMin,
      max: ClippingPlanesStore.edgePositions.currentMax,
    };
  }

  // Get intercepted object closest to the user camera/mouse, if there is one
  // RaycastIntersectObject is used to tie the object to its model loader
  for (let idx = 0; idx < Models.models.length; idx++) {
    const arr = [RaycastStore.subsetRaycast[idx]];
    // account for hidden objects
    const resultsPerModel = RaycastStore.raycaster.intersectObjects(arr);
    if (resultsPerModel.length == 0) continue;

    let result = undefined;
    // if clipping is active, check if intersection occurs inside the clipping box
    if (userInteractions.clippingPlanes) {
      for (let idx = 0; idx < resultsPerModel.length; idx++) {
        const _result = resultsPerModel[idx];
        const intersectionPoint = _result.point;
        if (isPointInsideBox(boxDimensions, intersectionPoint)) {
          result = _result;
          break;
        }
      }
    } else result = resultsPerModel[0];

    if (!result) continue;
    const intersectiongObj = new RaycastIntersectObject(result, idx);
    results.push(intersectiongObj);
  }

  if (results.length > 0) {
    const found = getRaycastingResult(results);
    return found;
  }

  return false;
}

/**
 * Gets object closest to the camera from all the results obtained
 * @param {Array} results Results from raycasting process
 */
function getRaycastingResult(results) {
  const minDistance = Math.min(...results.map((x) => x.object.distance));
  const found = results.find((x) => x.object.distance == minDistance);
  return found;
}

async function storeFoundObjectProperties(isSelection) {
  const index = RaycastStore.found.object.faceIndex;
  const geometry = RaycastStore.found.object.object.geometry;

  const modelIdx = RaycastStore.found.idx;
  const ifcLoader = Models.models[modelIdx].loader;
  const id = ifcLoader.ifcManager.getExpressId(geometry, index);
  const props = await ifcLoader.ifcManager.getItemProperties(0, id);
  const objectsData = [
    {
      modelIdx: modelIdx,
      expressIDs: props.expressID,
    },
  ];
  if (isSelection) SelectedStore.setSelectedProperties(props, objectsData, true);
  else SelectedStore.setHighlightedProperties("fake props", objectsData, true);

  return true;
}

/**
 * Checks if intersection point found by raycasting in part of the active clipping box
 *
 * This check prevents a bug where user could select hidden parts of a plane to move it
 *
 * Due to raycasting error margins, a customizable buffer is used.
 * This buffer prevents edge cases where a legitimate intersection point would be discarded, leading to unwanted behaviour
 * @param {Intersection Point} point
 * @returns true if point is inside the active planes' box, false otherwise
 */
function isPointInsideBox(boxDimensions, point) {
  const buffer = 0.000000001;
  for (const axle in point) {
    const value = point[axle];
    if (value > boxDimensions.max[axle]) {
      if (Math.abs(value - boxDimensions.max[axle]) > buffer) return false;
    }
    if (value < boxDimensions.min[axle]) {
      if (Math.abs(value - boxDimensions.min[axle]) > buffer) return false;
    }
  }
  return true;
}

export { pickObject, pickClippingPlane, pickCrossPlane, pickAxlePlane };
