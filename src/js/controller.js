'use strict'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

import * as model from './model.js'
import {viewRecipe} from './views/viewRecipe.js';
import {viewSearch} from './views/viewSearch.js';
import { viewResults } from './views/viewResults.js';
import { viewPagination } from './views/viewPagination.js';
import { viewBookmarks } from './views/viewBookmarks.js';
import { viewAddRecipe } from './views/viewAddRecipe.js';
import { HIDE_FORM_TIMEOUT } from './config.js';


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);
    // guard clause, (id don't exist)
    if(!id) return;

    viewRecipe.renderSpinner();

    // 0. active recipe get selected.
      viewResults.update(model.getSearchResultsPerPage());
    // active bookmark get selected.
      viewBookmarks.update(model.state.bookmarks);

    // 1. get recipe
      await model.loadRecipe(id);
    // 2. render recipe
      viewRecipe.render(model.state.recipe);

      console.log(model.state.recipe);

  }
  catch (err){
    console.log(err)
    viewRecipe.renderErrorMessage();
  }
}

const controlSearch = async function(){
  try{
    const query = viewSearch.getQuery();

    if(!query) return;

    viewResults.renderSpinner();

    // 1. Get search results.
      await model.loadSearchResults(query);

    // 2. Render search results. 
      // viewResults.render(model.state.search.results);
      viewResults.render(model.getSearchResultsPerPage(model.state.search.page));

    // 3. Render initial pagination.
      viewPagination.render(model.state.search);

  }
  catch(err){
    viewResults.renderErrorMessage();
  }
}

const controlPagination = function(goToPage){
  
    // 1. Render NEW search results.
    viewResults.render(model.getSearchResultsPerPage(goToPage));
    // 4. Render NEW pagination.
    viewPagination.render(model.state.search);
}

const controlServings = function(newServings){
  // 1. update new servings in state
    model.updateServings(newServings);
  // 2. render the complete recipe with new servings.
    // viewRecipe.render(model.state.recipe);
    viewRecipe.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // 1. add a bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. update the UI
  viewRecipe.update(model.state.recipe);

  // 3. render bookmarks view
  viewBookmarks.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  viewBookmarks.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // render spinner
    viewAddRecipe.renderSpinner();

    // Upload
    await model.uploadNewRecipe(newRecipe);

    // render sucess message
    viewAddRecipe.renderMessage();

    // render the viewRecipe
    viewRecipe.render(model.state.recipe);

    // hide the form
    setTimeout(() => {
      viewAddRecipe._toggleWindow();
    }, HIDE_FORM_TIMEOUT);
  }
  catch(err){
    viewAddRecipe.renderErrorMessage(err.message);
  }
}

// window.addEventListener('hashchange', controlRecipes);
// showRecipe();

// PUBLISHER-SUBSCRIBER Architecture,
// publisher: knows when to react => addHandlerRender (view)
// subscriber: wants to react => init (controller)
const init = function(){
  viewBookmarks.addHandlerLoad(controlBookmarks);
  viewRecipe.addHandlerRender(controlRecipes);
  viewRecipe.addHandlerUpdateServings(controlServings);
  viewRecipe.addHandlerAddBookmark(controlAddBookmark)
  viewSearch.addHandlerSearch(controlSearch);
  viewPagination.addHandlerClick(controlPagination);
  viewAddRecipe.addHandlerUpload(controlAddRecipe);
  
}
init();
