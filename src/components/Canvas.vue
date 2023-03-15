<template>
    <canvas @contextmenu.prevent ref="canvas" @click="closeMenuOut" id="three-canvas"
        @auxclick.ctrl.prevent="showContextMenu"></canvas>
    <ContextMenu @contextmenu.prevent ref="contextMenu" v-if="showMenu" 
        :options="options" :mousePos="mousePos" @closeMenu="closeMenu"/>
</template>
  
<script>
import {
    pickObject,
    pickClippingPlane,
    pickCrossPlane,
} from "../helpers/raytracing";
import * as ClippingPlanesStore from "../stores/clippingPlanes";
import {
    disableFeatureKeys,
    isUserPressingSpecialKeys,
    userInteractions
} from "../stores/userInteractions";
import * as Materials from "../configs/materials";
import * as SceneStore from "../stores/scene";
import * as THREE from "three";
import { clippingConfigs } from "../configs/clippingPlanes";
import ContextMenu from "./contextMenu/ContextMenu.vue";
import { renderAnnotationForm } from "../components/annotation/form";
import { setCameraLookingPoint, setCameraLookingWorldCenter, setCameraLookingPointHere } from "../helpers/camera";
import * as RaycastStore from "../stores/raycast";
import * as SelectedStore from "../stores/selection.js";
import { openSavedViewForm } from "../helpers/savedViews";

let isMouseDragging = false;

