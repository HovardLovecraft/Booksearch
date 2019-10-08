import 'normalize.css';
import './styles/style.scss';



class SearchEngine {
    constructor (elements){
        this.url = "https://www.googleapis.com/books/v1/volumes?q=";
        this.elements = elements;
        //this.init();
    }

    init(){
        let onKeyPressHandler = this.debounce(this.toSearch.bind(this), 500);
        $(".book-search-input").on("keypress", onKeyPressHandler);   
    }

    toSearch(evt){
        let searchInput = evt.target.value;
        let searchUrl = this.url + searchInput;

        if (searchInput.length < 4) {
            return;
        }

        $.get(searchUrl).done(( data ) => {
            this.render(data);
        });
    }

    render(data){
        let htmlArr = data.items.map((item) => {
            let divContainer = $('<div/>', {
               class: 'container',
            })
    
            let divUpperPart = $('<div/>', {
               class: 'upper-part',
            }).appendTo(divContainer);

            $('<img/>', {
                src: item.volumeInfo.imageLinks.thumbnail,
                title: 'book image',
                alt: item.volumeInfo.title,
                class: 'book-img'
             }).appendTo(divUpperPart);
    
            $('<h2/>', {
               class: 'book-title',
               text: item.volumeInfo.title,
               title: item.volumeInfo.title
            }).appendTo(divUpperPart);

            let divLowerPart = $('<div/>', {
                class: 'lower-part'
            }).appendTo(divContainer);

            $('<p/>', {
                class: 'book-description',
                text: item.volumeInfo.description                
            }).appendTo(divLowerPart);

            return divContainer;
        });

        $('.book-search-result').html(htmlArr);
        console.log(htmlArr);       
    }

    debounce(func, wait) {
        let timeOut;

        return function () {
            let context = this;
            let args = arguments;

            const LATER = function () {
                timeOut = null;
                func.apply(context, args);
            }

            clearTimeout(timeOut);
            timeOut = setTimeout(LATER, wait);
        }
    }
}

const searchEngine = new SearchEngine;
searchEngine.init();


// image path 
// var htmlArr = temp1.items.map((item) => `<img src="${item.volumeInfo.imageLinks.thumbnail}" >`)
//$('.book-search-result').html(htmlArr)

//book title path
//var htmlCol = temp1.items.map((item) => volumeInfo.title)
//$('.book-search-result').html(htmlCol)