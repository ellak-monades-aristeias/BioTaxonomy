$(document).on("click", ".open", function() {

    var query = "";
   
    var name = $(this).parents('div:eq(1)').attr('id'); //get name of taxon
    var rank = $(this).parents('div:eq(2)').attr('id'); //get rank of taxon
    var next_rank = $("#" + rank).next().attr('id') //get the next rank
  
    if (rank == "genus")
        query = 'PREFIX db: <http://dbpedia.org/resource/> SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name + '\"@en ; dbo:thumbnail ?thumb.FILTER (?taxon!=dbr:' + name + ')}';
    else
        query =   "PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name + ";dbo:" + next_rank + "  ?taxon.?taxon dbo:thumbnail ?thumb;rdf:type ?type.FILTER (?type=umbel-rc:Animal)} order by asc(UCASE(str(?taxon)))";

    executeQuery(query, next_rank, name)
});


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
                        '<div class=\"caption\">' + name +
                        '<p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Λεπτομέρειες</a> <a href=\"#\" class=\"btn btn-primary open\" role=\"button\"> Aνοιγμα</a></p>    ' +
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