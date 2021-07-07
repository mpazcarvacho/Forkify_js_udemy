import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable'; //polyfilling
import 'regenerator-runtime/runtime'; //polyfilling

//parcel code
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //1 Loading recipe

    //async function which will return a promise
    await model.loadRecipe(id);

    //2 Rendering recipe
    recipeView.render(model.state.recipe);
    //const recipeView = new recipeView(model.state.recipe) This could be done too but the above is cleaner.
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //This is not stored as it doesn't return anything; all it does is to manipulate the state.
    resultsView.renderSpinner();

    //1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 Load search results
    await model.loadSearchResults(query);

    //3) Render results #TODO
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};
//Publisher subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
