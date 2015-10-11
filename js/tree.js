/* tree.js - Functions for index.html that handle tree creation*/
/*Functions that handle details and important taxon members*/
$(document).on("click", ".details", function() {

    var name = getName($(this)); //Get name of node that was clicked
    getGreekName(name);
    var greekName = sessionStorage.setItem('greekName'); //Retrieve greek name that was found from ajax request - TODO with better way
    var rank = getRank($(this));
    var img_url = $(this).closest('.thumbnail').find('img').attr('src');
    img_url = getImg300(img_url);

    query = getSummaryQuery(name, greekName);

    sessionStorage.setItem('name', name);
    sessionStorage.setItem('rank', rank);
    $(".modal-title").text(name);
    $(".article").attr('onclick', 'showArticle("' + name + '")');
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
    var k = 0;
    var array = [];
    var dbpedia_results = _data.results.bindings;
    var wikirank_results = jsonObject.items;

    for (var j in dbpedia_results) { //pass all dbpedia results in array for easier understanding
        var src = dbpedia_results[j].name.value;
        var name = nameFromUrl(src);
        array[j] = name;
    }

    for (var i in wikirank_results) { //Traverse wikirank data, compare each element to dbpedia results and if it exists add to animal list
        var src = $.trim(wikirank_results[i].n);
        if ($.inArray(src, array) > -1) {
            k++;
            var thumb = dbpedia_results[$.inArray(src, array)].thumb.value;
            animals_html = animals_html +
                " <li> <div class='thumbnail'><img src='" + thumb +
                "'width='50px' > <div class='caption'><p>" + src +
                "</p></div></div></li>";
            //na kanw kai th lista twn melwn na emfanizetai sta ellhnika  
            /*
					 " <li> <div class='thumbnail'><img src='" + thumb +
                    "'width='50px' > <div class='caption'><p><a href='javascript:showArticle(\"" +
                    src + "\")'>" + src + "</a></p></div></div></li>";
					*/
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

    $('button').prop('disabled', true);
    var name = getName($(this));
    sessionStorage.setItem('prevRankName', name)
        //name.replace(/ /g,"_");
    var rank = getRank($(this));
    selectRank($(this), rank); //Make clicked node selected
    var next_rank = getNextRank(rank); //get the next rank
    clearNextRanks(rank); //Clear data of next ranks
    startLoading('#' + next_rank + '>div');

    query = getOpenQuery(name, rank, next_rank);
  
    executeOpenQuery(query, next_rank);
    //}
});

function executeOpenQuery(query, rank) {
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
    stopLoading('#' + rank + '>div');
    var results = _data.results.bindings;
    if (results.length > 0) { //if there are any results
        for (var i in results) {
            var src = results[i].taxon.value;
            var name = nameFromUrl(src);
            if (results[i].thumb == undefined) { //replace with placeholder image if image doesn't exist
                thumb_url = "assets/no_img_thumb.jpg"
            } else {
                thumb_url = shrinkImg200(results[i].thumb.value);
            }
            var html = thumbHtml(name, thumb_url, rank);
            $("#" + rank).append(html);
        }

        sessionStorage.setItem('treePage', $('#tree_container').html());


    } else {
        $("#" + rank).append('<span name="lbl" caption="noResults"></span>');
    }

    ChangeDiv($(window).width()); //Does changes related to screen size
    changeLanguage(sessionStorage.getItem('lang')); //does text translation for selected language
    $('button').prop('disabled', false);
}


/* Function that make the Search Tree*/
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
    clearNextRanks("#kingdom"); //Clear data of all ranks

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

    }
    if (kingdom == 'Animal' || kingdom == 'Animalia') kingdom_type =
        "Animal";
    if (kingdom == 'Plant' || kingdom == 'Plantae') kingdom_type =
        "Plant";
    if (kingdomType == 'Animal' || kingdomType = 'Plant') { //Only make tree if kingdom is plant or animal

        selectRank($('p[caption=' + kingdom_type + ']'), 'kingdom'); //TODO check if this works. Makes animal or plant selected
        //Find phylums	 
        query = getOpenQuery(kingdom_type, 'kingdom', 'phylum');
        executeOpenQuery(query, 'phylum', type);
        //Find classes
        query = getOpenQuery(phylum, 'phylum', 'class');
        executeOpenQuery(query, 'class', phylum);
        //Find orders
        query = getOpenQuery(classis, 'class', 'order');
        executeOpenQuery(query, 'order', classis);
        //Find families
        query = getOpenQuery(order, 'order', 'family');
        executeOpenQuery(query, 'family', order);
        //Find genii
        query = getOpenQuery(family, 'family', 'genus');
        executeOpenQuery(query, 'genus', family);
    }
}
/*End of tree functions*/
/*Helper functions*/
function thumbHtml(name, thumb_url, rank) {

    if (rank != "species") {
        return html = '   <div class=\"thumbnail clearfix\">' +
            '<img class="img-rounded" src=\"' + thumb_url +
            '\" alt=\"...\"><div class=\"caption\">' +
            '<p caption=\"' + name + '\"></p>' +
            '<div class="btn-group" role="group" aria-label="..."> <button class="btn btn-info details"data-target="#myModal" data-toggle="modal" type="button"><span name="lbl" caption="details"></span></button>  <button type="button"class="btn btn-default open "><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button></div>' +
            '</div>   ' + '</div>';
    } else {
        return html = '   <div class=\"thumbnail clearfix\">' +
            '<img class="img-rounded" src=\"' + thumb_url +
            '\" alt=\"...\">' +
            '<div class=\"caption\"><p caption="' + name + '">' + +
            '</p> <button class="btn btn-info details" data-target="#myModal" data-toggle="modal"type="button"><span name="lbl" caption="details"></span></button>' +
            '</div>   ' + '</div>';
    }
}

function openError() {
  
    var rank = this.rank;
    $("#" + rank).html(
        "<span></br>There was a problem with the data</span>");
}

function clearNextRanks(rank) {
    var rank_index = rankArray.indexOf(rank);
    for (i = rank_index + 1; i < rankArray.length; i++) {

        $("#" + rankArray[i] + '>.thumbnail').remove(); //remove thumbnail divs
        $("#" + rankArray[i] + '>span').remove(); //remove spans with text 

        contents = $("#" + rankArray[i]).detach();
        $("#" + rankArray[i - 1]).after(contents)

    }
}

function getName(obj) {
    return name = obj.closest('.thumbnail').find('.caption>p[caption]').attr(
        'caption');
}

function getGreekName(name) {
   
    queryUrl = returnOneGreekNameQuery(name)
    $.ajax({
        // type: "GET",
        dataType: "jsonp",
        url: queryUrl,
        name: name,
        success: greekNameSuccess
    });
    //return obj.closest('.thumbnail').find('.caption>p[caption]').html()
}

function greekNameSuccess(_data) {
    var results = _data.query.pages;
  
    for (var i in results) {
        if (results[i].langlinks != undefined) {
            sessionStorage.setItem('greekName', results[i].langlinks[0][
                Object.keys(results[i].langlinks[0])[1]
            ]);
        } else {
            sessionStorage.setItem('greekName', this.name);
        }
    }
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

/*End of helper functions*/