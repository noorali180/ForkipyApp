import { getJSON } from "./helpers.js";
import { timeout } from "./helpers.js";
import { TIMEOUT_SEC } from "./config.js";

export const state = {
    recipe: {},
}

export const loadRecipe = async function(id){
    try{
        const data = await Promise.race([getJSON(id), timeout(TIMEOUT_SEC)]);
        
        let {recipe} = data.data;
          recipe = {
            title : recipe.title,
            id : recipe.id,
            publisher: recipe.publisher,
            imageUrl: recipe.image_url,
            ingrediensts: recipe.ingredients,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            sourceUrl: recipe.source_url,
          }
        
          state.recipe = recipe;
    }
    catch(err){
        console.log(`${err} 🔥🔥🔥🔥`);
        throw err;
    }
}
