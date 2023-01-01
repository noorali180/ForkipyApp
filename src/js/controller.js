'use strict'
import 'core-js/stable';
import 'regenerator-runtime/runtime'

import * as model from './model.js'
import {viewRecipe} from './views/viewRecipe.js';


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);
    // guard clause, (id don't exist)
    if(!id) return;

    viewRecipe.renderSpinner();

    // 1. get recipe
      await model.loadRecipe(id);
    // 2. render recipe
      viewRecipe.render(model.state.recipe);
  }
  catch (err){
    viewRecipe.renderErrorMessage();
  }
}

// window.addEventListener('hashchange', controlRecipes);
// showRecipe();

// PUBLISHER-SUBSCRIBER Architecture,
// publisher: knows when to react => addHandlerRender (view)
// subscriber: wants to react => init (controller)
const init = function(){
  viewRecipe.addHandlerRender(controlRecipes);
}
init();
