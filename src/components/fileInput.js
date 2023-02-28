import { emitGlobalEvent } from "../helpers/emitEvent";
import loadModels from "../helpers/loadModels";

export default function startInput() {

  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.id = 'file-input'
  input.accept = '.ifc, .ifcXML, .ifcZIP'

  const inputBtn = document.createElement('button')
  inputBtn.multiple = true
  inputBtn.textContent = 'Select File'
  inputBtn.id = 'input-button'
  inputBtn.onclick = () => input.click();

  document.body.appendChild(input)
  document.body.appendChild(inputBtn)

  input.addEventListener(
    "change",
    async (event) => {
      toggleFileInput(inputBtn)
      emitGlobalEvent("loading")
      await loadModels(event)
    },
    false
  );
  
}

function toggleFileInput(inputBtn){
  inputBtn.classList.toggle('hidden')
}