import 'normalize.css';
import './styles/style.scss';



class SearchEngine {
    constructor (elements){
        this.url = "https://www.googleapis.com/books/v1/volumes?q=";
        this.elements = elements;
        this.startIndex = 0;
        this.shouldScroll = false;
        //this.init();
    };

    init(){
        let onKeyPressHandler = this.debounce(this.toSearch.bind(this), 500);
        $(".book-search-input").on("keypress change", onKeyPressHandler);
        $(".next-results").on("click", () => {
            this.startIndex += 10;
            this.toSearch();
            this.shouldScroll = true;

        })
    };


    toSearch(e){
        let searchInput = e ? e.target.value : this.searchInput;
        this.searchInput = searchInput;
        let searchUrl = this.url + searchInput + `&maxResults=10&startIndex=${this.startIndex}`;

        if (searchInput.length < 4) {
            return;
        }

        $.get(searchUrl).done(( data ) => {
            this.render(data, searchInput);
        });       
    };

    render(data, searchInput){
        let htmlArr = data.items.map((item) => {
            let $divContainer = $('<div/>', {
               class: 'container',
            })
    
            let $divUpperPart = $('<div/>', {
               class: 'upper-part',
            }).appendTo($divContainer);

            $('<img/>', {
                src: item.volumeInfo.imageLinks.thumbnail,
                title: 'book image',
                alt: item.volumeInfo.title,
                class: 'ds'
            }).appendTo($divUpperPart);
            
            let $titleAndAuthor = $('<div/>', {
                class: 'title-and-author',
             }).appendTo($divUpperPart);

            $('<h2/>', {
               class: 'book-title',
               text: item.volumeInfo.title,
               title: item.volumeInfo.title
            }).appendTo($titleAndAuthor);

            $('<p/>', {
                class: 'book-author',
                text: `By ${item.volumeInfo.authors}`,
            }).appendTo($titleAndAuthor);

            let divLowerPart = $('<div/>', {
                class: 'lower-part'
            }).appendTo($divContainer);

            let $showMoreButton;
            let fullDesc = item.volumeInfo.description;
            let shortDesc;
           if(item.volumeInfo.description){               

            if (item.volumeInfo.description.length > 370){
                shortDesc = `${item.volumeInfo.description.slice(0, 370)}...`;
                
                $showMoreButton = $('<button/>', {
                    class: 'call-book-description-modal',
                    text: "show more"                
                });
            }

            let $shortBookDescription = $('<p/>', {
                class: 'short-book-description',
                text: shortDesc
            }).appendTo(divLowerPart);

            let $fullBookDescription = $('<p/>', {
                class: 'full-book-description',
                text: fullDesc
            }).appendTo(divLowerPart);


            $shortBookDescription.append($showMoreButton);

            if ($showMoreButton) {
                $showMoreButton.on("click", this.renderModal.bind(this, $divContainer))
            }
           
           }
           
            return $divContainer;
        });
        
        $(".search-info").html( $('<p/>', {
            class: 'search-results-string',
            text: `Your search are listed below: by your request "${searchInput}" we have found ${data.totalItems} results`               
        }));

        if (data.totalItems > 10){
            $(".next-results").show();
        }       

        if (this.shouldScroll) {
            $("html, body").animate({ scrollTop: 0 }, 600);
        }

        console.log(data)

        $('.book-search-result').html(htmlArr);
        //console.log(htmlArr);       
    };

    renderModal($divContainer){
        let $modal = $("#myModal");
        let $closeButton = $(".close");

        $modal.show();

        $closeButton.on("click", () => {$modal.hide()});

        $(window).on("click", (e) => {
            if (e.target == $modal[0]) {
                $modal.hide();
            }
        });
        console.log($divContainer);
        $modal.find(".modal-content").html($divContainer.clone());

    };

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
