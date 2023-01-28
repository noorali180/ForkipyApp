"use strict";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import * as model from "./model.js";
import { viewRecipe } from "./views/viewRecipe.js";
import { viewSearch } from "./views/viewSearch.js";
import { viewResults } from "./views/viewResults.js";
import { viewPagination } from "./views/viewPagination.js";
import { viewBookmarks } from "./views/viewBookmarks.js";
import { viewAddRecipe } from "./views/viewAddRecipe.js";
import { MODAL_HIDE_SEC } from "./config.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// function: callback fuction to control recipes and render | update recipes...
/**
 * callback function (Recipe View)
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // guard clause, (id don't exist)
    if (!id) return;

    // 0. render the spinner (Recipe View)
    viewRecipe.renderSpinner();

    // 1. active recipe get selected. (Result View)
    viewResults.update(model.getSearchResultsPerPage());
    // active bookmark get selected. (Bookmarks View)
    viewBookmarks.update(model.state.bookmarks);

    // 2. get recipe from API.
    await model.loadRecipe(id);

    // 3. render recipe. (Recipe View)
    viewRecipe.render(model.state.recipe);
  } catch (err) {
    // 0. render error message. (Recipe View)
    viewRecipe.renderErrorMessage();
  }
};

// function: callback function to control search results (get | render | update)...
/**
 * callback function (Search View)
 */
const controlSearch = async function () {
  try {
    // 0. get serach query.
    const query = viewSearch.getQuery();

    if (!query) return;

    // 1. render spinner. (Results View)
    viewResults.renderSpinner();

    // 2. Get search results from API.
    await model.loadSearchResults(query);

    // 3. Render search results. (Results View)
    // viewResults.render(model.state.search.results);
    viewResults.render(model.getSearchResultsPerPage(model.state.search.page)); // note: rendering results per page.

    // 4. Render initial pagination. (Pagination View)
    viewPagination.render(model.state.search);
  } catch (err) {
    // 0. render error message. (Results View)
    viewResults.renderErrorMessage();
  }
};

// function: callback function to control the pagination (current page, next page button, previouse page button)...
/**
 * callback function (Pagination View)
 * @param {number} goToPage coming from HTML markup (data attribute)
 */
const controlPagination = function (goToPage) {
  // 0. Render NEW search results. (Results View)
  viewResults.render(model.getSearchResultsPerPage(goToPage));
  // 1. Render NEW pagination. (Pagination View)
  viewPagination.render(model.state.search);
};

// function: callback function to control the servings (increase | decrease)...
/**
 * callback function (Recipe View)
 * @param {number} newServings always coming from HTML markup (data attribute)
 */
const controlServings = function (newServings) {
  // 0. update new servings in state.
  model.updateServings(newServings);
  // 1. render the complete recipe with new servings. (Rercipe View)
  // viewRecipe.render(model.state.recipe);
  viewRecipe.update(model.state.recipe);
};

// function: callback function to manage bookmarks (add | delete)...
/**
 * callback function (Recipe View)
 */
const controlAddBookmark = function () {
  // 0. add a bookmark (on click toggle)
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 1. update the recipe. (Recipe View)
  viewRecipe.update(model.state.recipe);

  // 2. render bookmarks view. (Bookmarks View)
  viewBookmarks.render(model.state.bookmarks);
};

// function: callback function to control bookmarks (render | update)...
/**
 * callback function (Bookmarks View)
 */
const controlBookmarks = function () {
  // 0. render bookmarks. (Bookmarks View)
  viewBookmarks.render(model.state.bookmarks);
};

// function: callback function to add user generated recipes...
/**
 * callback function (AddRecipe View)
 * @param {Object} newRecipe user generated recipe
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // 0. render spinner. (AddRecipe View)
    viewAddRecipe.renderSpinner();

    // 1. Upload recipe on API.
    await model.uploadNewRecipe(newRecipe);

    // 2. render sucess message. (AddRecipe View)
    viewAddRecipe.renderMessage();

    // 3. render the viewRecipe. (Recipe View)
    viewRecipe.render(model.state.recipe);

    // 4. hide the form (AddRecipe View)
    setTimeout(() => {
      viewAddRecipe._toggleWindow();
    }, MODAL_HIDE_SEC * 1000);

    // 5. render bookmarks. (Bookmarks View)
    viewBookmarks.render(model.state.bookmarks);

    // 6. changing the URL without reloading the page...
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
  } catch (err) {
    // 0. render error message. (AddRecipe View)
    viewAddRecipe.renderErrorMessage(err.message);
  }
};

// window.addEventListener('hashchange', controlRecipes);
// showRecipe();

/////////////////////////////////////////
/* 
// NOTE: PUBLISHER-SUBSCRIBER Architecture, publisher: knows when to react => addHandlerRender (view), subscriber: wants to react => init (controller)
*/
/////////////////////////////////////////

// function to add handlers when page loades.
const init = function () {
  viewBookmarks.addHandlerLoad(controlBookmarks);
  viewRecipe.addHandlerRender(controlRecipes);
  viewRecipe.addHandlerUpdateServings(controlServings);
  viewRecipe.addHandlerAddBookmark(controlAddBookmark);
  viewSearch.addHandlerSearch(controlSearch);
  viewPagination.addHandlerClick(controlPagination);
  viewAddRecipe.addHandlerUpload(controlAddRecipe);
};
init();
