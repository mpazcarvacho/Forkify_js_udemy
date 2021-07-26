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
    const ingUnique = this._setData();

    console.log(ingUnique);

    //       markup += `<p></p>Recipe is ${this._data.bookmarks[b].title} and ingredient is : ${this._data.bookmarks[b].ingredients[i].description}. Unit: ${this._data.bookmarks[b].ingredients[i].unit}. Qty: ${this._data.bookmarks[b].ingredients[i].quantity}</p>`;

    //   console.log(ingArr);
    //   return markup;
  }

  addHandlerRender(handler) {
    this._btnGroceries.addEventListener('click', handler);
  }

  _setData() {
    // this._data.bookmarks.forEach(b => b.ingredients.forEach((i)=>));
    let markup = '';
    let ingArr = [];
    let unitArr = [];
    let qtyArr = [];
    let imageArr = [];

    //1. Check if there are duplicated elements and if units are the same. If so, add up those quantities. ?should add recipes for which those ing will be for. #TODO
    for (let b = 0; b < this._data.bookmarks.length; b++) {
      for (let i = 0; i < this._data.bookmarks[b].ingredients.length; i++) {
        if (
          ingArr.includes(this._data.bookmarks[b].ingredients[i].description) &&
          unitArr[
            ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
          ] === this._data.bookmarks[b].ingredients[i].unit
        ) {
          // Duplicated element found. Add up qty.
          qtyArr[
            ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
          ] += this._data.bookmarks[b].ingredients[i].quantity;

          //Add recipe image only if they're not the same.
          console.log(
            `${this._data.bookmarks[b].image} ? ${
              imageArr[
                ingArr.indexOf(
                  this._data.bookmarks[b].ingredients[i].description
                )
              ]
            }`
          );

          if (
            this._data.bookmarks[b].image !=
            imageArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ]
          ) {
            console.log('is not equal!');
            imageArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ].push([this._data.bookmarks[b].image]);
          }

          console.log(
            `Duplicated element is ${
              this._data.bookmarks[b].ingredients[i].description
            } at ingArr index ${ingArr.indexOf(
              this._data.bookmarks[b].ingredients[i].description
            )} Qty is: ${
              qtyArr[
                ingArr.indexOf(
                  this._data.bookmarks[b].ingredients[i].description
                )
              ]
            }`
          );
        }
        ingArr.push(this._data.bookmarks[b].ingredients[i].description);
        unitArr.push(this._data.bookmarks[b].ingredients[i].unit);
        qtyArr.push(this._data.bookmarks[b].ingredients[i].quantity);
        imageArr.push([this._data.bookmarks[b].image]);

        console.log(this._data.bookmarks[b].title);
      }
    }
    return [ingArr, unitArr, qtyArr, imageArr];
  }
}

export default new GroceriesView();
