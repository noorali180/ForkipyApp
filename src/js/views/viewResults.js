import icons from '../../img/icons.svg'; // parcel 1
import icons from 'url:../../img/icons.svg'; // parcel 2

import View from "./view";

class ViewResults extends View {
    _parentEl = document.querySelector('.results');

    _generateMarkup(){
        return this._data.map(res => {
            return `
            <li class="preview">
                <a class="preview__link preview__link--active" href=#${res.id}>
                <figure class="preview__fig">
                    <img src=${res.imageUrl} alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${res.title}</h4>
                    <p class="preview__publisher">The ${res.publisher}</p>
                    <div class="preview__user-generated">
                    <svg>
                        <use href="${icons}.svg#icon-user"></use>
                    </svg>
                    </div>
                </div>
                </a>
            </li>
            `;
        }).join();
    }
}

export const viewResults = new ViewResults();
