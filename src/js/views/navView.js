import icons from 'url:../../img/icons.svg';

class NavView {
  #parentElement = document.querySelector('.nav__list');
  #searchIcon = document.querySelector('.search__icon');

  render() {
    this.#searchIcon.innerHTML = `
    <use href="${icons}"#icon-search"></use>
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
