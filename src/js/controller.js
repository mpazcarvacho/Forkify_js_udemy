import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import navView from './views/navView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import groceriesView from './views/groceriesView.js';

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

    //0 - Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //1 Loading recipe

    //async function which will return a promise
    await model.loadRecipe(id);

    //2 Rendering recipe
    recipeView.render(model.state.recipe);
    //const recipeView = new recipeView(model.state.recipe) This could be done too but the above is cleaner.
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //This is not stored as it doesn't return anything; all it does is to manipulate the state.
    resultsView.renderSpinner();

    //1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 Load search results and save them in to state
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

const controlAddBookmark = function () {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recoipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();

    //Upload new recipe data.
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Render success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change the id in the url. PUsh state allows us to change the url without reloading the page. it akes 3 arguments
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    // addRecipeView.renderError(err.message);
  }
};

const controlSetGroceries = async function () {
  //Get groceries from bookmarks and store them into state.
  await model.setGroceries();
};

const controlGroceries = function () {
  //1. Render Spinner
  groceriesView.renderSpinner();

  //2. Get data from model.state.bookmarks #TODO
  groceriesView.render(model.state.groceries);
};

//Publisher subscriber pattern
const init = function () {
  navView.render();
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHadlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  groceriesView.addHandlerRender(controlSetGroceries);
  groceriesView.addHandlerClick(controlGroceries);
};

init();

//#TODO
// Make every uneven row get another background color #DONE
//Customize checkbox #DONE
//Refactor _SetData method on groceriesView to model. #DONE
// get ingredients first letter to uppercase
//Add delete ingredient button
//Add sorting ingredients alphabetically
// Add button to print / export list to pdf
//make sure bookmark deleted are deleted from local storage (can't remember..)
