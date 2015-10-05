


/*Functions that handle details and important taxon members*/

$(document).on("click", ".details", function() {


    var name = getName($(this));
    var rank = getRank($(this));
	name =name.replace(/ /g,"_");

    var img_url = $(this).closest('.thumbnail').find('img').attr('src');

    var title = $(this).closest('.thumbnail').find('.caption').children().first().text();
    query = getSummaryQuery(name);

 sessionStorage.setItem('title',title);
 sessionStorage.setItem('rank',rank);
 
 $(".modal-title").text(title);	
 $(".article").attr('onclick', 'showArticle("'+title+'")');
$('#modalThumb').children('img').attr('src', img_url);

startLoading('#modalSum');

    var queryUrl = query;
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        img_url: img_url,
        title: title,
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
    getMembers(this.rank, this.name, this.img_url, this.title);




}


function getMembers(rank, name, img_url, title) {
    
    query = getImportantQuery(rank, name);
   
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        img_url: img_url,
        title: title,
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
        var src2 = dbpedia_results[j].name.value;
        var name = nameFromUrl(src2);
        name = name.replace("_", ' ');
        array[j] = name;

    }


    for (var i in wikirank_results) {

        var src = $.trim(wikirank_results[i].n);

        if ($.inArray(src, array) > -1) {
         
            k++;
            var thumb = dbpedia_results[$.inArray(src, array)].thumb.value;
            animals_html = animals_html + " <li> <div class='thumbnail'><img src='" + thumb + "'width='50px' > <div class='caption'><p><a href='javascript:showArticle(\""+src+"\")'>" + src + "</a></p></div></div></li>";
           
        }

        if (k > 6)
            break;

    }

	stopLoading('#membersList');
	$('#membersList').html(animals_html)
 


}





/*End of details functions*/

/*Functions that make the tree*/
$(document).on("click", ".open", function() {

    var name = getName($(this));
	sessionStorage.setItem('prevRankName',name)
	//name.replace(/ /g,"_");
    var rank = getRank($(this));
	selectRank($(this),rank);
    var next_rank = $("#" + rank).next().attr('id') //get the next rank
$("#" + rank).nextAll().html(""); // clear data of next ranks before adding new data
startLoading('#'+next_rank);
	

    query = getOpenQuery(name, rank, next_rank);

	
    executeQuery(query, next_rank, name);
});

function executeQuery(query, rank, name,callback) {


    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
		type: "GET",
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        success: openSuccess,

    });

}

function openSuccess(_data) {
	var thumb_url="";
    var rank = this.rank;
	stopLoading('#'+rank);

    var results = _data.results.bindings;
    if (results.length > 0) {
        for (var i in results) {
            var src = results[i].taxon.value;
            var name = nameFromUrl(src);

				if (results[i].thumb==undefined){
				thumb_url="assets/no_img_thumb.jpg"}
				else{
				thumb_url = results[i].thumb.value;
				}
            var html = thumbHtml(name, thumb_url,rank);


           $("#" + rank).append(html);
 sessionStorage.setItem('treePage',$('#tree_container').html());

        }
    } else {

        $("#" + rank).append("</br>No results!");
    }


}
function openError(){
	console.log("error");
	
 var rank = this.rank;
 $("#" + rank).html("</br>There was a problem with the data");	
}

function makeSearchTree(){
var name=$('#searchBox').val().replace(/ /g,"_");

query=getSearchQuery(name);
 var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        title: $('#searchBox').val(),
        success: makeSearchTreeSuccess
    });
}

function makeSearchTreeSuccess(_data){
	$("#kingdom").nextAll().html(""); 
	var kingdom ='';
	var phylum ='';
	var classis ='';
	var order = '';
	var family = '';
	var genus = '';
	var type = '';
	var results = _data.results.bindings;
	 for (var i in results) {
		 
			if (results[i].kingdom!=undefined){
				var kingdom = nameFromUrl(results[i].kingdom.value);
				kingdom=kingdom.replace(/ /g,"_");
			}
			if (results[i].phylum!=undefined){
				var phylum = nameFromUrl(results[i].phylum.value);
				phylum=phylum.replace(/ /g,"_");
			}
			if (results[i].classis!=undefined){
				var classis = nameFromUrl(results[i].classis.value);
				classis=classis.replace(/ /g,"_");
			}
			if (results[i].order!=undefined){
				var order = nameFromUrl(results[i].order.value);
				order=order.replace(/ /g,"_");
			}
			if (results[i].family!=undefined){
				var family = nameFromUrl(results[i].family.value);
				family=family.replace(/ /g,"_");
			}
			if (results[i].genus!=undefined){
				var genus = nameFromUrl(results[i].genus.value);
				genus=genus.replace(/ /g,"_");
			}
		
	if (kingdom=='Animal'||kingdom=='Animalia')	
		kingdom_type="Animal";
	if (kingdom=='Plant'||kingdom=='Plantae')
		kingdom_type="Plant";
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
    return name = obj.parents('div:eq(2)').attr('id'); //get name of taxon

}

function getRank(obj) {
    return rank = obj.parents('div:eq(3)').attr('id');
}


function thumbHtml(name, thumb_url,rank) {

	if (rank!="species"){
		
    return html = '   <div class=\"thumbnail\" id=\"' + name + '\">' +
        '<img class="img-rounded" src=\"' + thumb_url + '\" alt=\"...\">' +
        '<div class=\"caption\"><p><b>' + name +
        '</b></p><div class="btn-group" role="group" aria-label="..."><button type="button"class="btn btn-info details" data-toggle="modal" data-target="#myModal">Λεπτομέρειες</button>  <button type="button"class="btn btn-default open "><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button></div>    ' +
        '</div>   ' +
        '</div>';
	}else{

	 return html = '   <div class=\"thumbnail\" id=\"' + name + '\">' +
        '<img class="img-rounded" src=\"' + thumb_url + '\" alt=\"...\">' +
        '<div class=\"caption\"><p><b>' + name +
        '</b></p><p><button type="button"class="btn btn-info details" data-toggle="modal" data-target="#myModal">Λεπτομέρειες</button> </p>    ' +
        '</div>   ' +
        '</div>';	
	}

}

function selectRank(button,rank){

	$('#'+rank+' .thumbnail').removeClass('selected');
	button.closest('.thumbnail').addClass('selected');
	
}

function startLoading(container){
	$(container).append("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
}
function stopLoading(container){
	$(container).html("");
}

    /*End of helper functions*/