/* tree.js - Functions for index.html that handle tree creation*/
/*Functions that handle details and important taxon members*/
$(document).on("click", ".details", function() {
  var name = getName($(this)); //Get name of node that was clicked

  getGreekName(name,"index");//Finds greek name and stores in sessionStorage
  
  var rank = getRank($(this));
  var img_url = $(this).closest('.thumbnail').find('img').attr('data-src');
  img_url = getImg300(img_url);
  
  sessionStorage.setItem('name', name);
  sessionStorage.setItem('rank', rank);
  
  
  $(".modal-title").text(name);
  $(".article").attr('onclick', 'showArticle("' + name + '")');
  $('#modalThumb img').hide();
  $('#modalThumb img').attr('src', img_url);
  time = prettyLoadRank($('#modalThumb img'), 'null', 900);
  $('#membersList').html(''); //Clear memberlist data
  startLoading('#modalSum');
  var query = getSummaryQuery(name);
  $.ajax({
    dataType: "jsonp",
    url: query,
    rank: rank,
    img_url: img_url,
    name: name,
    success: summarySuccess,
    error: ajaxError
  });
});

function summarySuccess(_data) {
  var results = _data.query.pages;
  for (var j in results) {
	  if (results[j].extract!==undefined){
    var sum = results[j].extract;
	
    if (sum.length > 1000) sum = sum.substr(0, 1000) + '...';
  }else{
	var sum='<span name="lbl" caption="noSummary"></span>';  
	  
  }
  }
  stopLoading('#modalSum');
  $('#modalSum').hide();
  $('#modalSum').html(sum);
  var time = prettyLoadRank($('#modalSum'), 'null', 700);
  startLoading('#membersList');
  getMembers(this.rank, this.name,"index");
}

function getMembers(rank, name,page) {
if(page=="index"){
var success=importantMembersSuccess;
}else{
var success=membersSuccess;
}
  var query = getImportantQuery(rank, name.replace(' ', "_"));
 
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    dataType: "jsonp",
    url: queryUrl,
  
    success: success,
    error: ajaxError,
  });
}


function membersSuccess(_data){
  animals_html = "";
   
    var dbpedia_results = _data.results.bindings;
 
    for (var i in dbpedia_results) { //pass all dbpedia results in array for easier understanding
      var src = dbpedia_results[i].name.value;
      var name = nameFromUrl(src);
   thumb_url=getThumbUrl(dbpedia_results[i].thumb);
        
      
          animals_html = animals_html + " <li> <div class='thumbnail'><img src='assets/Timer.gif' data-src='" + thumb_url + "'width='50px' > <div class='caption'><p caption='" + name + "'>" + name + "</p></div></div></li>";
      }
    
    
    $('#membersList').html(animals_html);
    $("#membersList .thumbnail").hide();
    var $thumbnails = $("#membersList .thumbnail");
    var time2 = $thumbnails.length * 250;
    setTimeout(function() {
      var time = prettyLoadRank($thumbnails, 'null', 250);
       $("img").unveil();
    }, 800)
    changeLanguage(sessionStorage.getItem('lang'),'#membersList');
       $("img").unveil();
  
  }
  
  /*End of details functions*/

function importantMembersSuccess(_data) {
    animals_html = "";
    var k = 0;
    var dbArray = [];
    var dbpedia_results = _data.results.bindings;
    
    var wikirankResults = [wikirank0, wikirank1, wikirank2, wikirank3,
      wikirank4, wikirank5, wikirank6, wikirank7, wikirank8,
      wikirank9
    ]
    for (var j in dbpedia_results) { //pass all dbpedia results in array for easier understanding
      var src = dbpedia_results[j].name.value;
      var name = nameFromUrl(src);
      dbArray[j] = name;
    }
    if(dbArray.length<=8){ //Skip the wikirank part if rank has 8 or fewer members
      for (var i in dbArray) {
        thumb_url=getThumbUrl(dbpedia_results[i].thumb);
        src = dbArray[i];
         animals_html = animals_html + getMemberHtml(thumb_url,src);
      }
    }else{
    
    for (var i in wikirankResults) { //Traverse wikirank data, compare each element to dbpedia results and if it exists add to animal list
      var wikiArray = wikirankResults[i].split(',');
      for (var j in wikiArray) {
        src = wikiArray[j];
        if ($.inArray(src, dbArray) > -1) {
          k++;
		  var thumb_url=getThumbUrl(dbpedia_results[$.inArray(src, dbArray)].thumb);
          animals_html = animals_html + getMemberHtml(thumb_url,src);
        }
        if (k > 7) break;
      }
      if (k > 7) break;
    }
    }
    stopLoading('#membersList');
    $('#membersList').html(animals_html);
    $("#membersList .thumbnail").hide();
    var $thumbnails = $("#membersList .thumbnail");
    var time2 = $thumbnails.length * 250;
    setTimeout(function() {
      var time = prettyLoadRank($thumbnails, 'null', 250);
       $("img").unveil();
    }, 800)
 changeLanguage(sessionStorage.getItem('lang'),'#myModal');
    
     $("img").unveil();
  }
  /*End of details functions*/
  /*Functions that make the tree*/
