var url = "http://live.dbpedia.org/sparql";
var rankArray =["kingdom","phylum","class","order","family","genus","species"];

function getImportantQuery(rank,name){
return query='SELECT DISTINCT ?name,?thumb, COUNT(*) AS ?count WHERE {?name dbo:'+rank+' dbr:'+name+';dbo:thumbnail ?thumb;dbo:genus ?k.?s ?p ?name} ORDER BY DESC(COUNT(*)) LIMIT 500 ';

}

function getOpenQuery(name,rank,next_rank){

 if (rank == "genus"){
        return query = 'SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name + '\"@en .OPTIONAL{?taxon dbo:thumbnail ?thumb}.FILTER (?taxon!=dbr:' + name + ')}';
 }else{
       return query =   "SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name + ";dbo:" + next_rank + "  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}} order by asc(UCASE(str(?taxon)))";
 }
   }

function getSummaryQuery(name){
return query='https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+name;
//return query='SELECT ?sum WHERE {<http://dbpedia.org/resource/'+name+'> dbo:abstract?sum.filter(langMatches(lang(?sum),"EN"))} '
}

function articleExistsQuery(title){
return query='https://en.wikipedia.org/w/api.php?action=query&format=json&titles='+title;
}

function getSearchQuery(name){
	return query='SELECT DISTINCT ?kingdom,?phylum,?classis,?order,?family,?genus  WHERE {dbr:'+name+' dbo:kingdom ?kingdom.OPTIONAL{dbr:'+name+' dbo:class ?classis}.OPTIONAL{dbr:'+name+' dbo:phylum ?phylum}.OPTIONAL{dbr:'+name+' dbp:ordo ?order}.OPTIONAL{dbr:'+name+' dbp:familia ?family}.OPTIONAL{dbr:'+name+' dbo:genus ?genus}}'
;
}

function getStatsQuery(prev_rank,rank,name){
	return query='SELECT DISTINCT ?order, COUNT(*) AS ?count WHERE {{?name  dbo:'+prev_rank+' dbr:'+name+';dbo:'+rank+' ?order}UNION {?name  dbo:'+prev_rank+' dbr:'+name+'ia;dbo:'+rank+' ?order}}order by asc(UCASE(str(?order)))';
}

function getTotalQuery(prevRank,prevRankName,rank){
	
return query='SELECT DISTINCT ?order, COUNT(*) AS ?count WHERE {{?name  dbo:'+prevRank+' dbr:'+prevRankName+';dbo:'+rank+' ?order}UNION {dbr:'+prevRankName+'  dbo:wikiPageRedirects ?rank.?rank dbo:'+rank+' ?rank2.?rank2 dbo:'+rank+' ?order}}order by desc(?count)';
	

}

function getNextRank(rank){

return rankArray[rankArray.indexOf(rank)+1];
}

function getPrevRank(rank){
return rankArray[rankArray.indexOf(rank)-1];	
}

function nameFromUrl(src) {
        var name = src.substring(src.lastIndexOf('/') + 1);
        name = name.replace(/\_/g, ' ');
        return name;
    }



















