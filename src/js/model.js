import { /*getJSON, sendJSON*/ AJAX } from "./helpers.js";
import { timeout } from "./helpers.js";
import { API_URL, TIMEOUT_SEC, RES_PER_PAGE, KEY } from "./config.js";

// // State to be managed when something loaded from API...
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

// function: to refactor recipe object coming from API...
/**
 *
 * @param {Object} recipe recipe object coming from API, (to be refactored)
 * @returns {Object | undefined} refactored recipe object.
 */
const createRecipeObject = function (recipe) {
  return {
    title: recipe.title,
    id: recipe.id,
    publisher: recipe.publisher,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

// function: function to load recipe from API according to given id.
/**
 *
 * @param {string} id id of recipe to be loaded from api
 */
export const loadRecipe = async function (id) {
  try {
    // making a fetch call to API
    const data = await Promise.race([
      AJAX(`${API_URL}${id}?key=${KEY}`),
      timeout(TIMEOUT_SEC),
    ]);

    // creating a recipe object fetched from API
    let { recipe } = data.data;
    recipe = createRecipeObject(recipe);

    // check if loaded recipe is in bookmarks array already then mark it as bookmark
    if (state.bookmarks.some((bookmark) => bookmark.id === recipe.id))
      recipe.bookmarked = true;
    else recipe.bookmarked = false;

    // update the recipe state
    state.recipe = recipe;
  } catch (err) {
    // if something went wrong on fetching from API then throws an error
    throw err;
  }
};

// function: function to load search results from API according to search query...
/**
 *
 * @param {string} query search query for a recipe
 * @returns {Object[]} array of objects as search results
 */
export const loadSearchResults = async function (query) {
  try {
    // update the search state, (set query)
    state.search.query = query;

    // making a fetch call to API
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // maping over search results fetched from API, and updating the search.results state.
    let { recipes } = data.data;
    // refactoring the object array, according to search view
    state.search.results = recipes.map((recipe) => {
      return {
        title: recipe.title,
        id: recipe.id,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        // if recipe contains a key (user generated), then update the state, else short circuit
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // set search.page initial value
    state.search.page = 1;
  } catch (err) {
    // if something went wrong on fetching from API then throws an error
    throw err;
  }
};

// function: function to upload a user generated recipe to API...
/**
 *
 * @param {Object | null} newRecipe user generated recipe
 */
export const uploadNewRecipe = async function (newRecipe) {
  try {
    // extracting the ingredients from new recipe and refactoring in the format that would suitable to be uploaded on API. e.g. ingredients[{quantity, unit, description}]
    const ingredients = Object.entries(newRecipe)
      .filter((ing) => ing[0].startsWith("ingredient") && ing[1] !== "")
      .map((ing) => {
        const ingredientsArr = ing[1].replaceAll(" ", "").split(",");
        const [quantity, unit, description] = ingredientsArr;

        // gurad clause to check if ingredients are in correct format or not
        if (ingredientsArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! please use the correct format :)"
          );

        return {
          // if quantity of ingredient don't exist return null
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    // refactor the recipe object to be uploaded on API
    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // uploading new recipe to API with an unique key (generated from API)
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data.data.recipe);

    // bookmark the recipe.
    addBookmark(state.recipe);
  } catch (err) {
    // if something went wrong on fetching from API then throws an error
    throw err;
  }
};

// function: function to break search results (loaded from API) into pages (RES_PER_PAGE = 10 items per page.)...
/**
 *
 * @param {number} [page = 1] page number
 * @returns {Object[]} array of broke results
 */
export const getSearchResultsPerPage = function (page = state.search.page) {
  // update search.page state as given parameter
  state.search.page = page;

  // specifying start position of results array from which current page should start
  const start = (page - 1) * RES_PER_PAGE;
  // specifying end position of results array at which current page should end
  const end = page * RES_PER_PAGE;

  // extracting results per page
  const result = state.search.results.slice(start, end);

  return result;
};

// function: function to update servings of current recipe...
/**
 *
 * @param {number} newServings updated servings (user requirement)
 */
export const updateServings = function (newServings) {
  const oldServings = state.recipe.servings;

  // iterating over ingredients of current recipe to update their quantity attribute
  state.recipe.ingredients.forEach((ing) => {
    // if quantity does'nt exist the return immediately
    if (!ing.quantity) return;

    // updating ingredients quantity as of new servings
    ing.quantity = (ing.quantity * newServings) / oldServings;
  });

  // updating new servings to recipe state
  state.recipe.servings = newServings;
};

// function: function to add bookmarks on local storage...
const setLocalStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

// function: function to add recipes to bookmarks[]...
/**
 *
 * @param {Object} recipe recipe object to be bookmarked
 */
export const addBookmark = function (recipe) {
  // Add current recipe to the bookmarks[]
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  // update bookmarks to local storage
  setLocalStorage();
};

// function: function to delete bookmark from bookmarks[] (of given id of recipe)...
export const deleteBookmark = function (id) {
  // Remove current recipe from the bookmarks
  const index = state.bookmarks.findIndex((b) => b.id === id);
  state.bookmarks.splice(index, 1);

  // mark recipe as not bookmarked
  if (state.recipe.id === id) state.recipe.bookmarked = false;

  // update bookmarks to local storage
  setLocalStorage();
};

// function: function to get bookmarks from local storage and update bookmarks[]...
const getBookmarksFromLocalStorage = function () {
  const storage = JSON.parse(localStorage.getItem("bookmarks"));

  if (!storage) return;

  // update bookmarks[]
  state.bookmarks = storage;
};
// note: this function must be executed when page loades...
getBookmarksFromLocalStorage();
