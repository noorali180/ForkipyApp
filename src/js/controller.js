'use strict'
import 'core-js/stable';
import 'regenerator-runtime/runtime'

import * as model from './model.js'
import {viewRecipe} from './views/viewRecipe.js';
import {viewSearch} from './views/viewSearch.js';
import { viewResults } from './views/viewResults.js';
import { viewPagination } from './views/viewPagination.js';


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

    // 1. get recipe
      await model.loadRecipe(id);
    // 2. render recipe
      viewRecipe.render(model.state.recipe);

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
    viewResults.renderErrorMessage('No results found! Try another one');
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
}

// window.addEventListener('hashchange', controlRecipes);
// showRecipe();

// PUBLISHER-SUBSCRIBER Architecture,
// publisher: knows when to react => addHandlerRender (view)
// subscriber: wants to react => init (controller)
const init = function(){
  viewRecipe.addHandlerRender(controlRecipes);
  viewRecipe.addHandlerUpdateServings(controlServings);
  viewRecipe.addHandlerAddBookmark(controlAddBookmark)
  viewSearch.addHandlerSearch(controlSearch);
  viewPagination.addHandlerClick(controlPagination);
  
}
init();
