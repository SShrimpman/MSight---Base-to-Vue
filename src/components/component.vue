<template>
    <div>
        <div id="three-canvas"></div>
    </div>
</template>
  
<script>
import {
    pickObject,
    dragClippingPlane,
    pickClippingPlane,
    moveClippingPlane,
    stopMovingClippingPlane,
    emitGlobalEvent,
    resetVisuals,
    resetVisualPlanesColoring,
    resetHighlighted,
    highlightVisualPlane,
    disableFeatureKeys,
    isUserPressingSpecialKeys,
    userInteractions,
    ClippingPlanesStore,
} from "../../lib/threejs/threehelper";

let isMouseDragging = false;

export default {
    data() {
        return {
            canvas: document.getElementById("three-canvas"),
        };
    },
    mounted() {
        document.addEventListener("wereReady", () => {
            emitGlobalEvent("loadingComplete");

            // Double-click => highlights and shows details of pointed object
            this.canvas.ondblclick = (event) => pickObject(event, true, true);

            this.canvas.onmousemove = async (event) => {
                // When mouse is dragging a clipping plane
                if (isMouseDragging) {
                    if (userInteractions.draggingPlane)
                        await dragClippingPlane(event);
                    return;
                }
                // When user is pressing any special key, do nothing
                if (isUserPressingSpecialKeys() || userInteractions.keyCActive) {
                    resetVisualPlanesColoring();
                    resetHighlighted();
                    return;
                }
                // When mouse is just hovering
                //// and C is active
                if (userInteractions.clippingPlanes && !userInteractions.keyXActive) {
                    resetHighlighted(); // prevent visual artifacts
                    const isPlaneFound = await pickClippingPlane(event);
                    if (!isPlaneFound) resetVisualPlanesColoring();
                    else highlightVisualPlane();
                    return;
                }
                //// and C is inactiveccc
                if (userInteractions.keyXActive) {
                    resetVisualPlanesColoring(); // prevent visual artifacts
                    pickObject(event, true, false);
                }
            };

            let isMovingPlanes = false;
            // Prevents highlighting when moving camera (more fluid movement)
            this.canvas.onmousedown = async (event) => {
                isMouseDragging = true;

                // clipping plane
                if (
                    !ClippingPlanesStore.foundPlane ||
                    !userInteractions.clippingPlanes ||
                    userInteractions.keyCActive ||
                    userInteractions.keyXActive
                )
                    return;

                isMovingPlanes = true;

                // plane moving logic
                await moveClippingPlane(event);
            };
            this.canvas.onmouseup = (event) => {
                isMouseDragging = false;

                // clipping plane
                if (!isMovingPlanes) return;

                isMovingPlanes = false;

                // plane end movement logic
                stopMovingClippingPlane(event);
            };

            window.addEventListener("keydown", (event) => {
                const keyPressed = event.code;
                switch (keyPressed) {
                    case "ControlLeft":
                        userInteractions.controlActive = true;
                        break;
                    // case "KeyC":
                    //   userInteractions.keyCActive = true;
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
                        resetVisuals();
                        break;
                    }
                    case "KeyX": {
                        if (userInteractions.keyCActive) return;
                        userInteractions.keyXActive = !userInteractions.keyXActive;
                        resetVisuals();
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    },
};
</script>