<template>
    <PopupWithHeader :title="'Saving view'" :subtitle="'Creating new saved perspective'" :icon="icons.savedViews">
        <form class="styling-form" @submit.prevent="saveView">
            <label for="note" class="styling-form-label">Title</label>
            <input type="text" v-model="note" id="saved-view-form-note-input" class="styling-form-input" name="note" />
            <span v-if="!note" class="styling-form-warning">Please input a title</span>
            <span v-if="!isNameValid" class="styling-form-warning">There's already a saved view with the same title!</span>
            <input type="submit" value="Save" :disabled="!isNameValid || !note" class="styling-form-submit" />
        </form>
    </PopupWithHeader>
</template>
  
<script>
import { icons } from "../../configs/icons";
import PopupWithHeader from "../PopupWithHeader.vue";
import SavedView from "../../models/SavedView";
import { addSavedView, savedViews } from "../../stores/savedViews";
import { getCameraData } from "../../helpers/camera";
import * as ClippingPlanesStore from "../../stores/clippingPlanes";
import { clipping } from "../../helpers/clippingPlanes";
import { getVisibilityByIds } from "../../stores/selection";

export default {
    components: {
        PopupWithHeader,
    },
    data() {
        return {
            note: "",
        };
    },
    computed: {
        isNameValid() {
            const viewsNamesUsed = savedViews.map((x) => x.note);
            return !viewsNamesUsed.includes(this.note);
        },
    },
    methods: {
        saveView() {
            if (!this.note) {
                return;
            }

            if (!this.isNameValid) {
                return;
            }

            const cameraData = getCameraData();
            if (ClippingPlanesStore.visualPlanes.length == 0) {
                // build clipping planes
                clipping(true);
                // disable their render
                clipping(false);
            }
            const clippingData = {
                min: ClippingPlanesStore.edgePositions.currentMin.clone(),
                max: ClippingPlanesStore.edgePositions.currentMax.clone(),
            };
            const renderVisibilityData = JSON.parse(JSON.stringify(getVisibilityByIds()));
            const hiddenIds = {};
            // Cycle models
            for (const modelIdx in renderVisibilityData) {
                if (Object.hasOwnProperty.call(renderVisibilityData, modelIdx)) {
                    const modelVisibilityData = renderVisibilityData[modelIdx];
                    hiddenIds[modelIdx] = [];
                    // Cycle objects in model
                    for (const expressId in modelVisibilityData) {
                        if (Object.hasOwnProperty.call(modelVisibilityData, expressId)) {
                            // If object is hidden, push its expressId to hiddensIds
                            const status = modelVisibilityData[expressId];
                            if (!status) hiddenIds[modelIdx].push(expressId);
                        }
                    }
                }
            }
            const savedView = new SavedView(cameraData, clippingData, hiddenIds);
            savedView.note = this.note;
            addSavedView(savedView);

            this.$emit("saved", savedView);
        },
    },
    props: {
        icons: {
            type: Object,
            default: () => icons,
        },
    },
};
</script>
  