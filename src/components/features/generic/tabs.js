import { emitCustomEventOnElement } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";

/**
 * Renders tabs component for sidebar feature.
 * All events pass tab "ref" as detail
 * Emits: tabSelected
 * Listens: selectTab, deselectTab
 * @param {object[]} tabs {title, ref, status} - title refers to the text displayed in the UI; ref is used when for event handling between the component and the parent; status is wether it renders active of not
 * @param {boolean} isOnlyOneActiveTab Default true; Wether or not tabs disable automatically when another one is selected
 */
function render(component, tabs, isOnlyOneActiveTab = true, isAlwaysOneTabActive = true) {
  const element = createElement("ul", {
    classes: ["sidebar-feature-tabs-wrapper"],
  });

  tabs.forEach((tab) => {
    const tabEl = createElement("li", {
      classes: ["sidebar-feature-tabs-tab"],
      textContent: tab.title,
    });
    handleTabEvents(tab, tabEl);
    element.appendChild(tabEl);
  });

  return element;

  function handleTabEvents(tab, tabEl) {
    // Emits "tabSelected" to parent element on click and enables "active" class
    tabEl.addEventListener("click", (e) => {
      const isActive = tab.status;
      if (isActive) {
        const activeCounter = element.getElementsByClassName("active").length;
        if(!isAlwaysOneTabActive || activeCounter > 1) emitCustomEventOnElement(component, "tabDeselected", { ref: tab.ref });
      }
      else emitCustomEventOnElement(component, "tabSelected", { ref: tab.ref });
    });

    // Listens "tabSelected" triggered by other tab or own tab
    component.addEventListener("tabSelected", (e) => {
      const ref = e.detail.ref;
      tab.status = false;
      if (tab.ref === ref) tab.status = true;

      // When multiple tabs can be active at the same time and it's not the selected tab by the user, do nothing;
      if (!isOnlyOneActiveTab && !isActivedTab) return;

      tabEl.classList.toggle("active", tab.status);
    });

    // Listens "tabDeselected" triggered by other tab or own tab
    component.addEventListener("tabDeselected", (e) => {
      disableActiveStatus(tabEl, tab, e);
    });

    // Listens "selectTab" coming from outside parent and enables "active" class
    component.addEventListener("selectTab", (e) => {
      const ref = e.detail.ref;
      if (tab.ref !== ref) return;
      tabEl.classList.toggle("active", true);
    });

    // Listens "deselectTab" coming from outside parent and disables "active" class
    component.addEventListener("deselectTab", (e) => {
      disableActiveStatus(tabEl, tab, e);
    });
  }
}

function disableActiveStatus(element, data, event) {
  const ref = event.detail.ref;
  if (data.ref !== ref) return;
  tab.status = false;
  element.classList.toggle("active", false);
}

export { render as renderSidebarTabs };
