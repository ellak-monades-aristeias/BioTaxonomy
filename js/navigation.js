function showArticle(title){
 localStorage.setItem('title',title);
 localStorage.setItem('treePage',$('#tree_container').html());
 window.location.replace('article.html');

}

function showAbout(title){
var currPageUrl = document.location.href;
var currPage = currPageUrl.substr(currPageUrl.lastIndexOf('/') + 1);
if (currPage=='index.html')
 localStorage.setItem('treePage',$('#tree_container').html());
 window.location.replace('about.html');

}

function changeLanguage(){
	console.log("TODO");
}

function search(){
	console.log("TODO");
}