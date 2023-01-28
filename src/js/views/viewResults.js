import icons from "../../img/icons.svg"; // parcel 1
// import icons from "url:../../img/icons.svg"; // parcel 2

import { previewView } from "./previewView.js";
import View from "./view";

class ViewResults extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again ;)";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((results) => previewView.render(results, false))
      .join(
        ""
      ); /* we dont want to render markup generated by previewView.render() thats why second argument is for rendering the data or not {we need to render data from viewResults to get settle the parent element} */
  }
}

export const viewResults = new ViewResults();

{
  /* <div class="preview__user-generated">
                    <svg>
                        <use href="${icons}.svg#icon-user"></use>
                    </svg>
                    </div> */
}
