var url = "http://live.dbpedia.org/sparql";

function checkUrl() {
    query = 'select distinct ?Concept where {[] a ?Concept} LIMIT 1';
    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "json",
        url: queryUrl,
        success: function() {
            url = 'http://live.dbpedia.org/sparql';
        },
        error: function() {
            url = 'http://dbpedia.org/sparql';
        }
    });
}
var rankArray = ["kingdom", "phylum", "class", "order", "family", "genus", "species"];

function getImportantQuery(rank, name) {
    name = name.replace(' ', "_");
    return 'SELECT DISTINCT ?name,?thumb, COUNT(*) AS ?count WHERE {?name dbo:' + rank +
        ' dbr:' + name +
        ';dbo:thumbnail ?thumb;dbo:genus ?k.?s ?p ?name} ORDER BY DESC(COUNT(*)) LIMIT 500 ';
}

function getOpenQuery(name, rank, next_rank) {
    name = name.replace(' ', "_");
    if (rank == "genus") {
        return 'SELECT ?taxon,?thumb WHERE { ?taxon  dbp:genus \"' + name +
            '\"@en .OPTIONAL{?taxon dbo:thumbnail ?thumb}.FILTER (?taxon!=<http://dbpedia.org/resource/' +
            name + '>)}';
    } else {
        return "SELECT DISTINCT ?taxon, ?thumb WHERE {?name  dbo:" + rank + " dbr:" + name +
            ";dbo:" + next_rank +
            "  ?taxon.OPTIONAL{?taxon dbo:thumbnail ?thumb}} order by asc(UCASE(str(?taxon)))";
    }
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

function articleExistsQuery(title) {
    return 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=' + title;
}

function getSearchQuery(name) {
    name = name.replace(' ', "_");
    return 'SELECT DISTINCT ?kingdom,?phylum,?classis,?order,?family,?genus  WHERE {dbr:' +
    name + ' dbo:kingdom ?kingdom.OPTIONAL{dbr:' + name + ' dbo:class ?classis}.OPTIONAL{dbr:' +
        name + ' dbo:phylum ?phylum}.OPTIONAL{dbr:' + name + ' dbp:ordo ?order}.OPTIONAL{dbr:' +
        name + ' dbp:familia ?family}.OPTIONAL{dbr:' + name + ' dbo:genus ?genus}}';
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
    if (sessionStorage.getItem('lang') == 'gr') {
        msg = 'Υπήρξε πρόβλημα με την ανάκτηση των δεδομένων.Ανανεώστε τη σελίδα.';
    } else {
        msg = 'There was a problem getting the data. Refresh page.';
    }
    bootbox.alert(msg);
}