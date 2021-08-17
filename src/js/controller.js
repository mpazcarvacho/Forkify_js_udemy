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

  //3 Add event listeners to buttons
  groceriesView.addHandlerDelete(controlDeleteGroceries);
  groceriesView.addHandlerPdf(controlPdfGroceries);
};

const controlDeleteGroceries = function () {
  //1 - Check if there any rows selected to delete (checkboxes)
  //rows not selected, display message "you need to select ingredients blabla"
  // document.querySelectorAll();
  //rows selected, delete from ingredients in model.
  //Render groceries list again
  const checkboxes = document.querySelectorAll('.checkbox');

  const deleteData = [];
  checkboxes.forEach(c => {
    // console.log(c.dataset.index);
    // console.log(c.id);
    return c.checked ? deleteData.push(c.dataset.index) : '';
  });

  // console.log(deleteData);

  model.deleteIngredientsGroceries(deleteData);
  // console.log(document.querySelectorAll('#btn-remove-g'));
  // console.log(document.querySelectorAll('.checkbox'));

  groceriesView.updateRender();
  controlGroceries();
};

const controlPdfGroceries = async function () {
  //Create pdf with groceries list using html2pdf.

  const doc = document.getElementById('pdf');
  const docClone = doc.cloneNode(true);
  docClone.style.height = 'max-content';

  html2pdf().from(docClone).save();
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
// get ingredients first letter to uppercase #DONE
//Make table scrollable #DONE
//Change table header background, avoid transparency #DONE

//Add data attribute to checkboxes with index value. #DONE
//Add delete ingredient button #DONE

//Add sorting ingredients alphabetically #DONE
// Add button to print / export list to pdf
//make sure bookmark deleted are deleted from local storage (can't remember..)
//Add dading in transition to groceries list
//highlight row when hovering them
//make forkify logo take you home
