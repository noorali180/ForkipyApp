class ViewSearch {
    _parentEl = document.querySelector('.search');

    _clearInput(){
        this._parentEl.querySelector('.search__field').value = '';
    }
    
    getQuery(){
        const query = this._parentEl.querySelector('.search__field').value.toLowerCase();
        this._clearInput();
        
        return query;
    }

    addHandlerSearch(handler){
        this._parentEl.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        })
    }
}

export const viewSearch = new ViewSearch();
