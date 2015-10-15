var url = "http://dbpedia.org/sparql";

function checkUrl() {
	/*
    var query = 'select distinct ?Concept where {[] a ?Concept} LIMIT 1';
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: function() {
			
            url = 'http://live.dbpedia.org/sparql';
        },
        error: function() {
			
            url = 'http://dbpedia.org/sparql';
        }
    });
	*/
}
var rankArray = ["kingdom", "phylum", "class", "order", "family", "genus", "species"];

function getImportantQuery(rank, name) {
    name = name.replace(' ', "_");
    return 'SELECT DISTINCT ?name,?thumb,COUNT(*) AS ?count WHERE {?name dbo:'+rank+' dbr:'+name+'.?name dbo:genus ?k.?s ?p ?name.OPTIONAL{ ?name dbo:thumbnail ?thumb }.FILTER(?name!=?k)} ORDER BY DESC(COUNT(*)) LIMIT 500';
}

function getOpenQuery(name, rank, next_rank) {
    name = name.replace(' ', "_");
	
	
	if (next_rank=="phylum"){
		return "SELECT DISTINCT ?taxon, ?thumb WHERE {{?name  dbo:kingdom dbr:" + name + ";dbo:phylum  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:kingdom dbr:" + name + ";dbp:divisio  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:kingdom dbr:" + name + ";dbo:division  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:kingdom dbr:" + name + ";dbp:phylum  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}FILTER(isURI(?taxon))} order by asc(UCASE(str(?taxon)))";
	}else if(next_rank=="class"){
		return "SELECT DISTINCT ?taxon, ?thumb WHERE {{?name  dbo:phylum dbr:" + name + ";dbo:class  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:division dbr:" + name + ";dbp:classis  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:phylum dbr:" + name + ";dbp:classis  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:division dbr:" + name + ";dbo:class  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:phylum dbr:" + name + ";dbo:class  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:divisio dbr:" + name + ";dbp:classis  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:phylum dbr:" + name + ";dbp:classis  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:division dbr:" + name + ";dbo:class  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}FILTER(isURI(?taxon))} order by asc(UCASE(str(?taxon)))";

	}else if(next_rank=="order"){
		return "SELECT DISTINCT ?taxon, ?thumb WHERE {{?name  dbo:class dbr:" + name + ";dbo:order  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:classis dbr:" + name + ";dbp:ordo  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:class dbr:" + name + ";dbp:ordo  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:classis dbr:" + name + ";dbo:order  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}FILTER(isURI(?taxon))} order by asc(UCASE(str(?taxon)))";

	}else if(next_rank=="family"){
		"SELECT DISTINCT ?taxon, ?thumb WHERE {{?name  dbo:order dbr:" + name + ";dbo:family  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:ordo dbr:" + name + ";dbp:familia  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbo:order dbr:" + name + ";dbp:familia  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}UNION{?name  dbp:ordo dbr:" + name + ";dbo:family  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}}FILTER(isURI(?taxon))} order by asc(UCASE(str(?taxon)))";
	}
    if (rank == "genus") {
        return 'SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name +
            '\"@en .OPTIONAL{?taxon dbo:thumbnail ?thumb}.FILTER (?taxon!=<http://dbpedia.org/resource/' + name + '>)}';
    } else {
        return "SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name +
            ";dbo:" + next_rank +
            "  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}} order by asc(UCASE(str(?taxon)))";
    }
}

function getSearchRankQuery(name){

var query = 'SELECT DISTINCT COUNT(?phylum) AS ?countphylum,COUNT(?classis) AS ?countclass,COUNT(?order) AS ?countorder,COUNT(?family) AS ?countfamily,COUNT(?genus) AS ?countgenus  WHERE {{ ?phylum dbo:phylum dbr:'+name+'}UNION{?classis dbo:class dbr:'+name+'}UNION{ ?order dbo:order dbr:'+name+'}UNION{?family dbo:family dbr:'+name+'}UNION{?genus dbo:genus dbr:'+name+'}}';
return query;
}

function getSummaryQuery(name, greekName) {
    if (sessionStorage.getItem('lang') == 'gr' && (name != greekName)) {
        return 'https://el.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' +
        greekName;
        //return query='SELECT ?sum WHERE {<http://dbpedia.org/resource/'+name+'> dbo:abstract?sum.filter(langMatches(lang(?sum),"EN"))} '
    } else {
        return 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' +
        name;
    }
}

function returnGreekNameQuery(nameList) {
    var nameString = '';
    for (var i in nameList) {
        nameString = nameString + nameList[i] + '|';
    }
    nameString = nameString.slice(0, -1); //=nameString(0, nameString.length - 1);
    return 'https://en.wikipedia.org/w/api.php?format=json&action=query&titles=' + nameString +
        '&lllang=el&prop=langlinks';
}

