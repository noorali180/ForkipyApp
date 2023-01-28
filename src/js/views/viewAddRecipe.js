// import icons from "../../img/icons.svg"; // parcel 1
import icons from "url:../../img/icons.svg"; // parcel 2

import View from "./view";

class ViewAddRecipe extends View {
  _parentEl = document.querySelector(".upload");
  _message = "recipe added successfully :)";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  _toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerOpenModal() {
    this._btnOpen.addEventListener("click", this._toggleWindow.bind(this));
  }

  _addHandlerCloseModal() {
    this._btnClose.addEventListener("click", this._toggleWindow.bind(this));
    this._overlay.addEventListener("click", this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export const viewAddRecipe = new ViewAddRecipe();
