import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class GroceriesView extends View {
  _parentElement = document.querySelector('.recipe');
  _btnGroceries = document.querySelector('.nav__btn--groceries');
  _errorMessage =
    'No groceries added yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  _generateMarkupIngs(ingUnique) {
    let markup = '';

    //#TODO
    // Make every uneven row get another background color #DONE
    //Customize checkbox #DONE
    // get ingredients first letter to uppercase
    //Add delete ingredient button
    //Add sorting ingredients alphabetically
    // Add button to print / export list to pdf
    //make sure bookmark deleted are deleted from local storage (can't remember..)

    for (let i = 0; i < ingUnique[0].length; i++) {
      markup += `
        <tr class="table__rows ${i % 2 === 0 ? 'table__rows_uneven' : ''}">
        <td id="checkbox" class="table__rows_single">
          <label class="orange-checkbox-container">${i + 1}
            <input class="checkbox" type="checkbox" id="cb-${i}" name="ingredients"></input>
            <span class="checkmark"></span>
          </label>
          </td>
          
          <td class="table__rows_single">${ingUnique[0][i]}</td>
          <td class="table__rows_single">${ingUnique[1][i]}</td>
          <td class="table__rows_single">${
            ingUnique[2][i] ? ingUnique[2][i] : ''
          }</td>
          <td class="table__rows_single">
          ${ingUnique[3][i].map(image => {
            return `
            <span>
              <a class="table-image__link" href="#${ingUnique[5][i]}">
                <figure class="table-image__fig">
                  <img src="${image}" crossorigin alt="${ingUnique[4][i]}" />
                </figure></span>
              `;
          })}
          </td>
        </tr>
        `;
    }

    // <td>${i + 1}</td>
    return markup;
  }
  _generateMarkup() {
    const ingUnique = this._setData();
    this._generateMarkupIngs(ingUnique);

    // console.log(ingUnique);

    const markup = `
      <table class= "table">
        <thead class="table__head">
          <tr class="table__header">
            <th class= "table__header__col">#</th>
            <th class= "table__header__col">Ingredient</th>
            <th class= "table__header__col">Unit</th>
            <th class= "table__header__col">Qty</th>
            <th class= "table__header__col">Recipes</th>
          </tr>
        </thead>
        <tbody>
          ${this._generateMarkupIngs(ingUnique)}
        </tbody>
      </table>
    
    `;

    return markup;
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
    let recipeArr = [];
    let idArr = [];

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
          // console.log(
          //   `${this._data.bookmarks[b].image} ? ${
          //     imageArr[
          //       ingArr.indexOf(
          //         this._data.bookmarks[b].ingredients[i].description
          //       )
          //     ]
          //   }`
          // );

          if (
            this._data.bookmarks[b].image !=
            imageArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ]
          ) {
            //different recipes for equal ingredients.
            // console.log('is not equal!');
            imageArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ].push([this._data.bookmarks[b].image]);

            recipeArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ].push([this._data.bookmarks[b].title]);

            idArr[
              ingArr.indexOf(this._data.bookmarks[b].ingredients[i].description)
            ].push([this._data.bookmarks[b].id]);
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
        } else {
          ingArr.push(this._data.bookmarks[b].ingredients[i].description);
          unitArr.push(this._data.bookmarks[b].ingredients[i].unit);
          qtyArr.push(this._data.bookmarks[b].ingredients[i].quantity);
          imageArr.push([this._data.bookmarks[b].image]);
          recipeArr.push([this._data.bookmarks[b].title]);
          idArr.push([this._data.bookmarks[b].id]);
        }

        // console.log(this._data.bookmarks[b].title);
      }
    }
    return [ingArr, unitArr, qtyArr, imageArr, recipeArr, idArr];
  }
}

export default new GroceriesView();
