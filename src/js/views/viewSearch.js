class ViewSearch {
    #parentEl = document.querySelector('.search');

    #clearInput(){
        this.#parentEl.querySelector('.search__field').value = '';
    }
    
    getQuery(){
        const query = this.#parentEl.querySelector('.search__field').value.toLowerCase();
        this.#clearInput();
        
        return query;
    }

    addHandlerSearch(handler){
        this.#parentEl.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        })
    }
}

export const viewSearch = new ViewSearch();