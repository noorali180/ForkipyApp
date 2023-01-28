// import icons from "../../img/icons.svg"; // parcel 1
import icons from "url:../../img/icons.svg"; // parcel 2

// PARENT CLASS OF ALL VIEWS...
export default class View {
  _data;

  #clear() {
    this._parentEl.innerHTML = "";
  }

  // function to render the generated markup to DOM...
  /**
   * 
   * @param {Object | Object[]} data The data to be rendered in DOM.
   * @param {boolean} [render = true] if not true then only markup will be generated not added in DOM.
   * @returns {undefined | string} return html markup as string.
   * @this {Object} View instance
   * @author Noor Ali
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  // function to render spinner to the DOM...
  renderSpinner = function () {
    const markup = `
            <div class="spinner">
            <svg>
                <use href="${icons}.svg#icon-loader"></use>
            </svg>
            </div>
        `;

    this.#clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  };

  // function, same as render function but only re-renders the changed elements of DOM...
  // note: DOM Updating Algorithm... 
  /**
   * 
   * @param {Object | undefined} data data to be rendered
   */
  update(data) {
    this._data = data;

    // actual/current DOM with previouse values..
    const newMarkup = this._generateMarkup();
    // virtual DOM with updated values...(markupString)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const oldElements = Array.from(this._parentEl.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = oldElements[i];

      // For updating text content...
      if (
        !curEl.isEqualNode(newEl) &&
        curEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // For updating attributes...
      if (!curEl.isEqualNode(newEl)) {
        const attributes = Array.from(newEl.attributes);

        attributes.forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  // function to render success message to the DOM...
  /**
   * Error Message
   * @param {String} message message to be rendered
   */
  renderErrorMessage(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
            <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

    this.#clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  // function to render success message to the DOM...
  /**
   * Success Message
   * @param {String} message message to be rendered
   */
  renderMessage(message = this._message) {
    const markup = `
        <div class="recipe">
            <div class="message">
            <div>
                <svg>
                <use href="${icons}.svg#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

    this.#clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
