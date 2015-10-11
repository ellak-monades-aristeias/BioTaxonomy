function showArticle(title) {
    sessionStorage.setItem('treePage', $('#tree_container').html());
    window.location.replace('article.html');
}

function showAbout(title) {
    saveTree();
    window.location.replace('about.html');
}

function showIndex() {
    saveTree();
    window.location.replace('index.html');
}

function searchTree() {
    //Load function from tree.js to make tree	
    makeSearchTree();
}

function searchArticle() {
    var queryUrl = articleExistsQuery($('.searchBox').val())
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: searchSuccess
    });
}

function saveTree() {
    var currPage = getCurrPage();
    if (currPage == 'index.html') sessionStorage.setItem('treePage', $(
        '#tree_container').html());
}

function searchSuccess(_data) {
    var results = _data.query.pages;
    for (var i in results) {}
    if (i > 0) {
        var searchTerm = $('#searchBox').val();
        sessionStorage.setItem('name', searchTerm);
        window.location.replace('article.html');
    } else {
        $('#article').html("Wikipedia article doesn't exist")
    }
}

function getCurrPage() {
    var currPageUrl = document.location.href;
    return currPage = currPageUrl.substr(currPageUrl.lastIndexOf('/') + 1);
}

function goBack() {
    //fix to go to index if there is no back
    var currPage = getCurrPage();
    if (currPage == 'article.html') window.location.replace('index.html');
    window.history.back();
}

function loadArticle() {
    if (sessionStorage.getItem('name') != undefined) {
        if (sessionStorage.getItem('lang') == 'gr' && sessionStorage.getItem(
            'name') != sessionStorage.getItem('greekName')) {
            $('#title').html(sessionStorage.getItem('greekName'));
            $('#wikiLink').attr('href', 'https://el.wikipedia.org/wiki/' +
                (sessionStorage.getItem('greekName')).replace(' ', '_')
            );
            $('#article').wikiblurb({
                wikiURL: "http://el.wikipedia.org/",
                section: 0,
                page: sessionStorage.getItem('greekName'),
            });
        } else {
            $('#title').html(sessionStorage.getItem('name'));
            $('#wikiLink').attr('href', 'https://en.wikipedia.org/wiki/' +
                (sessionStorage.getItem('name')).replace(' ', '_'));
            $('#article').wikiblurb({
                section: 0,
                page: sessionStorage.getItem('name'),
            });
        }
    } else {
        $('#article').html("No article selected!")
    }
}