function returnOneGreekNameQuery(name) {
    return 'https://en.wikipedia.org/w/api.php?format=json&action=query&titles=' + name +
        '&lllang=el&prop=langlinks';
}

function returnOneEnglishNameQuery(name){
	
	    return 'https://en.wikipedia.org/w/api.php?format=json&action=query&titles=' + name +
        '&lllang=en&prop=langlinks';
}

function articleExistsQuery(title) {
    return 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=' + title;
}

function getSearchQuery(name,rank) {
	
	name = name.replace(' ', "_");
	if (rank=="phylum"){
			return 'SELECT DISTINCT  ?kingdom, COUNT(?kingdom) AS ?countkingdom WHERE {?name  dbo:'+rank+' dbr:'+name+';dbo:kingdom  ?kingdom}';
	}else if(rank=="class"){
	return 'SELECT DISTINCT  ?kingdom, COUNT(?kingdom) AS ?countkingdom,?phylum,COUNT(?phylum) AS ?countphylum WHERE {{?name  dbo:'+rank+' dbr:'+name+';dbo:kingdom  ?kingdom}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:phylum  ?phylum}}';	
	}else if(rank=="order"){
		return 'SELECT DISTINCT  ?kingdom, COUNT(?kingdom) AS ?countkingdom,?phylum,COUNT(?phylum) AS ?countphylum,?classis,COUNT(?classis) AS ?countclassis WHERE {{?name  dbo:'+rank+' dbr:'+name+';dbo:kingdom  ?kingdom}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:phylum  ?phylum}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:class  ?classis}}';	
	}else if(rank=="family"){
	return 'SELECT DISTINCT  ?kingdom, COUNT(?kingdom) AS ?countkingdom,?phylum,COUNT(?phylum) AS ?countphylum,?classis,COUNT(?classis) AS ?countclassis,?order,COUNT(?order) AS ?countorder WHERE {{?name  dbo:'+rank+' dbr:'+name+';dbo:kingdom  ?kingdom}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:phylum  ?phylum}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:class  ?classis}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:order  ?order}}';	
	}else if(rank=="genus"){
	return 'SELECT DISTINCT  ?kingdom, COUNT(?kingdom) AS ?countkingdom,?phylum,COUNT(?phylum) AS ?countphylum,?classis,COUNT(?classis) AS ?countclassis,?order,COUNT(?order) AS ?countorder, ?family,COUNT(?family) AS ?countfamily WHERE {{?name  dbo:'+rank+' dbr:'+name+';dbo:kingdom  ?kingdom}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:phylum  ?phylum}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:class  ?classis}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:order  ?order}UNION{?name  dbo:'+rank+' dbr:'+name+';dbo:family  ?family}}';	
	}
	
	else if(rank=="species"){
	return 'SELECT DISTINCT ?kingdom,?phylum,?classis,?order,?family,?genus  WHERE {dbr:' +
    name + ' dbo:kingdom ?kingdom.OPTIONAL{dbr:' + name + ' dbo:class ?classis}.OPTIONAL{dbr:' +
        name + ' dbo:phylum ?phylum}.OPTIONAL{dbr:' + name + ' dbp:ordo ?order}.OPTIONAL{dbr:' +
        name + ' dbp:familia ?family}.OPTIONAL{dbr:' + name + ' dbo:genus ?genus}}';	
	}
	
	    
		
}

function getTotalQuery(prevRank, prevRankName, rank) {
    prevRankName = prevRankName.replace(' ', "_");
    return 'SELECT DISTINCT ?order, COUNT(*) AS ?count WHERE {{?name  dbo:' + prevRank +
        ' dbr:' + prevRankName + ';dbo:' + rank + ' ?order}UNION {dbr:' + prevRankName +
        '  dbo:wikiPageRedirects ?rank.?rank dbo:' + rank + ' ?rank2.?rank2 dbo:' + rank +
        ' ?order}}order by desc(?count)';
}

function getNextRank(rank) {
    if (rank != 'species') return rankArray[rankArray.indexOf(rank) + 1];
}

function getPrevRank(rank) {
    if (rank != 'kingdom') return rankArray[rankArray.indexOf(rank) - 1];
}

function nameFromUrl(src) {
    var name = src.substring(src.lastIndexOf('/') + 1);
    name = name.replace("_", ' ');
    return name;
}

function ajaxError() {
	$('button').prop('disabled', false);
    if (sessionStorage.getItem('lang') == 'gr') {
        msg = 'Υπήρξε πρόβλημα με την ανάκτηση των δεδομένων.Ανανεώστε τη σελίδα.';
    } else {
        msg = 'There was a problem getting the data. Refresh page.';
    }
    bootbox.alert(msg);
}