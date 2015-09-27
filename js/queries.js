function getImportantQuery(rank,name){
return query='SELECT DISTINCT ?name,?thumb, COUNT(*) AS ?count WHERE {?name dbo:'+rank+' dbr:'+name+';dbo:thumbnail ?thumb;dbo:genus ?k.?s ?p ?name} ORDER BY DESC(COUNT(*)) LIMIT 500 ';

}

function getOpenQuery(name,rank,next_rank){

 if (rank == "genus")
        return query = 'PREFIX db: <http://dbpedia.org/resource/> SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name + '\"@en .OPTIONAL{?taxon dbo:thumbnail ?thumb}.FILTER (?taxon!=dbr:' + name + ')}';
    else
       return query =   "PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name + ";dbo:" + next_rank + "  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}} order by asc(UCASE(str(?taxon)))";

   }

function getSummaryQuery(name){
return query='https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+name;
//return query='SELECT ?sum WHERE {<http://dbpedia.org/resource/'+name+'> dbo:abstract?sum.filter(langMatches(lang(?sum),"EN"))} '
}

