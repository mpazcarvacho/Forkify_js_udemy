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
    // this._data.bookmarks.forEach(b => b.ingredients.forEach((i)=>));
    let markup = '';

    // console.log(this._data.bookmarks.ingredients[i].description);
    for (let b = 0; b < this._data.bookmarks.length; b++) {
      for (let i = 0; i < this._data.bookmarks[b].ingredients.length; i++) {
        markup += `<p></p>Recipe is ${this._data.bookmarks[b].title} and ingredient is : ${this._data.bookmarks[b].ingredients[i].description}</p>`;
      }
    }

    return markup;

    //add check to prevent duplicated ingredients, get qty sum if so. Add qty and units. Add title of the recipe ingredients are for, maybe the preview image too. #TODO

    // this._data.bookmarks.map(b =>
    //   b.ingredients.map((ing, i, b) => {
    //     return `<h1>${b.title}</h1><p>${ing.description}</p>`;
    //   })
    // );

    // const id = window.location.hash.slice(1);

    // //#TODO style the thing
    // return this._data.bookmarks.map(
    //   b =>
    //     b.ingredients.map(i => {
    //       `<li class="preview">
    //           <a class="preview__link ${
    //             b.id === id ? 'preview__link--active' : ''
    //           }"  href="#${b.id}">
    //           <figure class="preview__fig">
    //             <img src="${b.image}" crossorigin alt="${i.description}" />
    //           </figure>
    //           <div class="preview__data">
    //             <h4 class="preview__title">${i.description}</h4>
    //             <p class="preview__publisher">${b.publisher}</p>
    //             <div class="preview__user-generated ${b.key ? '' : 'hidden'}">
    //               <svg>
    //                 <use href="${icons}#icon-user"></use>
    //               </svg>
    //             </div>
    //           </div>
    //         </a>
    //       </li>`;
    //     })

    // b.ingredients.map(i => `<h1>${i.description}</h1>`)
    // );
  }

  addHandlerRender(handler) {
    this._btnGroceries.addEventListener('click', handler);
  }
}

export default new GroceriesView();
