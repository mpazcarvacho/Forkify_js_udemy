import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

//Responsible for fetching the recipe data from the forkify API
export const loadRecipe = async function (id) {
  //This function does not return anything, all it will do is to change the state object, which will then contain the recipe and onto which then the controller will then grab and take the recipe out of there. This will work because there is a live connection between the import and the exports.
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // console.log(state.recipe, data);
  } catch (err) {
    throw err; //error propagated from getJSON and to renderError() method.
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
    console.error(`${err} in searching`);
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  //read in to the state and get the data for the page that is being requested
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE; //slice doesn't include the last value so it will go to 9 for the first page, which is what we want.

  return state.search.results.slice(start, end);
};
