import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class GroceriesView extends View {
  _parentElement = document.querySelector('.recipe');
  _btnGroceries = document.querySelector('.nav__btn--groceries');
  _errorMessage =
    'No groceries added yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  _generateMarkup() {
    this._data.bookmarks.forEach(b => {
      console.log(b.ingredients);
    });

    //add check to prevent duplicated ingredients, get qty sum if so. Add qty and units. Add title of the recipe ingredients are for, maybe the preview image too. #TODO

    //#BUG remove groceries list of index

    //#TODO style the thing
    return this._data.bookmarks.map(b =>
      b.ingredients.map(i => `<h1>${i.description}</h1>`)
    );
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
    this._btnGroceries.addEventListener('click', handler);
  }
}

export default new GroceriesView();
