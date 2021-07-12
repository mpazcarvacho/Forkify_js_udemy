// import icons from '../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2
import { Fraction } from 'fractional'; //common js way: var Fraction = require('fractional').Fraction
import View from './View.js'; //here the .js is not needed but is good for consistency.

class RecipeView extends View {
  //Private properties. All the views will have these properties in common.
  //Inheritance of protected methods and properties doens't work yet qith Babel and Parcel, apparently. In that case we need to go back to the js convention to protect fields (_)
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We couldn't find that recipe. Plese try another one!`;
  _message = ``;

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" crossorigin alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">

          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">1000</div>
            <div class="recipe__description">
              <span class="recipe__unit">g</span>
              pasta
            </div>
          </li>

        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;

    //USER div icon
    //   <div class="recipe__user-generated">
    //   <svg>
    //     <use href="${icons}#icon-user"></use>
    //   </svg>
    // </div>
  }

  _generateMarkupIngredient(ing) {
    return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ing.quantity
                    ? new Fraction(ing.quantity.toString()) //Issue with fractions e.g. (67/100) should be 1/3
                    : ''
                }</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>`;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      handler();
    });
  }
}

export default new RecipeView();
