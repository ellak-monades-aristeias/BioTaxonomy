/**
 * Methods used for navigation. 
 *
 * @module Navigation
 */
 
/**
* Saves the tree and loads article page
*
* @class showArticle
* @constructor
*
*/

function showArticle() {
	saveTree();
    window.location.replace('article.html');
}
/**
* Shows about page
*
* @class showAbout
* @constructor
*
*/
function showAbout() {
    saveTree();
    window.location.replace('about.html');
}
/**
* Shows index page
*
* @class showIndex
* @constructor
*
*/
function showIndex() {
    saveTree();
    window.location.replace('index.html');
}
/**
* Starts creation of search tree
*
* @class searchTree
* @constructor
*
*/
function searchTree() {
    //Load function from tree.js to make tree	
    getSearchRank("tree");
}
/**
* Gets value of searchbox and prepares query for article search. 
*
* @class searchArticle
* @constructor
*
*/
function searchArticle() {
    var queryUrl = articleExistsQuery($('.searchBox').val());
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: searchSuccess
    });
}
/**
* Saves the tree on index page
*
* @class saveTree
* @constructor
*
*/
function saveTree() {
    var currPage = getCurrPage();
    if (currPage == 'index.html') sessionStorage.setItem('treePage', $(
        '#tree_container').html());
}

/**
* Returns current page.
*
* @class getCurrPage
* @constructor
*
*/
function getCurrPage() {
    var currPageUrl = document.location.href;
    return currPageUrl.substr(currPageUrl.lastIndexOf('/') + 1);
}
/**
* Goes to previous page
*
* @class goBack
* @constructor
*
*/
function goBack() {
    //fix to go to index if there is no back
    var currPage = getCurrPage();
    if (currPage == 'article.html') window.location.replace('index.html');
    window.history.back();
}

/**
* Animation for pretty loading thumbnails in a rank
*
* @class prettyLoadRank
* @constructor
*
* @param {object} elements Elements to be pretty loaded
* @param {string} rank Rank
* @param {number} time Duration of animation for loading of each element
*/
function prettyLoadRank(elements, rank, time) {
    if (time === undefined) {
        var time = 50;
        var timestep = time;
    }
    var fadeInTime = time;
    var i = 0;
    var count = 0;
    if (rank !== undefined) {
        var timer = $.timer(function() {
            count = count + 1;
            $("#" + rank + " .counter").html(" " + count + "/" + elements.length);
        });
        timer.set({
            time: time,
            autostart: false
        });
    }

    $(elements).each(function() {
        i++;
        var self = $(this);
        setTimeout(function() {
            if (rank !== undefined) {
                timer.once();
            }
            self.fadeIn(fadeInTime);

        }, time);



        time += timestep;

    });

    return time;
}