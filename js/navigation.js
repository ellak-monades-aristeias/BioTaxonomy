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
    var queryUrl = articleExistsQuery($('#searchBox').val())
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
        console.log("search " + $('#searchBox').val());
        var title = $('#searchBox').val();
        sessionStorage.setItem('title', title);
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

function changeLanguage(lang) {
	$('html').attr('lang',lang);
    var langResources = getLanguageResources()[lang];
	sessionStorage.setItem('lang', lang);
 
    $("span[name='lbl']").each(function (i, elt) {
        $(elt).text(langResources[$(elt).attr("caption")]);
    });
}
 
