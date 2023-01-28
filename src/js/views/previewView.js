import icons from "../../img/icons.svg"; // parcel 1
// import icons from "url:../../img/icons.svg"; // parcel 2

import View from "./view";

class PreviewView extends View {
  // _parentEl = document.querySelector('*');

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `
            <li class="preview">
                <a class="preview__link ${
                  id === this._data.id ? "preview__link--active" : ""
                }" href=#${this._data.id}>
                <figure class="preview__fig">
                    <img src=${this._data.imageUrl} alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">The ${
                      this._data.publisher
                    }</p>
                    <div class="preview__user-generated ${
                      this._data.key ? "" : "hidden"
                    }">
                        <svg>
                            <use href="${icons}.svg#icon-user"></use>
                        </svg>
                    </div>
                </div>
                </a>
            </li>
            `;
  }
}

export const previewView = new PreviewView();
