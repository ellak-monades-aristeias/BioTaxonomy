function showArticle(title){
 sessionStorage.setItem('title',title);
 sessionStorage.setItem('treePage',$('#tree_container').html());
 window.location.replace('article.html');

}

function showAbout(title){
saveTree();
 window.location.replace('about.html');

}

function showIndex(){
saveTree();
 window.location.replace('index.html');

}

function changeLanguage(){
	console.log("TODO");
}

function search(){
	console.log("TODO");
}

function saveTree(){
var currPageUrl = document.location.href;
var currPage = currPageUrl.substr(currPageUrl.lastIndexOf('/') + 1);
if (currPage=='index.html')
 sessionStorage.setItem('treePage',$('#tree_container').html());	
	
}

