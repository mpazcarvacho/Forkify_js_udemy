import icons from 'url:../../img/icons.svg';
import cartIcon from 'url:../../img/newIcon.svg';

class NavView {
  #searchIcon = document.querySelector('.search__btn');
  #editIcon = document.querySelector('#icon-edit');
  #cartIcon = document.querySelector('#icon-cart');
  #bookmarkIcon = document.querySelector('#icon-bookmark');
  #smileIcon = document.querySelector('#icon-smile');

  render() {
    this.#searchIcon.innerHTML = `
      <svg class="search__icon">
        <use href="${icons}#icon-search"></use>
      </svg>
      <span>Search</span>
    `;

    this.#editIcon.innerHTML = `<use href="${icons}#icon-edit"></use>`;
    this.#cartIcon.innerHTML = `<use href="${cartIcon}#icon-cart"></use>`;
    this.#bookmarkIcon.innerHTML = `<use href="${icons}#icon-bookmark"></use>`;
    this.#smileIcon.innerHTML = `<use href="${icons}#icon-smile"></use>`;
  }
}

export default new NavView();