$(document).on("click", ".open", function() {
  $('button').prop('disabled', true);
  var name = getName($(this));
  sessionStorage.setItem('prevRankName', name);
  //name.replace(/ /g,"_");
  var rank = getRank($(this));
  selectRank($(this), rank); //Make clicked node selected
  var next_rank = getNextRank(rank); //get the next rank
  clearNextRanks(rank); //Clear data of next ranks
  startLoading('#' + next_rank + '>div');
  var query = getOpenQuery(name, rank, next_rank);
  
  executeOpenQuery(query, next_rank, "open");
  //}
});



  /*Functions that make the tree*/


function executeOpenQuery(query, rank, func, selectedName) {

  if (selectedName === undefined) {
    selectedName = '';
  }
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: queryUrl,
    rank: rank,
    selectedName: selectedName,
    success: openSuccess,
    func: func,
    error: ajaxError
  });
}

function openSuccess(_data) {
	
	var item='';
    var thumb_url = "";
    var rank = this.rank;
    var results = _data.results.bindings;
    if (results.length > 0) { //if there are any results
      for (var i in results) {
        
		var src = results[i].taxon.value;
		
        var name = nameFromUrl(src);
        var html = thumbHtml(name, results[i].thumb, rank, this.selectedName);
        var item =item+ html;
     
        
        stopLoading('#' + rank + '>div');
       
      }
	  $(item).hide();
	  
	     $("#" + rank).append(item);
		
        var contents = $("#" + rank + " .selected").detach();
        $('#' + rank + ">.rankHead").after(contents);
		
      var $thumbnails = $("#" + rank + " .thumbnail");
      var time = prettyLoadRank($thumbnails, rank);
      
        
        setTimeout(function() {
	   
        $("#" + rank + " .counter").html(" " + $thumbnails.length);
        $thumbnails.show();
		$('.thumbnail>button').prop('disabled', true);
        sessionStorage.setItem('treePage', $('#tree_container').html());
      
     
  $("img").unveil();

      }, time + 100)
     
    } else {
      stopLoading('#' + rank + '>div');
     
      if (this.func == "open") {
        $("#" + rank).append('<span name="lbl" caption="noResults"></span>');
      }
    }
     $('button').prop('disabled', false);
    ChangeDiv($(window).width()); //Does changes related to screen size
    changeLanguage(sessionStorage.getItem('lang'),"#"+rank); //does text translation for selected language
  }
  /* Functions that make the Search Tree*/

function getSearchRank(func) {
	
  //TODO-αν το search term ειναι στα ελληνικά να το μεταφράζει. Έχω ετοιμάσει το query στο  returnOneEnglishNameQuery(name)
  $('button').prop('disabled', true);
  //An einai plant h Animal na paravlepetai to query
  if(func=="article"){
	  
	  var callback=articleRankSuccess;
  }else{
	 var callback=makeSearchTree;  
  }
  var name = $('#searchBox').val();
  if (name == '') {
    name = $('#searchBoxMobile').val();
  }
  name = name.replace(' ', "_");
  name = capitalizeFirstLetter(name);
  
  var query = getSearchRankQuery(name);
 
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    dataType: "jsonp",
    url: queryUrl,
    name: name,
    success: callback,
    error: ajaxError
  });
}

function makeSearchTree(_data) {
  var values = ['', '', '', '', '']
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

  var query = getSearchQuery(this.name, rankArray[index]);
  
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    dataType: "jsonp",
    url: queryUrl,
    index: index,
    name: this.name,
    success: makeSearchTreeSuccess,
    error: ajaxError
  });
}

function makeSearchTreeSuccess(_data) {
    var name = this.name;
    clearNextRanks("kingdom"); //Clear data of all ranks
    var values = ['', '', '', '', '', '', ''];
    var kingdomType = '';
    var results = _data.results.bindings;
  
    for (var i in results) {
	values[0]=getSearchRankName(results[i].kingdom,results[i].countkingdom);
	values[1]=getSearchRankName(results[i].phylum,results[i].countphylum);
	values[2]=getSearchRankName(results[i].classis,results[i].countclassis);
	values[3]=getSearchRankName(results[i].order,results[i].countorder);
	values[4]=getSearchRankName(results[i].family,results[i].countfamily);
	values[5]=getSearchRankName(results[i].genus,results[i].countgenus);
    }

    if (values[0] == 'Animal' || values[0] == 'Animalia') values[0] = "Animal";
    if (values[0] == 'Plant' || values[0] == 'Plantae') values[0] = "Plant";
    if (values[0] == 'Animal' || values[0] == 'Plant') { //Only make tree if kingdom is plant or animal
      //TODO add species 
      for (i = 0; i < this.index; i++) {
        var query = getOpenQuery(values[i], rankArray[i], rankArray[i + 1]);
        console.log(query);
        startLoading('#' + rankArray[i + 1] + '>div');
        if (values[i + 1] == '') {
          values[i + 1] = name;
        }
        executeOpenQuery(query, rankArray[i + 1], "tree", values[i + 1]);
      }
      selectRank($('p[caption="' + values[0] + '"]'), rankArray[0]);
    }
    
    $('button').prop('disabled', false);
      
  }
  /*End of tree functions*/
  /*Helper functions*/

