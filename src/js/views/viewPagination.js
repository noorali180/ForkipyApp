import icons from "../../img/icons.svg"; // parcel 1
import icons from "url:../../img/icons.svg"; // parcel 2

import View from "./view.js";

class ViewPagination extends View {
  _parentEl = document.querySelector(".pagination");

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    // 1. on first page, there are other pages
    if (curPage === 1 && numOfPages > 1) {
      return `
                <button data-goto=${
                  curPage + 1
                } class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
    }
    // 2. on last page,
    if (curPage === numOfPages && numOfPages > 1) {
      return `
                <button data-goto=${
                  curPage - 1
                } class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
    }

    // 3. on other page,
    if (curPage > 1 && curPage < numOfPages) {
      return `
                <button data-goto=${
                  curPage - 1
                } class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button data-goto=${
                  curPage + 1
                } class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
    }

    // 4. on first page, there are no other pages,
    return ``;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const target = e.target.closest(".btn--inline");
      if (!target) return;

      const goToPage = +target.dataset.goto;

      handler(goToPage);
    });
  }
}

export const viewPagination = new ViewPagination();
