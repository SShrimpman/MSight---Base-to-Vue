<template>
    <input type="file" ref="fileInputRef" id="file-input" accept=".ifc, .ifcXML, .ifcZIP" multiple @change="uploadAndHide"> 
    <button id="input-button" ref="buttonInput" @click.prevent="$refs[fileInputRef].click()">Select File</button>
</template>

<script>
import { nextTick } from "vue";
import { emitGlobalEvent } from "../helpers/emitEvent"
import loadModels from "../helpers/loadModels"

// const inputBtn = document.getElementById('input-button');

export default {
    data(){
        return{
            fileInputRef: "fileInputRef",
            buttonInput: "buttonInput",
        }
    },
    methods: {
        async uploadAndHide(event) {
            const fileInput = this.$refs[this.fileInputRef];
            const buttonInput = this.$refs[this.buttonInput];
            nextTick(() => {
                fileInput.classList.add("hidden")
                buttonInput.classList.add("hidden")
            })
            emitGlobalEvent("loading");
            await loadModels(event);
        },
    }
}
</script>

<style scoped>
#file-input {
    z-index: 2;
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
    border: var(--primary-color-light-transparent) solid 1px;
    border-radius: 8px;
    padding: 8px;
    visibility: hidden;
}

#input-button {
    z-index: 1;
    width: 140px;
    position: absolute;
    font-family: var(--font-family);
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
    background-color: white;
    color: gray;
    border: var(--primary-color-light-transparent) solid 1px;
    border-radius: 8px;
    padding: 8px;
}

#input-button:hover {
    background-color: var(--primary-color-light-transparent);
    color: #152243;
}
</style>