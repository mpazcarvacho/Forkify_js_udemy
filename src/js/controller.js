import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; //polyfilling
import 'regenerator-runtime/runtime'; //polyfilling

// parcel code
// if (module.hot) {
//   module.hot.accept();
// }

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

    //3) Render results #DONE
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//Publisher subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
