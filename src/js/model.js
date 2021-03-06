import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX, AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  groceries: {},
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //Each ingredient is an object with quantity, unit, description.
  };
};

//Responsible for fetching the recipe data from the forkify API
export const loadRecipe = async function (id) {
  //This function does not return anything, all it will do is to change the state object, which will then contain the recipe and onto which then the controller will then grab and take the recipe out of there. This will work because there is a live connection between the import and the exports.
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err; //error propagated from getJSON and to renderError() method.
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  //read in to the state and get the data for the page that is being requested
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE; //slice doesn't include the last value so it will go to 9 for the first page, which is what we want.

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //new quantity newQt = oldQt * newServings /oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete bookkmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(
      `${API_URL}?search=${recipe.title}&key=${KEY}`,
      recipe
    );

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const setGroceries = async function () {
  //Adds to state a unique ingredients to then be rendered in the GroceriesView

  //Arrays to fill and then add to state.
  let ingArr = [],
    unitArr = [],
    qtyArr = [],
    imageArr = [],
    recipeArr = [],
    idArr = [];

  // Refactor setdata function in groceriesView #TODO
  //Go through every ingredient in every bookmark
  for (let b = 0; b < state.bookmarks.length; b++) {
    for (let i = 0; i < state.bookmarks[b].ingredients.length; i++) {
      const ingDescriptionCur = state.bookmarks[b].ingredients[i].description;
      const unitCur = state.bookmarks[b].ingredients[i].unit;
      const qtyCur = state.bookmarks[b].ingredients[i].quantity;
      const imageCur = state.bookmarks[b].image;
      const recipeTitleCur = state.bookmarks[b].title;
      const idCur = state.bookmarks[b].id;
      const curIndex = ingArr.indexOf(ingDescriptionCur);

      //If ingredient is duplicated and their units arre the same, add their quantities up

      if (ingArr.includes(ingDescriptionCur) && unitArr[curIndex] === unitCur) {
        qtyArr[ingArr.indexOf(ingDescriptionCur)] += qtyCur;

        //Since the ingredient is duplicated, it may come from another recipe. Add recipe image only if they're not the same.
        if (imageCur != imageArr[curIndex]) {
          //Different recipes for equal ingredients. Add new elements to arrays.
          imageArr[ingArr.indexOf(ingDescriptionCur)].push(imageCur);
          recipeArr[ingArr.indexOf(ingDescriptionCur)].push(recipeTitleCur);
          idArr[ingArr.indexOf(ingDescriptionCur)].push(idCur);
        }
      } else {
        //Push unique elements into arrays.
        ingArr.push(ingDescriptionCur);
        unitArr.push(unitCur);
        qtyArr.push(qtyCur);
        imageArr.push([imageCur]);
        recipeArr.push([recipeTitleCur]);
        idArr.push([idCur]);
      }
    }
  }

  //After finigshing looping, set arrays into state.
  const newGroceriesItem = {
    ingredient: ingArr.map(i => {
      return (
        i.split('').splice(0, 1).join('').toUpperCase() +
        i.split('').splice(1).join('')
      );
    }),
    unit: unitArr,
    qty: qtyArr,
    images: imageArr,
    recipeTitles: recipeArr,
    ids: idArr,
  };
  //Set groceries in state
  state.groceries = newGroceriesItem;
  // console.log(state.groceries);
};

export const deleteIngredientsGroceries = function (indexDeleteArray) {
  const groceries = state.groceries;
  const keys = Object.keys(groceries);

  //Remove elements from each array in state.groceries with higher index first
  for (let cbI = indexDeleteArray.length - 1; cbI >= 0; cbI--) {
    keys.forEach(key => groceries[key].splice(indexDeleteArray[cbI], 1));
  }
};
