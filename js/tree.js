//var buttonClicked = false;
/*Functions that handle details and important taxon members*/
$(document).on("click", ".details", function() {
 //   buttonClicked = !buttonClicked;
   console.log('in details');
  //  if (buttonClicked == true) {
       
        var name = getName($(this));
        var rank = getRank($(this));

	
        var img_url = $(this).closest('.thumbnail').find('img').attr(
            'src');
        img_url = getImg300(img_url);
      
        query = getSummaryQuery(name.replace(' ', "_"));
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('rank', rank);
        $(".modal-title").text(name);
        $(".article").attr('onclick', 'showArticle("' + name+ '")');
        $('#modalThumb').children('img').attr('src', img_url);
        startLoading('#modalSum');
        var queryUrl = query;
        $.ajax({
            dataType: "jsonp",
            url: queryUrl,
            rank: rank,
            img_url: img_url,
            name: name,
            success: summarySuccess
        });
   // }
});

function summarySuccess(_data) {
    var results = _data.query.pages;
    for (var j in results) {
        var sum = results[j].extract;
    }
    stopLoading('#modalSum');
    $('#modalSum').text(sum);
    startLoading('#membersList');
    getMembers(this.rank, this.name, this.img_url);
}

function getMembers(rank, name, img_url) {
    query = getImportantQuery(rank, name.replace(' ', "_"));
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        img_url: img_url,
        success: membersSuccess
    });
}

function membersSuccess(_data) {
        animals_html = "";
        var a = 0;
        var k = 0;
        var array = [];
        var dbpedia_results = _data.results.bindings;
        var wikirank_results = jsonObject.items;
        for (var j in dbpedia_results) {
            var src = dbpedia_results[j].name.value;
            var name = nameFromUrl(src);
            
            array[j] = name;
        }
        for (var i in wikirank_results) {
            var src = $.trim(wikirank_results[i].n);
            if ($.inArray(src, array) > -1) {
                k++;
                var thumb = dbpedia_results[$.inArray(src, array)].thumb.value;
                animals_html = animals_html +
                    " <li> <div class='thumbnail'><img src='" + thumb +
                    "'width='50px' > <div class='caption'><p><a href='javascript:showArticle(\"" +
                    src + "\")'>" + src + "</a></p></div></div></li>";
            }
            if (k > 6) break;
        }
        stopLoading('#membersList');
        $('#membersList').html(animals_html)
        $('#membersList').find('.caption>p').quickfit();
    }
    /*End of details functions*/
    /*Functions that make the tree*/
$(document).on("click", ".open", function() {
  //  buttonClicked = !buttonClicked;
    $('button').prop('disabled', true);
	
    //if (buttonClicked == true) {
        // Do stuff once
        var name = getName($(this));
        sessionStorage.setItem('prevRankName', name)
            //name.replace(/ /g,"_");
        var rank = getRank($(this));
        selectRank($(this), rank);
        var next_rank = getNextRank(rank); //get the next rank
      
        var rank_index = rankArray.indexOf(rank);
        for (i = rank_index + 1; i < rankArray.length; i++) { // clear data of next ranks before adding new data
            $("#" + rankArray[i]+'>div').nextAll().remove();
        }
       startLoading('#' + next_rank+'>div');
        if ($(window).width() <= 480) {
           
            var mobilePlace = $(this).parent().parent().parent();
            var contents = $("#" + next_rank).detach();
            mobilePlace.after(contents);
        }
        query = getOpenQuery(name, rank, next_rank);
		console.log(query);
        executeQuery(query, next_rank, name);
    //}
});

function executeQuery(query, rank, name, callback) {
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        success: openSuccess
    });
}

function openSuccess(_data) {
    var thumb_url = "";
    var rank = this.rank;
   stopLoading('#' + rank+'>div');

    var results = _data.results.bindings;
    if (results.length > 0) {
        for (var i in results) {
            var src = results[i].taxon.value;
            var name = nameFromUrl(src);
            if (results[i].thumb == undefined) {
                thumb_url = "assets/no_img_thumb.jpg"
            } else {
                thumb_url = shrinkImg200(results[i].thumb.value);
            }
            var html = thumbHtml(name, thumb_url, rank);
				
         $("#" + rank ).append(html);
		
        }
       
		//edw na exetazei th glwssa
		 if (sessionStorage.getItem('lang')=='gr'){
			
			 treeToGreek("#" + rank);//Translates tree to greek
			 
        }else{
	changeLanguage('en');
	$("#" + rank).find('.caption>p[caption]').each(function() {

$( this ).html($( this ).attr('caption')) ;
});
$("#" + rank).find('.caption p').quickfit();	
		}
		
	
		
        sessionStorage.setItem('treePage', $('#tree_container').html());
        if ($(window).width() <= 480) {
            $(".glyphicon-menu-right").addClass("glyphicon-plus-sign");
            $(".glyphicon-menu-right").removeClass("glyphicon-menu-right");
        }
    } else {
        $("#" + rank).append('<span name="lbl" caption="noResults"></span>');
    }
	changeLanguage(sessionStorage.getItem('lang'));
    $('button').prop('disabled', false);
}







