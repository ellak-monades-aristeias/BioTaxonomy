  var randomColorGenerator = function() {
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
  };

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
          '<b><a href="javascript:showArticle(\'' + sessionStorage.getItem(
              'prevRankName') + '\');"> <span id="statPrevRank" caption="' + sessionStorage.getItem(
              'prevRankName') +'"></span>'+
              
              
          '</a></b> <span name="lbl" caption="has"></span> <b>' + total +
          ' ' + getPluralRank() +
          '</b> <span name="lbl" caption="withTotal"></span> <b>' +
          totalCount + '</b> members');
      $('#current').html(getArticle(sessionStorage.getItem('rank')) + '<span name="lbl" caption="' +
          sessionStorage.getItem('rank') + '"></span><b><p id="statName" caption="' + sessionStorage.getItem('name') + '">' + sessionStorage.getItem('name') + '</p>' +
          '</b> <span name="lbl" caption="is"></span> <b>#' + currRanking + '</b> <span name="lbl" caption="with"></span> <b>' + currCount +
          '</b> <span name="lbl" caption="members"></span> ');
      var ctx = $("#myChart").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var myPieChart = new Chart(ctx).Pie(data,{segmentShowStroke : false});
	  changeLanguage(sessionStorage.getItem('lang'));
  }
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
   //Otan ginetai allagh glwssas na allazei kai to prohgoumeno rank
  function getPluralRank(rank) {
      return '<span name="lbl" caption="' + sessionStorage.getItem('rank') +
          'Plural"></span>';
  }

  function getArticle(rank) {
      
      if (rank == 'kingdom' || rank == 'genus' || rank == 'species') {
          return '<span name="lbl" caption="articleTo"></span> ';
      } else {
          return '<span name="lbl" caption="articleH"></span> ';
      }
  }