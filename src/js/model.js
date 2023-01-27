import { getJSON, sendJSON } from "./helpers.js";
import { timeout } from "./helpers.js";
import { API_URL, TIMEOUT_SEC, RES_PER_PAGE, KEY } from "./config.js";

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

const createRecipeObject = function(recipe){
    return {
        title : recipe.title,
        id : recipe.id,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        ingredients: recipe.ingredients,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        sourceUrl: recipe.source_url,
        ...(recipe.key && {key : recipe.key})
    }
}

export const loadRecipe = async function(id){
    try{
        const data = await Promise.race([getJSON(`${API_URL}${id}`), timeout(TIMEOUT_SEC)]);
        
        let {recipe} = data.data;
          recipe = createRecipeObject(recipe);

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

export const uploadNewRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '').map(ing => {
            const ingredientsArr = ing[1].replaceAll(' ', '').split(',');
            const [quantity, unit, description] = ingredientsArr;
            console.log(ingredientsArr);
            
            if(ingredientsArr.length !== 3) throw new Error('Wrong ingredient format! please use the correct format :)');

            return {
                quantity : quantity ? +quantity : null,
                unit,
                description
            }
        });

        const recipe = {
            title: newRecipe.title,
            image_url: newRecipe.image,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data.data.recipe);

        // bookmark the recipe.
        addBookmark(state.recipe);
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

const setLocalStorage = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    // Add recipe to the bookmarks.
    state.bookmarks.push(recipe);

    // mark recipe as bookmarked.
    if(state.recipe.id === recipe.id) state.recipe.bookmarked = true;

    setLocalStorage();
}

export const deleteBookmark = function(id){
    // Remove recipe from the bookmarks.
    const index = state.bookmarks.findIndex(b => b.id === id);
    state.bookmarks.splice(index, 1);

    // mark recipe as not bookmarked.
    if(state.recipe.id === id) state.recipe.bookmarked = false;

    setLocalStorage();
}


const getBookmarksFromLocalStorage = function(){
    const storage =  JSON.parse(localStorage.getItem('bookmarks'));

    if(!storage) return;

    state.bookmarks = storage;
}
getBookmarksFromLocalStorage();
