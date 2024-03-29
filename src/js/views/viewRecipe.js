// import icons from "../../img/icons.svg"; // parcel 1
import icons from "url:../../img/icons.svg"; // parcel 2

// import { Fraction } from "fractional";
import View from "./view.js";

const Fraction = require('@mathematics/fraction');
class ViewRecipe extends View {
  _parentEl = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";
  _message = "";

  // function to generate HTML markup for ingredients (array)...
  #generateRecipeIngredientsMarkup(ing) {
    const fraction = new Fraction(ing.quantity);
    const numerator = fraction._numerator;
    const denominator = fraction._denominator;

    return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ing.quantity ? `${numerator}/${denominator}` : ""
                }</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
                </div>
            </li>
        `;
  }

  // function to generate HTML markup...
  _generateMarkup() {
    return `
            <figure class="recipe__fig">
                <img src="${this._data.imageUrl}" alt="${
      this._data.title
    }" class="recipe__img" />
                <h1 class="recipe__title">
                <span>${this._data.title}</span>
                </h1>
            </figure>
    
            <div class="recipe__details">
                <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}.svg#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  this._data.cookingTime
                }</span>
                <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}.svg#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  this._data.servings
                }</span>
                <span class="recipe__info-text">servings</span>
    
                <div class="recipe__info-buttons">
                    <button class="btn--tiny btn--update-servings" data-upto=${
                      this._data.servings - 1
                    }>
                    <svg>
                        <use href="${icons}.svg#icon-minus-circle"></use>
                    </svg>
                    </button>
                    <button class="btn--tiny btn--update-servings" data-upto=${
                      this._data.servings + 1
                    }>
                    <svg>
                        <use href="${icons}.svg#icon-plus-circle"></use>
                    </svg>
                    </button>
                </div>
                </div>
    
                <div class="recipe__user-generated ${
                  this._data.key ? "" : "hidden"
                }">
                <svg>
                    <use href="${icons}.svg#icon-user"></use>
                </svg>
                </div>
                <button class="btn--round btn--bookmark">
                <svg class="">
                    <use href="${icons}.svg#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
                </svg>
                </button>
            </div>
    
            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                ${this._data.ingredients
                  .map((ing) => this.#generateRecipeIngredientsMarkup(ing))
                  .join("")}
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
                    <use href="${icons}.svg#icon-arrow-right"></use>
                </svg>
                </a>
            </div>
        `;
  }

  // function: handler function, triggers on [hashchange, load]...
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) => {
      window.addEventListener(ev, handler);
    });
  }

  // function: handler function, triggers on click (increase | decrease) servings...
  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener("click", function (e) {
      // target = increase/decrease servings buttons.
      const btn = e.target.closest(".btn--tiny");
      if (!btn) return;

      const newServings = +btn.dataset.upto;

      if (newServings > 0) handler(newServings);
    });
  }

  // function: handler function, triggers on click (add | delete) bookmark...
  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener("click", function (e) {
      // target = bookmark btn on the BTN.
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;

      handler();
    });
  }
}

export const viewRecipe = new ViewRecipe();
