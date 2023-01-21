import { getJSON } from "./helpers.js";
import { timeout } from "./helpers.js";
import { API_URL, TIMEOUT_SEC, RES_PER_PAGE } from "./config.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
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
            ingredients: recipe.ingredients,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            sourceUrl: recipe.source_url,
          }
          if(state.bookmarks.some(bookmark => bookmark.id === recipe.id))
            recipe.bookmarked = true;
          else recipe.bookmarked = false;
          
          state.recipe = recipe;
    }
    catch(err){
        console.log(`${err} 🔥🔥🔥🔥`);
        throw err;
    }
}

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;

        const res = await fetch(`${API_URL}?search=${query}`);
        const data = await res.json();

        if(!data.results || !res.ok) {
            throw new Error(`no results found (${res.status})`);
        } 

        let {recipes} = data.data;
        state.search.results = recipes.map(rec => {
            return {
                title : rec.title,
                id : rec.id,
                publisher: rec.publisher,
                imageUrl: rec.image_url,
            };
        });
        state.search.page = 1;
    }
    catch(err){
        console.log(`${err} 🔥🔥🔥🔥`);
        throw err;
    }
}

export const getSearchResultsPerPage = function(page = state.search.page){
    state.search.page = page;
    
    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE;

    const result = state.search.results.slice(start, end);

    return result;
}

export const updateServings = function(newServings){
    const oldServings = state.recipe.servings;
    state.recipe.ingredients.forEach(ing => {
        if(!ing.quantity) return;

        ing.quantity = ing.quantity * newServings / oldServings;
    });

    state.recipe.servings = newServings;
}

export const addBookmark = function(recipe){
    // Add recipe to the bookmarks.
    state.bookmarks.push(recipe);

    // mark recipe as bookmarked.
    if(state.recipe.id === recipe.id) state.recipe.bookmarked = true;
}

export const deleteBookmark = function(id){
    // Remove recipe from the bookmarks.
    const index = state.bookmarks.findIndex(b => b.id === id);
    state.bookmarks.splice(index, 1);

    // mark recipe as not bookmarked.
    if(state.recipe.id === id) state.recipe.bookmarked = false;
}
