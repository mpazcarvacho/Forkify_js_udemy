import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      //Figure out which button was actually clicked
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1)
      return this._generateMarkupButton('next', currentPage);

    // Last page
    if (currentPage === numPages && numPages > 1)
      return this._generateMarkupButton('prev', currentPage);

    // Other page
    if (currentPage < numPages)
      return `${this._generateMarkupButton(
        'next',
        currentPage
      )}${this._generateMarkupButton('prev', currentPage)}`;

    // Page 1, no other pages
    return '';
  }
  _generateMarkupButton(type, currentPage) {
    return `
      <button data-goto="${
        type === 'next' ? currentPage + 1 : currentPage - 1
      }" class="btn--inline pagination__btn--${type}">
        ${type === 'next' ? `<span>Page ${currentPage + 1}</span>` : ''}
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
        </svg>
        ${type === 'prev' ? `<span>Page ${currentPage - 1}</span>` : ''}
      </button>
    `;
  }
}

export default new PaginationView();