export default {
    data() {
        return {
            mousePos: { x: 0, y: 0 },
            showMenu: false,
            options: [],
            _opacity: undefined,
            _color: undefined,
            _uuid: undefined,
        }
    },
    name: "MyThreeCanvas",
    components: {
        ContextMenu
    },
    mounted() {
        this.initCanvas();
    },
    methods: {
        async showContextMenu(e) {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;

            if (!userInteractions.controlActive) return;

            this.toggleCameraControls(false);

            const object = await pickObject(e, false);

            // Set the options based on whether an object was clicked
            if (object) {
                this.options = this.objectContextOptions();
            } else {
                this.options = this.freeContextOptions();
            }

            // Add event listener to close menu when clicked outside
            // document.body.addEventListener('mousedown', this.closeMenu);

            this.showMenu = true;
        },
        closeMenuOut(){
            this.closeMenu();
        },
        closeMenu() {
            if (SceneStore.controls.enabled) return  
                this.showMenu = false;
                this.toggleCameraControls(true);
        },
        objectContextOptions() {
            return [
                {
                    displayText: 'Focus camera here',
                    hasSeperator: false,
                    action: (position) => { setCameraLookingPointHere(position.x, position.y); this.closeMenu(); }
                },
                {
                    displayText: 'Focus camera on model center',
                    hasSeperator: true,
                    action: () => { setCameraLookingWorldCenter(); this.closeMenu(); }
                },
                {
                    displayText: 'Save view',
                    hasSeperator: false,
                    action: (position) => { openSavedViewForm(position); this.closeMenu(); }
                },
                {
                    displayText: 'Create annotation',
                    hasSeperator: true,
                    action: (position) => { const form = renderAnnotationForm(position); document.body.appendChild(form); this.closeMenu();
                    },
                },
            ];
        },
        freeContextOptions() {
            return [
                {
                    displayText: 'Focus camera on model center',
                    hasSeperator: true,
                    action: () => { setCameraLookingWorldCenter(); this.closeMenu(); }
                },
                {
                    displayText: 'Save view',
                    hasSeperator: true,
                    action: (position) => { openSavedViewForm(position); this.closeMenu(); }
                },
            ];
        },
        resetVisuals() {
            this.resetVisualPlanesColoring();
            this.resetHighlighted();
        },
        resetVisualPlanesColoring() {
            if (!this._uuid) return;
            for (let idx = 0; idx < this.$store.state.ClippingPlanesStore.visualPlanes.length; idx++) {
                const visualPlane = this.$store.state.ClippingPlanesStore.visualPlanes[idx];
                visualPlane.material.opacity = this._opacity;
                visualPlane.material.color = this._color;
            }
            this._uuid = undefined;
        },
        resetHighlighted() {
            RaycastStore.resetFound();
            SelectedStore.resetHighlightedProperties();
        },
        highlightVisualPlane() {
            const visualPlane = ClippingPlanesStore.foundPlane.object;

            if (visualPlane.uuid == this._uuid) return;

            this.resetVisualPlanesColoring();

            const noRef = { ...visualPlane };
            this._uuid = noRef.uuid;
            if (!this._opacity) this._opacity = noRef.material.opacity;
            if (!this._color) this._color = noRef.material.color;

            visualPlane.material.opacity = 0.28;
            visualPlane.material.color = Materials.materials.highlighted.color;
        },
        toggleCameraControls(isOn) {
            // this.$store.commit('setControls', { enabled: isOn });
            SceneStore.controls.enabled = isOn;
        },
        async moveClippingPlane(event) {
            // disable camera
            this.toggleCameraControls(false);
            // drag plane
            userInteractions.draggingPlane = true;

            const vNormal = ClippingPlanesStore.normals[
                ClippingPlanesStore.selectedPlaneIdx
            ];
            const key = vNormal.y !== 0 ? 'y' : 'x';
            const axleOfMovement = key == 'y' ? key : vNormal.x !== 0 ? 'x' : 'z';

            const normals = {
                x: new THREE.Vector3(1, 0, 0),
                y: new THREE.Vector3(0, 1, 0),
                z: new THREE.Vector3(0, 0, 1),
            };

            for (const axle in normals) {
                if (axle == axleOfMovement) continue;

                const normal = normals[axle];
                const crossPlane = new THREE.Plane(
                    normal,
                    ClippingPlanesStore.center[axle]
                );
                ClippingPlanesStore.crossPlane.planes.push(crossPlane);

                // const helper = new THREE.PlaneHelper(crossPlane, 1000, 0x000000);
                // scene.add(helper);
            }

            ClippingPlanesStore.crossPlane.points.start = await pickCrossPlane(event);
        },
        stopMovingClippingPlane(event) {
            // enable camera
            this.toggleCameraControls(true);
            // stop plane
            userInteractions.draggingPlane = false;
            ClippingPlanesStore.resetCrossPlane();
        },
        async dragClippingPlane(event, isUserInteraction) {
            const visualPlane = ClippingPlanesStore.foundPlane.object;
            const vNormal = ClippingPlanesStore.normals[ClippingPlanesStore.selectedPlaneIdx];

            const axleOfMovement = vNormal.y !== 0 ? "y" : vNormal.x !== 0 ? "x" : "z";

            const multiplier = userInteractions.controlActive ? clippingConfigs.multiplier.precision : clippingConfigs.multiplier.normal;
            const maximum = clippingConfigs.maxJump;

            const endPoint = await pickCrossPlane(event);

            if (!endPoint) return;

            ClippingPlanesStore.crossPlane.points.end.copy(endPoint);

            const initialPosition = ClippingPlanesStore.crossPlane.points.start;
            const finalPosition = ClippingPlanesStore.crossPlane.points.end;

            let value = (finalPosition[axleOfMovement] - initialPosition[axleOfMovement]) * multiplier;
            if (value > maximum) value = maximum;
            else if (value < maximum * -1) value = maximum * -1;

            const vectorAxles = {
                x: axleOfMovement == "x" ? value : 0,
                y: axleOfMovement == "y" ? value : 0,
                z: axleOfMovement == "z" ? value : 0,
            };
            const moveVector = new THREE.Vector3(vectorAxles.x, vectorAxles.y, vectorAxles.z);

            visualPlane.position.add(moveVector);

            // Checks for plane positioning reaching the minimum or maximum
            const buffer = clippingConfigs.buffer;
            const absoluteMinPosition = ClippingPlanesStore.edgePositions.min[axleOfMovement];
            const absoluteMaxPosition = ClippingPlanesStore.edgePositions.max[axleOfMovement];
            if (absoluteMinPosition > visualPlane.position[axleOfMovement]) visualPlane.position[axleOfMovement] = absoluteMinPosition;
            else if (absoluteMaxPosition < visualPlane.position[axleOfMovement])
                visualPlane.position[axleOfMovement] = absoluteMaxPosition;

            const edgeVectorChanged = vNormal[axleOfMovement] > 0 ? "currentMin" : "currentMax";
            const edgeVectorOther = edgeVectorChanged == "currentMin" ? "currentMax" : "currentMin";

            const relativeEdgePosition = ClippingPlanesStore.edgePositions[edgeVectorOther][axleOfMovement];

            if (edgeVectorChanged == "currentMax") {
                if (relativeEdgePosition + buffer > visualPlane.position[axleOfMovement]) {
                    visualPlane.position[axleOfMovement] = relativeEdgePosition + buffer;
                }
            } else {
                if (relativeEdgePosition - buffer < visualPlane.position[axleOfMovement]) {
                    visualPlane.position[axleOfMovement] = relativeEdgePosition - buffer;
                }
            }

            ClippingPlanesStore.edgePositions[edgeVectorChanged][axleOfMovement] = visualPlane.position[axleOfMovement];

            const cuttingPlane = ClippingPlanesStore.clippingPlanes[ClippingPlanesStore.selectedPlaneIdx];

            const newConstant = visualPlane.position[axleOfMovement] * vNormal[axleOfMovement] * -1;
            cuttingPlane.constant = newConstant;

            ClippingPlanesStore.crossPlane.points.start.copy(ClippingPlanesStore.crossPlane.points.end);
        },
        initCanvas() {
            // Initialize canvas and register event listeners
            const canvas = this.$refs.canvas;

            canvas.addEventListener("dblclick", (event) => pickObject(event, true, true));

            canvas.addEventListener("mousemove", async (event) => {
                if (isMouseDragging) {
                    if (userInteractions.draggingPlane) await this.dragClippingPlane(event);
                    return;
                }

                if (isUserPressingSpecialKeys() || userInteractions.keyCActive) {
                    this.resetVisualPlanesColoring();
                    this.resetHighlighted();
                    return;
                }

                if (userInteractions.clippingPlanes && !userInteractions.keyXActive) {
                    this.resetHighlighted();
                    const isPlaneFound = await pickClippingPlane(event);
                    if (!isPlaneFound) this.resetVisualPlanesColoring();
                    else this.highlightVisualPlane();
                    return;
                }

                if (userInteractions.keyXActive) {
                    this.resetVisualPlanesColoring();
                    this.pickObject(event, true, false);
                }
            });

            let isMovingPlanes = false
            canvas.addEventListener("mousedown", async (event) => {
                isMouseDragging = true;

                if (
                    !ClippingPlanesStore.foundPlane ||
                    !userInteractions.clippingPlanes ||
                    userInteractions.keyCActive ||
                    userInteractions.keyXActive
                )
                    return;

                isMovingPlanes = true;

                await this.moveClippingPlane(event);
            });

            canvas.addEventListener("mouseup", (event) => {
                isMouseDragging = false;

                if (!isMovingPlanes) return;

                isMovingPlanes = false;

                this.stopMovingClippingPlane(event);
            });

            window.addEventListener("keydown", (event) => {
                const keyPressed = event.code;
                switch (keyPressed) {
                    case "ControlLeft":
                        userInteractions.controlActive = true;
                        break;
                    // case "KeyC":
                    //   this.userInteractions.keyCActive = true;
                    //   break;
                    default:
                        break;
                }
            });

            window.addEventListener("keyup", (event) => {
                const keyPressed = event.code;
                switch (keyPressed) {
                    case "ControlLeft":
                        userInteractions.controlActive = false;
                        break;
                    case "KeyC": {
                        userInteractions.keyCActive = !userInteractions.keyCActive;
                        if (userInteractions.keyCActive) disableFeatureKeys();
                        this.resetVisuals();
                        break;
                    }
                    case "KeyX": {
                        if (userInteractions.keyCActive) return;
                        userInteractions.keyXActive = !userInteractions.keyXActive;
                        this.resetVisuals();
                        break;
                    }
                    default:
                        break;
                }
            });
        },
        beforeUnmount() {
            window.removeEventListener('contextmenu', this.showContextMenu);
        },
    }
}
</script>

<style scoped>
#three-canvas {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(0deg, rgb(250, 250, 250) 0%, var(--primary-color-light) 100%);
}
</style>