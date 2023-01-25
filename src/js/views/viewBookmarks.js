import icons from '../../img/icons.svg'; // parcel 1
import icons from 'url:../../img/icons.svg'; // parcel 2

import { previewView } from './previewView.js';
import View from "./view";

class ViewBookmarks extends View {
    _parentEl = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
    _message = '';

    _generateMarkup(){
        return this._data.map(bookmarks => previewView.render(bookmarks, false)).join(''); /* we dont want to render markup generated by previewView.render() thats why second argument is for rendering the data or not {we need to render data from viewBookmark to get settle the parent element} */
    }

    addHandlerLoad(handler){
        window.addEventListener('load', handler);
    }
}

export const viewBookmarks = new ViewBookmarks();