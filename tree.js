
$(document).on("click", ".details", function() {

 var animals_html="";
  var name = $(this).parents('div:eq(1)').attr('id'); //get name of taxon
  var rank = $(this).parents('div:eq(2)').attr('id'); //get rank of taxon
  
  var img_url = $(this).closest('.thumbnail').find('img').attr('src'); 

var title = $(this).closest('.thumbnail').find('.caption').children().first().text();   
  
 query='SELECT DISTINCT ?name,?thumb, COUNT(*) AS ?count WHERE {?name dbo:'+rank+' dbr:'+name+';dbo:thumbnail ?thumb;dbo:genus ?k.?s ?p ?name} ORDER BY DESC(COUNT(*)) LIMIT 500 ';
 console.log("details "+query); 
 var url = "http://dbpedia.org/sparql";

    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        data:{img_url:img_url,title:title},
        success: function(_data) {
			animals_html="";
  var a=0;
   var k=0;  
   var array=[];  
       
            var dbpedia_results = _data.results.bindings;
         
           var wikirank_results = jsonObject.items;
           for (var j in dbpedia_results) {
                var src2 = dbpedia_results[j].name.value;
                    var name = src2.substring(src2.lastIndexOf('/') + 1);
                    name = name.replace(/\_/g, ' ');
                    name = name.replace("_", ' ');
                  array[j]=name;
                    
                }    
          
               
                for (var i in wikirank_results) {
                
                    var src = $.trim(wikirank_results[i].n);
                 
           if($.inArray(src, array)>-1){
           
           k++;
           var thumb = dbpedia_results[$.inArray(src, array)].thumb.value;
           animals_html=animals_html+" <li><div class='span1'><img src='"+thumb+"'width='50px' ><p>"+src+"</p></div></li>" ;
           
           }
               
              if(k>6)
              break;

                }
         
         $("body").append('<div id="dialog"  ><div class="container-fluid">   <div class="row"><div class="span7">'+title+'</div><div class="row "><div class="span7"><img src="'+img_url+'"width="200px"></div></div><div class="span6"><div class="row"><ul class="list-inline">'+animals_html+'</ul></div></div></div></div></div>');
  $( "#dialog" ).dialog({
 width: 700,
  height: 400 ,
  close: function( event, ui ) {
  $( "#dialog" ).remove();
  }
 
});          

        }
    });
              


 

});



$(document).on("click", ".open", function() {

    var query = "";
   
    var name = $(this).parents('div:eq(1)').attr('id'); //get name of taxon
    var rank = $(this).parents('div:eq(2)').attr('id'); //get rank of taxon
    var next_rank = $("#" + rank).next().attr('id') //get the next rank
  
    if (rank == "genus")
        query = 'PREFIX db: <http://dbpedia.org/resource/> SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name + '\"@en ; dbo:thumbnail ?thumb.FILTER (?taxon!=dbr:' + name + ')}';
    else
        query =   "PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name + ";dbo:" + next_rank + "  ?taxon.?taxon dbo:thumbnail ?thumb;rdf:type ?type.FILTER (?type=umbel-rc:Animal)} order by asc(UCASE(str(?taxon)))";
    console.log("tree "+query);
    executeQuery(query, next_rank, name);
});

function getName(){
  var name = $(this).parents('div:eq(1)').attr('id'); //get name of taxon
 return name;
}

function getRank(){
   var rank = $(this).parents('div:eq(2)').attr('id'); //get rank of taxon
   return rank;
}
function executeQuery(query, rank, name) {
    var url = "http://dbpedia.org/sparql";

    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        success: function(_data) {

            $("#" + rank).nextAll().andSelf().html(""); // clear data of next ranks before adding new data
            var results = _data.results.bindings;
            if (results.length > 0) {  
                for (var i in results) {
                    var src = results[i].taxon.value;
                    var name = src.substring(src.lastIndexOf('/') + 1);
                    name = name.replace(/\_/g, ' ');
                    
                    var thumb_url = results[i].thumb.value;
                    

                    var html = '   <div class=\"thumbnail\" id=\"' + name + '\">' +
                        '<img src=\"'+thumb_url+'\" alt=\"...\">' +
                        '<div class=\"caption\"><p>' + name +
                        '</p>         <p><a href=\"#\" class=\"btn btn-primary details\" role=\"button\">Λεπτομέρειες</a> <a href=\"#\" class=\"btn btn-primary open\" role=\"button\"> Aνοιγμα</a></p>    ' +
                        '</div>   ' +
                        '</div>';

                    $("#" + rank).append(html);


                }
            } else {

                $("#" + rank).append("</br>No results!");
            }


        }
    });

}