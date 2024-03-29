import { emitGlobalEvent } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";
import BranchNode from "../../../models/SpatialTree/BranchNode";
import * as Models from "../../../stores/models";
import { objectsData } from "../../../stores/renderObjects";
import { buildTree } from "./tree";

async function render() {
  emitGlobalEvent("loading");

  const element = createElement("ul", {
    classes: ["tree-wrapper"],
  });

  setTimeout(() => {
    const objects = Array.from(objectsData);

    // Send data to be processed in web worker
    const worker = new Worker("/src/tools/workers/spatialTree/byCategory.js", { type: "module" });
    worker.postMessage(objects);
    worker.onerror = (event) => {
      console.log("There is an error with your worker!");
    };
    worker.onmessage = async (e) => {
      const _objectsByCategory = e.data;

      const tree = _objectsByCategory.reduce((acc, cv) => {
        const branch = new BranchNode(cv);
        acc.push(branch);
        return acc;
      }, []);

      await buildTree(element, tree);

      worker.terminate();

      emitGlobalEvent("loadingComplete");
    };
  }, 1);

  return element;
}

export { render as renderSpatialTreeByCategory };
