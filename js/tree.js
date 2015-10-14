/* tree.js - Functions for index.html that handle tree creation*/
/*Functions that handle details and important taxon members*/
$(document).on("click", ".details", function() {
  var name = getName($(this)); //Get name of node that was clicked
  getGreekName(name);
  var greekName = sessionStorage.getItem('greekName'); //Retrieve greek name that was found from ajax request - TODO with better way
  if ($(window).width() <= 480) {
    var rank = getRankDetailsMobile($(this));
  } else {
    var rank = getRank($(this));
  }
  var img_url = $(this).closest('.thumbnail').find('img').attr('src');
  img_url = getImg300(img_url);
  var query = getSummaryQuery(name, greekName);
  sessionStorage.setItem('name', name);
  sessionStorage.setItem('rank', rank);
  $(".modal-title").text(name);
  $(".article").attr('onclick', 'showArticle("' + name + '")');
  $('#modalThumb img').hide();
  $('#modalThumb img').attr('src', img_url);
  time = prettyLoadRank($('#modalThumb img'), 'null', 900);
  $('#membersList').html(''); //Clear memberlist data
  startLoading('#modalSum');
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
    var sum = results[j].extract;
    if (sum.length > 1000) sum = sum.substr(0, 1000) + '...';
  }
  stopLoading('#modalSum');
  $('#modalSum').hide();
  $('#modalSum').text(sum);
  var time = prettyLoadRank($('#modalSum'), 'null', 700);
  startLoading('#membersList');
  getMembers(this.rank, this.name, this.img_url);
}

function getMembers(rank, name, img_url) {
  var query = getImportantQuery(rank, name.replace(' ', "_"));
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    dataType: "json",
    url: queryUrl,
    img_url: img_url,
    success: membersSuccess,
    error: ajaxError,
  });
}

