class ViewSearch {
  _parentEl = document.querySelector(".search");

  // function to clear the search input field...
  _clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  // function to get query from DOM...
  /**
   * @returns {String} search query
   */
  getQuery() {
    const query = this._parentEl
      .querySelector(".search__field")
      .value.toLowerCase();
    this._clearInput();

    return query;
  }

  // function: handler function, triggers on submit...
  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export const viewSearch = new ViewSearch();