function thumbHtml(name, thumb_url, rank) {
	 var buttonStart='';
	 var buttonEnd='';
	 if ($(window).width() <= 480) {
	buttonStart='<button class="btn btn-info details" data-target="#myModal" data-toggle="modal" type="button">';
	 buttonEnd='</button>';
	 }

    if (rank != "species") {
        return html = '   <div class=\"thumbnail clearfix\">' +buttonStart+'<img class="img-rounded" src=\"' + thumb_url +
            '\" alt=\"...\">' +buttonEnd+ '<div class=\"caption\">'+
			'<p caption=\"'+name+'\"></p>'+
			'<div class="btn-group" role="group" aria-label="..."> <button class="btn btn-info details hidden-xs "data-target="#myModal" data-toggle="modal"type="button"><span class="glyphicon glyphicon-search hidden-lg "></span><span name="lbl" class="visible-lg" caption="details"></span></button>  <button type="button"class="btn btn-default open "><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button></div>' +
            '</div>   ' + '</div>';
    } else {
        return html = '   <div class=\"thumbnail clearfix\">'+buttonStart+'<img class="img-rounded" src=\"' + thumb_url +
            '\" alt=\"...\">' + buttonEnd+'<div class=\"caption\"><p caption="'+name+'">'+
            +'</p> <button class="btn btn-info details hidden-xs "data-target="#myModal" data-toggle="modal"type="button"><span class="glyphicon glyphicon-search hidden-lg "></span><span name="lbl" class="visible-lg" caption="details"></span></button>' +
            '</div>   ' + '</div>';
    }
}
function openError() {
    console.log("error");
    var rank = this.rank;
    $("#" + rank).html("<span></br>There was a problem with the data</span>");
}

function makeSearchTree() {
    var name = $('#searchBox').val().replace(' ', "_");
    query = getSearchQuery(name);
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        title: $('#searchBox').val(),
        success: makeSearchTreeSuccess
    });
}

function makeSearchTreeSuccess(_data) {
        $("#kingdom").nextAll().html("");
        var kingdom = '';
        var phylum = '';
        var classis = '';
        var order = '';
        var family = '';
        var genus = '';
        var type = '';
        var results = _data.results.bindings;
        for (var i in results) {
            if (results[i].kingdom != undefined) {
                var kingdom = nameFromUrl(results[i].kingdom.value);
                kingdom = kingdom.replace(' ', "_");
            }
            if (results[i].phylum != undefined) {
                var phylum = nameFromUrl(results[i].phylum.value);
                phylum = phylum.replace(' ', "_");
            }
            if (results[i].classis != undefined) {
                var classis = nameFromUrl(results[i].classis.value);
                classis = classis.replace(' ', "_");
            }
            if (results[i].order != undefined) {
                var order = nameFromUrl(results[i].order.value);
                order = order.replace(' ', "_");
            }
            if (results[i].family != undefined) {
                var family = nameFromUrl(results[i].family.value);
                family = family.replace(' ', "_");
            }
            if (results[i].genus != undefined) {
                var genus = nameFromUrl(results[i].genus.value);
                genus = genus.replace(' ', "_");
            }
            if (kingdom == 'Animal' || kingdom == 'Animalia') kingdom_type =
                "Animal";
            if (kingdom == 'Plant' || kingdom == 'Plantae') kingdom_type =
                "Plant";
        }
        //Find phylums	 
        query = getOpenQuery(kingdom_type, 'kingdom', 'phylum');
        executeQuery(query, 'phylum', type);
        //Find classes
        query = getOpenQuery(phylum, 'phylum', 'class');
        executeQuery(query, 'class', phylum);
        //Find orders
        query = getOpenQuery(classis, 'class', 'order');
        executeQuery(query, 'order', classis);
        //Find families
        query = getOpenQuery(order, 'order', 'family');
        executeQuery(query, 'family', order);
        //Find genii
        query = getOpenQuery(family, 'family', 'genus');
        executeQuery(query, 'genus', family);
    }
    /*End of tree functions*/
    /*Helper functions*/

function getName(obj) {
  
	return name = obj.closest('.thumbnail').find('.caption>p[caption]').attr('caption');
	
}

function getRank(obj) {
    return rank = obj.parents('div:eq(3)').attr('id');
}



function selectRank(button, rank) {
    $('#' + rank + ' .thumbnail').removeClass('selected');
    button.closest('.thumbnail').addClass('selected');
}

function startLoading(container) {
    $(container).after(
        "<span><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...</span>"
    );
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
    /*End of helper functions*/