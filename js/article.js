  /**
 * Functions for article page. 
 *
 * @module Article
 */
 
 /**
* Generates a random color
*
* @class randomColorGenerator
* @constructor
*/

  
  var randomColorGenerator = function() {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
  };
 /**
* Generates a color shade
*
* @class shadeColor2
* @constructor
* @param {string} color Color
* @param {number} percent Precentage
*/
  function shadeColor2(color, percent) {
      var f = parseInt(color.slice(1), 16),
          t = percent < 0 ? 0 : 255,
          p = percent < 0 ? percent * -1 : percent,
          R = f >> 16,
          G = f >> 8 & 0x00FF,
          B = f & 0x0000FF;
      return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (
          Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) *
          p) + B)).toString(16).slice(1);
  }
 /**
* Callback for getStatistics. Creates pie chart with help of chart.js
*
* @class totalQuerySuccess
* @constructor
* @param {object} _data Ajax response that contains total number of species
*/
  function totalQuerySuccess(_data) {
    var totalCount = 0;
    var data = [];
    var dbpedia_results = _data.results.bindings;
    for (var j in dbpedia_results) {
        var name = nameFromUrl(dbpedia_results[j].order.value);
        var count = dbpedia_results[j].count.value;
        totalCount = totalCount + parseInt(count);
        name = name.replace("_", ' ');
        if (name == sessionStorage.getItem('name')) {
            var currRanking = parseInt(j) + 1;
            var currCount = count;
        }
        data.push({
            value: count,
            color: randomColorGenerator(),
            highlight: randomColorGenerator(),
            label: '#' + (parseInt(j) + 1) + ':' + name
        });
    }
    var total = parseInt(j) + 1;
    $('#totalNumber').html(getArticle(getPrevRank(sessionStorage.getItem('rank'))) + '<span name="lbl" caption="' +
        getPrevRank(sessionStorage.getItem('rank')) + '"></span> ' +
        '<b><a href="javascript:showArticle();"> <span id="statPrevRank" caption="' + sessionStorage.getItem(
            'prevRankName') + '"></span>' +


        '</a></b> <span name="lbl" caption="has"></span> <b>' + total +
        ' ' + getPluralRank() +
        '</b> <span name="lbl" caption="withTotal"></span> <b>' +
        totalCount + '</b> <span name="lbl" caption="members"></span>');
    $('#current').html(getArticle(sessionStorage.getItem('rank')) + '<span name="lbl" caption="' +
        sessionStorage.getItem('rank') + '"></span><b><p id="statName" caption="' + sessionStorage.getItem('name') + '">' + sessionStorage.getItem('name') + '</p>' +
        '</b> <span name="lbl" caption="is"></span> <b>#' + currRanking + '</b> <span name="lbl" caption="with"></span> <b>' + currCount +
        '</b> <span name="lbl" caption="members"></span> ');
    var ctx = $("#myChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var myPieChart = new Chart(ctx).Pie(data, {
        segmentShowStroke: false
    });
    changeLanguage(sessionStorage.getItem('lang'));
}
  
   /**
* Makes ajax request for statistics. 
*
* @class getStatistics
* @constructor
*/
  function getStatistics(){
  var prevRankName = sessionStorage.getItem('prevRankName');
  var rank = sessionStorage.getItem('rank');
  var prevRank = getPrevRank(rank);
  query = getTotalQuery(prevRank, prevRankName, rank);
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  checkUrl();
  $.ajax({
      dataType: "jsonp",
      url: queryUrl,
      success: totalQuerySuccess,
      error: ajaxError
  });
  }
  
   /**
* Gets plural form of rank. Used in statistics message. 
*
* @class getPluralRank
* @constructor
* @param {string} rank Rank
*/
  function getPluralRank(rank) {
      return '<span name="lbl" caption="' + sessionStorage.getItem('rank') +
          'Plural"></span>';
  }
   /**
* Gets article used before rank. Used for greek translation. 
*
* @class getArticle
* @constructor
* @param {string} rank Rank
*/
  function getArticle(rank) {
      
      if (rank == 'kingdom' || rank == 'genus' || rank == 'species') {
          return '<span name="lbl" caption="articleTo"></span> ';
      } else {
          return '<span name="lbl" caption="articleH"></span> ';
      }
  }
    /**
* Inserts article into DOM. 
*
* @class loadArticle
* @constructor
*/
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
   /**
* Callback for getSearchRank. Makes ajax request that gets name of previous rank member.   
*
* @class articleRankSuccess
* @constructor
* @param {object} _data Ajax response that contains counts of ranks
*/
function articleRankSuccess(_data){
	getGreekName(this.name,"searchArticle");
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
		
	var query =getprevRankNameQuery(this.name,index);
console.log(query);
   var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    dataType: "jsonp",
    url: queryUrl,
    success: prevRankSuccess,
    error: ajaxError
  }); 
	
}
   /**
* Callback for articleRankSuccess. Gets most probable rank name from a list of possible rank names.   
*
* @class  prevRankSuccess
* @constructor
* @param {object} _data Ajax response that contains possible ranks. 
*/
function prevRankSuccess(_data) {
    var results = _data.results.bindings;


    var maxValue = 0;
    var value = '';

    for (var i in results) {
        if (results[i].taxon !== undefined) {

            var count = parseInt(results[i].counttaxon.value);
            if (count > maxValue) {
                maxValue = count;
                var name = nameFromUrl(results[i].taxon.value);
                value = name.replace(' ', "_");
            }

        }
    }

    sessionStorage.setItem('prevRankName', value);
    window.location.replace('article.html');
}

/**
* Callback for searchArticle.  
*
* @class searchSuccess
* @constructor
* @param {object} _data Ajax response that contains wikipedia page url
*/
function searchSuccess(_data) {
    var results = _data.query.pages;
    for (var i in results) {}

    if (i > 0) {
   
        getSearchRank("article");

    } else {
        $('#article').html("Wikipedia article doesn't exist");
    }
}