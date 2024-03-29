import { icons } from "../../../configs/icons";
import { createElement } from "../../../helpers/generic/domElements";
import featureRenderingHandler from "../../../helpers/navbar/featureRenderingHandler";
import { buildIcon } from "../../generic/icon";
import { renderSidebarTabs } from "../generic/tabs";

/**
 *
 * @param {NavbarItem} item
 */
function render(item) {
  const mainSidebarFeature = createElement("div", {
    classes: ["main-sidebar-feature"],
  });

  mainSidebarFeature.innerHTML = `
    <span>${item.title}</span>
    <div class="main-sidebar-feature-content content-container"></div>
  `;
  const contentEl = mainSidebarFeature.getElementsByTagName("div")[0];

  const closeIcon = buildIcon(icons.closeDark);
  mainSidebarFeature.insertBefore(closeIcon, contentEl);

  handleEvents();

  return mainSidebarFeature;

  function handleEvents() {
    closeIcon.addEventListener("click", (e) => {
      item.isActive = false;
      featureRenderingHandler(item);
    });
  }
}

function addContent(component, content) {
  const contentEl = component.getElementsByClassName("content-container")[0];
  contentEl.appendChild(content);
}

/**
 * Adds tabs to sidebar feature.
 * 
 * All events pass tab "ref" as detail
 * 
 * Emits: tabSelected, tabDeselected
 * 
 * Listens: selectTab, deselectTab
 * @param {HTMLElement} component Feature base component
 * @param {object[]} tabs {title, ref, status} - title refers to the text displayed in the UI; ref is used when for event handling between the component and the parent; status is wether it renders active of not
 */
function addTabs(component, tabs) {
  const oldContentEl = component.getElementsByTagName("div")[0];
  const content = oldContentEl.innerHTML;
  oldContentEl.classList.remove("content-container");

  const wrapper = createElement("div", {
    classes: ["main-sidebar-feature-wrapper-with-tabs"],
  });
  const contentEl = createElement("div", {
    classes: ["content-container", "main-sidebar-feature-wrapper-with-tabs-content"],
    innerHTML: content,
  });
  wrapper.appendChild(contentEl);

  const tabsEl = renderSidebarTabs(component, tabs);
  wrapper.appendChild(tabsEl);
  
  oldContentEl.innerHTML = "";
  oldContentEl.appendChild(wrapper);
}

export { render as renderSidebarFeature, addContent as addContentToSidebarFeature, addTabs as addTabsToSidebarFeature };
