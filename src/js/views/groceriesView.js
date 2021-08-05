import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
import 'table-sort-js/table-sort.js';
import tableSortJs from 'table-sort-js/table-sort.js';

class GroceriesView extends View {
  // _parentElement = document.querySelector('.table2');
  _parentElement = document.querySelector('#table-body');
  // _parentElement = document.querySelector('#groceries-table');
  _btnGroceries = document.querySelector('.nav__btn--groceries');
  _errorMessage =
    'No groceries added yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  _generateMarkup(data) {
    document.querySelector('.groceries').classList.remove('hidden');

    // <table class="table-sort table2">
    let markup = '';

    for (let i = 0; i < data.ingredient.length; i++) {
      markup += `
      
        <tr class="table__rows ${i % 2 === 0 ? 'table__rows_uneven' : ''}">
          <td id="checkbox" class="table__rows_single">
            <label class="orange-checkbox-container">${i + 1}
              <input class="checkbox" type="checkbox" id="cb-${i}" data-index="${i}" name="ingredients"></input>
              <span class="checkmark"></span>
            </label>
          </td>
            
          <td class="table__rows_single">${data.ingredient[i]}</td>
          <td class="table__rows_single">${data.unit[i]}</td>
          <td class="table__rows_single">${data.qty[i] ? data.qty[i] : ''}</td>
          <td class="table__rows_single">
          ${data.images[i].map(image => {
            return `
            <span>
              <a class="table-image__link" href="#${data.ids[i]}">
                <figure class="table-image__fig">
                  <img src="${image}" crossorigin alt="${data.recipeTitles[i]}" />
                </figure></span>
              `;
          })}
          </td>
        </tr>
        
        `;
    }

    // </table>
    return markup;
  }

  updateRender() {
    this._clear();
  }

  addHandlerClick(handler) {
    this._btnGroceries.addEventListener('click', handler);
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerDelete(handler) {
    document.querySelector('#btn-remove-g').addEventListener('click', handler);
  }

  addHandlerPdf(handler) {
    document.querySelector('#btn-pdf-g').addEventListener('click', handler);
  }
}

export default new GroceriesView();