function membersSuccess(_data) {
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
    for (var i in wikirankResults) { //Traverse wikirank data, compare each element to dbpedia results and if it exists add to animal list
      var wikiArray = wikirankResults[i].split(',');
      for (var j in wikiArray) {
        src = wikiArray[j];
        if ($.inArray(src, dbArray) > -1) {
          k++;
          var thumb = dbpedia_results[$.inArray(src, dbArray)].thumb.value;
          animals_html = animals_html + " <li> <div class='thumbnail'><img src='" + thumb + "'width='50px' > <div class='caption'><p caption='" + src + "'>" + src + "</p></div></div></li>";
          //na kanw kai th lista twn melwn na emfanizetai sta ellhnika  
          /*
					 " <li> <div class='thumbnail'><img src='" + thumb +
                    "'width='50px' > <div class='caption'><p><a href='javascript:showArticle(\"" +
                    src + "\")'>" + src + "</a></p></div></div></li>";
					*/
        }
        if (k > 7) break;
      }
      if (k > 7) break;
    }
    stopLoading('#membersList');
    $('#membersList').html(animals_html);
    $("#membersList .thumbnail").hide();
    var $thumbnails = $("#membersList .thumbnail");
    var time2 = $thumbnails.length * 250;
    setTimeout(function() {
      var time = prettyLoadRank($thumbnails, 'null', 250);
    }, 800)
    $('#membersList').find('.caption>p').quickfit();
    if (sessionStorage.getItem('lang') == 'gr') treeToGreek('#myModal');
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

function executeOpenQuery(query, rank, func, selectedName) {
  if (selectedName === undefined) {
    selectedName = '';
  }
  checkUrl();
  var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
  $.ajax({
    type: "GET",
    dataType: "json",
    url: queryUrl,
    rank: rank,
    selectedName: selectedName,
    success: openSuccess,
    func: func,
    error: ajaxError
  });
}

function openSuccess(_data) {
    var thumb_url = "";
    var rank = this.rank;
    var results = _data.results.bindings;
    if (results.length > 0) { //if there are any results
      for (var i in results) {
        var src = results[i].taxon.value;
        var name = nameFromUrl(src);
        if (results[i].thumb === undefined) { //replace with placeholder image if image doesn't exist
          thumb_url = "assets/no_img_thumb.jpg"
        } else {
          thumb_url = shrinkImg200(results[i].thumb.value);
        }
        var html = thumbHtml(name, thumb_url, rank, this.selectedName);
        //   $("#" + rank).append(html).hide().fadeIn(300);
        var item = $(html).hide();
        $("#" + rank).append(item);
        var contents = $("#" + rank + " .selected").detach();
        $('#' + rank + ">.rankHead").after(contents);
        //$("#" + rank+">#rankHead").prepend($("#" + rank+" .selected"));
        //$("#" + rank+" .selected").insertAfter("#" + rank+">#rankHead");
        $('button').prop('disabled', true);
        stopLoading('#' + rank + '>div');
        //item.slideDown(500);//Na dw pws na ginetai gia ena ena xehwrista
      }
      var $thumbnails = $("#" + rank + " .thumbnail");
      var time = prettyLoadRank($thumbnails, rank);
      setTimeout(function() {
        $("#" + rank + " .counter").html(" " + $thumbnails.length);
        $thumbnails.show();
        sessionStorage.setItem('treePage', $('#tree_container').html());
        $('button').prop('disabled', false);
      }, time + 100)
    } else {
      stopLoading('#' + rank + '>div');
      $('button').prop('disabled', false);
      if (this.func == "open") {
        $("#" + rank).append('<span name="lbl" caption="noResults"></span>');
      }
    }
    ChangeDiv($(window).width()); //Does changes related to screen size
    changeLanguage(sessionStorage.getItem('lang')); //does text translation for selected language
  }
  /* Function that make the Search Tree*/

function getSearchRank() {
  //TODO-αν το search term ειναι στα ελληνικά να το μεταφράζει. Έχω ετοιμάσει το query στο  returnOneEnglishNameQuery(name)
  $('button').prop('disabled', true);
  //An einai plant h Animal na paravlepetai to query
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
    dataType: "json",
    url: queryUrl,
    name: name,
    success: makeSearchTree,
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
    dataType: "json",
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
    var maxValues = [0, 0, 0, 0, 0, 0, 0];
    var kingdomType = '';
    var results = _data.results.bindings;
    console.log(results);
    for (var i in results) {
      if (results[i].kingdom !== undefined) {
        var kingdom = nameFromUrl(results[i].kingdom.value);
        if (results[i].countkingdom !== undefined) {
          var kingdomCount = parseInt(results[i].countkingdom.value);
          if (kingdomCount > maxValues[0]) {
            
            maxValues[0] = kingdomCount;
            values[0] = kingdom.replace(' ', "_");
          }
        } else {
          values[0] = kingdom.replace(' ', "_");
        }
      }
      if (results[i].phylum !== undefined) {
        var phylum = nameFromUrl(results[i].phylum.value);
        if (results[i].countphylum !== undefined) {
          var phylumCount = parseInt(results[i].countphylum.value);
          if (phylumCount > maxValues[1]) {
            maxValues[1] = phylumCount;
            values[1] = phylum.replace(' ', "_");
          }
        } else {
          values[1] = phylum.replace(' ', "_");
        }
      }
      if (results[i].classis !== undefined) {
        var classis = nameFromUrl(results[i].classis.value);
        if (results[i].countclassis !== undefined) {
          var classisCount = parseInt(results[i].countclassis.value);
          if (classisCount > maxValues[2]) {
            maxValues[2] = classisCount;
            values[2] = classis.replace(' ', "_");
          }
        } else {
          values[2] = classis.replace(' ', "_");
        }
      }
      if (results[i].order !== undefined) {
        var order = nameFromUrl(results[i].order.value);
        if (results[i].countorder !== undefined) {
          var orderCount = parseInt(results[i].countorder.value);
          if (orderCount > maxValues[3]) {
            maxValues[3] = orderCount;
            values[3] = order.replace(' ', "_");
          }
        } else {
          values[3] = order.replace(' ', "_");
        }
      }
      if (results[i].family !== undefined) {
        var family = nameFromUrl(results[i].family.value);
        if (results[i].countfamily !== undefined) {
          var familyCount = parseInt(results[i].countfamily.value);
          if (familyCount > maxValues[4]) {
            maxValues[4] = familyCount;
            values[4] = family.replace(' ', "_");
          }
        } else {
          values[4] = family.replace(' ', "_");
        }
      }
      if (results[i].genus !== undefined) {
        var genus = nameFromUrl(results[i].genus.value);
        if (results[i].countgenus !== undefined) {
          var genusCount = parseInt(results[i].genusfamily.value);
          if (genusCount > maxValues[5]) {
            maxValues[5] = genusCount;
            values[5] = genus.replace(' ', "_");
          }
        } else {
          values[5] = genus.replace(' ', "_");
        }
      }
      //TODO add species
    }
    /*
		if(values[5]!=name&&rankArray[this.index]=="genus"){ //if the genus name and search term are different then search term is species
			this.index++;
		}*/
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
    //TODO De mporei na vrei ta thumbnails. Na to kanw me sessionStorage sth xeiroterh an de vrw allo tropo 
    $('button').prop('disabled', false);
    //	$('#'+rankArray[1]+' .selected').insertAfter($('#' + rankArray[1]+ '>.rankHead'));   
  }
  /*End of tree functions*/
  /*Helper functions*/

function thumbHtml(name, thumb_url, rank, selectedName) {
  if (selectedName == name) {
    select = "selected";
  } else {
    select = "";
  }
  if (rank != "species") {
    return '   <div class="thumbnail clearfix ' + select + '">' + '<img class="img-rounded" src=\"' + thumb_url + '\" alt=\"...\"><div class=\"caption\">' + '<p caption=\"' + name + '\"></p>' + '<div class="btn-group" role="group" aria-label="..."> <button class="btn btn-info details"data-target="#myModal" data-toggle="modal" type="button"><span name="lbl" caption="details"></span></button>  <button type="button"class="btn btn-default open "><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button></div>' + '</div>   ' + '</div>';
  } else {
    return '   <div class=\"thumbnail clearfix ' + select + '">' + '<img class="img-rounded" src=\"' + thumb_url + '\" alt=\"...\">' + '<div class=\"caption\"><p caption="' + name + '">' + '</p> <button class="btn btn-info details" data-target="#myModal" data-toggle="modal"type="button"><span name="lbl" caption="details"></span></button>' + '</div>   ' + '</div>';
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

function getName(obj) {
  return obj.closest('.thumbnail').find('.caption>p[caption]').attr('caption');
}

function getGreekName(name) {
  var queryUrl = returnOneGreekNameQuery(name);
  $.ajax({
    // type: "GET",
    dataType: "jsonp",
    url: queryUrl,
    name: name,
    success: greekNameSuccess,
    error: ajaxError
  });
  //return obj.closest('.thumbnail').find('.caption>p[caption]').html()
}

function greekNameSuccess(_data) {
  var results = _data.query.pages;
  for (var i in results) {
    if (results[i].langlinks !== undefined) {
      sessionStorage.setItem('greekName', results[i].langlinks[0][
        Object.keys(results[i].langlinks[0])[1]
      ]);
    } else {
      sessionStorage.setItem('greekName', this.name);
    }
  }
}

function getRank(obj) {
  return obj.parents('div:eq(3)').attr('id');
}

function getRankDetailsMobile(obj) {
  return obj.parents('div:eq(1)').attr('id');
}

function selectRank(button, rank) {
  var selected = button.closest('.thumbnail');
  console.log("selected")
  console.log(selected);
  $('#' + rank + ' .thumbnail').removeClass('selected');
  selected.addClass('selected');
  //selected.insertAfter($('#' + rank + '>.rankHead')); //TODO return to original position when unselected
}

function startLoading(container) {
  $(container).after("<span><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...</span>");
}

function stopLoading(container) {
  $(container).next("span").remove();
}

function shrinkImg200(thumb_url) {
  var shrinkedImg = thumb_url.replace('width=300', 'width=200');
  return shrinkedImg;
}

function getImg300(thumb_url) {
  var bigImg = thumb_url.replace('width=200', 'width=300');
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