function thumbHtml(name, thumb, rank, selectedName) {
	  thumb_url=getThumbUrl(thumb);
	  
  if (selectedName == name) {
    select = "selected";
  } else {
    select = "";
  }
  if (rank != "species") {
    return '   <div class="thumbnail clearfix ' + select + '">' + '<img class="img-rounded" src="assets/Timer.gif" data-src=\"' + thumb_url + '\" alt=\"...\"><div class=\"caption\">' + '<p caption=\"' + name + '\"></p>' + '<div class="btn-group" role="group" aria-label="..."> <button name="lbl" caption="details" class="btn btn-info details"data-target="#myModal" data-toggle="modal" type="button"></button>  <button type="button"class="btn btn-default open "><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button></div>' + '</div>   ' + '</div>';
  } else {
    return '   <div class=\"thumbnail clearfix ' + select + '">' + '<img class="img-rounded" src="assets/Timer.gif" data-src=\"' + thumb_url + '\" alt=\"...\">' + '<div class=\"caption\"><p caption="' + name + '">' + '</p> <button name="lbl" caption="details" class="btn btn-info details" data-target="#myModal" data-toggle="modal"type="button"></button>' + '</div>   ' + '</div>';
  }
}

function clearNextRanks(rank) {
  var rank_index = rankArray.indexOf(rank);
  for (i = rank_index + 1; i < rankArray.length; i++) {
   $("#" + rankArray[i] + '>.thumbnail').remove(); //remove thumbnail divs
    $("#" + rankArray[i] + '>span').remove(); //remove spans with text 
    contents = $("#" + rankArray[i]).detach();
    $("#" + rankArray[i - 1]).after(contents);
    $("#" + rankArray[i] + ' .counter').html("");
  }
}

function getThumbUrl(thumb){
	if (thumb === undefined) { //replace with placeholder image if image doesn't exist
          return "assets/no_img_thumb.jpg"
        } else {
          return shrinkImg200(thumb.value);
        }
}
function getName(obj) {
  return obj.closest('.thumbnail').find('.caption>p[caption]').attr('caption');
}



function getRank(obj) {
	if ($(window).width() <= 480) {
    var rank = obj.parents('div:eq(1)').attr('id');
  } else {
    var rank = obj.parents('div:eq(3)').attr('id');
  }
  return rank;
}


function getMemberHtml(thumb_url,src){
	return " <li> <div class='thumbnail'><img src='" + thumb_url + "'  data-src='" + thumb_url + "'width='50px' > <div class='caption'><p caption='" + src + "'>" + src + "</p></div></div></li>";
}
function selectRank(button, rank) {
  var selected = button.closest('.thumbnail');
  
  $('#' + rank + ' .thumbnail').removeClass('selected');
  selected.addClass('selected');
  //selected.insertAfter($('#' + rank + '>.rankHead')); //TODO return to original position when unselected
}

function startLoading(container) {
 // $(container).after("<span><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...</span>");
 $(container).after("<span><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...</span>");
}

function stopLoading(container) {
  $(container).next("span").remove();
}

function shrinkImg200(thumb_url) {
  var shrinkedImg = thumb_url.replace('width=300', 'width=150');
  return shrinkedImg;
}

function getImg300(thumb_url) {
  var bigImg = thumb_url.replace('width=150', 'width=300');
  return bigImg;
}

function hideShowDivs() {
  for (i = 1; i < rankArray.length; i++) {
    if ($('#' + rankArray[i] + '>*').length == 1) {
      $('#' + rankArray[i]).hide();
    } else {
      $('#' + rankArray[i]).show();
    }
  }
}

function showAllDivs() {
  for (i = 1; i < rankArray.length; i++) {
    $('#' + rankArray[i]).show();
  }
}

function divsForMobile() {
  for (i = 0; i < rankArray.length - 1; i++) {
    if ($('#' + rankArray[i]).find('.selected').length) {
      var contents = $('#' + rankArray[i + 1]).detach();
      $('#' + rankArray[i]).find('.selected').after(contents);
    }
  }
}

function normalDivs() {
  for (i = 0; i < rankArray.length - 1; i++) {
    var contents = $('#' + rankArray[i + 1]).detach();
    $('#' + rankArray[i]).after(contents);
  }
}

function ChangeDiv(width) {
  if (width <= 480) {
    //put img in button
    $(".col-sm-1>.thumbnail>img").wrap('<button class="btn btn-info details" data-target="#myModal" data-toggle="modal" type="button"> </button>');
    $(".glyphicon-menu-right").addClass("glyphicon-plus-sign");
    $(".glyphicon-menu-right").removeClass("glyphicon-menu-right");
    divsForMobile();
    hideShowDivs();
  } else {
    //remove img from button
    $("button>.img-rounded").unwrap();
    $(".glyphicon-plus-sign").addClass("glyphicon-menu-right");
    $(".glyphicon-plus-sign").removeClass("glyphicon-plus-sign");
    normalDivs();
    showAllDivs();
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  /*End of helper functions*/