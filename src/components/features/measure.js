import  pointToPoint  from "../../helpers/measures.js";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { userInteractions } from "../../stores/userInteractions";
import { loadCSS } from "../../helpers/generic/cssLoader";

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  loadCSS("./src/assets/css/measures.css");

  document.addEventListener("openPointToPoint", (e) => {
    navItem.isActive = true;
    navItem.load();
  });
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  userInteractions.pointToPoint = true;
  pointToPoint(true);
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function unload(navItem) {
  userInteractions.pointToPoint = false;
  pointToPoint(false);
}

export { build, load, unload };
