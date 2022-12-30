'use strict'
import 'core-js/stable';
import 'regenerator-runtime/runtime'

import * as model from './model.js'
import {viewRecipe} from './views/viewRecipe.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const showRecipe = async function() {
  try{
    const id = window.location.hash.slice(1);
    // guard clause, (id not exist)
    if(!id) return;

    viewRecipe.renderSpinner();

    // 1. get recipe
      await model.loadRecipe(id);
    // 2. render recipe
      viewRecipe.render(model.state.recipe);

  }
  catch (err){
    console.log(err);
  }
}

window.addEventListener('hashchange', showRecipe);
// showRecipe();
