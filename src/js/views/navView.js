import icons from 'url:../../img/icons.svg';
import cartIcon from 'url:../../img/newIcon.svg';

class NavView {
  #parentElement = document.querySelector('.nav__list');
  #searchIcon = document.querySelector('.search__btn');

  render() {
    this.#searchIcon.innerHTML = `
      <svg class="search__icon">
        <use href="${icons}#icon-search"></use>
      </svg>
      <span>Search</span>
    `;

    console.log(this.#searchIcon);

    this.#parentElement.innerHTML = `
    <li class="nav__item">
      <button class="nav__btn nav__btn--add-recipe">
        <svg class="nav__icon">
          <use href="${icons}#icon-edit"></use>
        </svg>
        <span>Add recipe</span>
      </button>
    </li>
    <li class="nav__item">
      <button class="nav__btn nav__btn--groceries">
        <svg class="nav__icon">
          <use href="${cartIcon}#icon-cart"></use>
        </svg>
        <span>Grocery List</span>
      </button>
    </li>
    <li class="nav__item">
      <button class="nav__btn nav__btn--bookmarks">
        <svg class="nav__icon">
          <use href="${icons}#icon-bookmark"></use>
        </svg>
        <span>Bookmarks</span>
      </button>
      <div class="bookmarks">
        <ul class="bookmarks__list">
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>
              No bookmarks yet. Find a nice recipe and bookmark it :)
            </p>
          </div>
        </ul>
      </div>
    </li>
    `;
  }
}

export default new NavView();
