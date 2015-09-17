$(document).on("click", ".open", function() {

    var query = "";
    // var id = this.id;
    var name = $(this).parents('div:eq(1)').attr('id'); //get name of taxon
    var rank = $(this).parents('div:eq(2)').attr('id'); //get rank of taxon
    var next_rank = $("#" + rank).next().attr('id') //get the next rank
    console.log("rank is" + rank)
    if (rank == "genus")
        query = 'PREFIX db: <http://dbpedia.org/resource/> SELECT ?taxon WHERE { ?taxon  dbp:genus \"' + name + '\"@en .FILTER (?taxon!=dbr:' + name + ')}';
    else
        query = "PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon WHERE { ?name  dbo:" + rank + " dbr:" + name + ";dbo:" + next_rank + " ?taxon;rdf:type ?type.FILTER (?type=dbo:Animal)  }";


    executeQuery(query, next_rank, name)
});


function executeQuery(query, rank, name) {
    var url = "http://dbpedia.org/sparql";
    console.log("next rank is " + rank);
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        success: function(_data) {

            $("#" + rank).nextAll().andSelf().html(""); // clear data of next ranks before adding new data
            var results = _data.results.bindings;
            if (results.length>0) {
            for (var i in results) {
                var src = results[i].taxon.value;
                var value = src.substring(src.lastIndexOf('/') + 1);
                value = value.replace(/\_/g, ' ');

                var html = '   <div class=\"thumbnail\" id=\"' + value + '\">' +
                    '<img src=\"\" alt=\"...\">' +
                    '<div class=\"caption\">' + value +
                    '<p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Λεπτομέρειες</a> <a href=\"#\" class=\"btn btn-primary open\" role=\"button\"> Aνοιγμα</a></p>    ' +
                    '</div>   ' +
                    '</div>';




                $("#" + rank).append(html);


            }
            }   else{
            
            $("#" + rank).append("</br>No results!");
            }

        }
    });

}