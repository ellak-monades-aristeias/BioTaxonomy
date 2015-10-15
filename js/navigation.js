function prettyLoadRank(elements,rank,time){
	if(time===undefined){
	var time = 50;
  var timestep=time;
	}
	var fadeInTime=time;
	var i=0;
var count = 0;
if (rank!==undefined){
var timer = $.timer(function() {
 count=count+1;
	$("#" + rank+" .counter").html(" "+count+"/"+elements.length);
});
timer.set({ time : time, autostart : false});
}

	$(elements).each(function() {
		i++;
		var self=$(this);
		 setTimeout( function(){
			 if (rank!==undefined){
			 timer.once();
			 }
			 self.fadeIn(fadeInTime); 
		  
		 }, time);
		 
		
		 
      time += timestep;
	
 });
 	
  return time;
}

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
    getSearchRank("tree");
}

function searchArticle() {
    var queryUrl = articleExistsQuery($('.searchBox').val());
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
		
		//Edw psaxnei to rank
		getSearchRank("article");
        
    } else {
        $('#article').html("Wikipedia article doesn't exist");
    }
}

function articleRankSuccess(_data){
	console.log("in success");
	getGreekName(this.name,"article");
	//Na vriskei kai to onoma tou rank pou prohgeitai tou parontos rank.Sto prohgoumeno rank na lamvanei kai ta onomata ektos apo to count mono
	var values = ['', '', '', '', ''];
  var checkValue = 0;
  //find rank of searched term
  var results = _data.results.bindings[0];
  values[0] = results.countphylum.value;
  values[1] = results.countclass.value;
  values[2] = results.countorder.value;
  values[3] = results.countfamily.value;
  values[4] = results.countgenus.value;
  for (var i in values) {
    if (values[i] != 0) checkValue = values[i];
  }
  
  //Find index of max value, and add 1 to use with rankArray  
  if (checkValue == 0) {
    index = 6; //Search term is species	
  } else {
    maxValue = Math.max.apply(this, values);
    var index = $.inArray(maxValue.toString(), values) + 1;
  }
  
  sessionStorage.setItem('rank',rankArray[index]);
  if (index>0){
  sessionStorage.setItem('prevRank',rankArray[index-1]);
  }
	//var searchTerm = $('#searchBox').val();
        sessionStorage.setItem('name',this.name)
		
	
       
	
}

function getCurrPage() {
    var currPageUrl = document.location.href;
    return currPageUrl.substr(currPageUrl.lastIndexOf('/') + 1);
}

function goBack() {
    //fix to go to index if there is no back
    var currPage = getCurrPage();
    if (currPage == 'article.html') window.location.replace('index.html');
    window.history.back();
}

function loadArticle() {
    if (sessionStorage.getItem('name') !== undefined) {
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
        $('#article').html("No article selected!");
    }
}

