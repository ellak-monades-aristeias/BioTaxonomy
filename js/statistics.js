  var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
  

function totalQuerySuccess(_data){

	var totalCount=0;
var data =[];
var dbpedia_results = _data.results.bindings;
for (var j in dbpedia_results) {
	
        var name = nameFromUrl(dbpedia_results[j].order.value);
        var count = dbpedia_results[j].count.value;
		totalCount=totalCount+parseInt(count);
        name = name.replace("_", ' ');
		if (name==sessionStorage.getItem('title')){
			var currRanking=parseInt(j)+1;
			var currCount=count;
		}
		data.push({value: count,color:randomColorGenerator(),highlight: randomColorGenerator(),label: '#'+(parseInt(j)+1)+':'+name});
    }
var total=parseInt(j)+1;
$('#totalNumber').html(getPrevRank(sessionStorage.getItem('rank'))+'<b><a href="javascript:showArticle(\''+sessionStorage.getItem('prevRankName')+'\');"> '+sessionStorage.getItem('prevRankName')+'</a></b> has <b>'+total+' '+getPlural(sessionStorage.getItem('rank'))+'</b> with a total of <b>'+totalCount+'</b> members');
$('#current').html('<b>'+sessionStorage.getItem('title')+'</b> is <b>#'+currRanking+'</b> with <b>'+currCount+'</b> members ');
var ctx = $("#myChart").get(0).getContext("2d");
// This will get the first returned node in the jQuery collection.

var myPieChart = new Chart(ctx).Pie(data);	
}
var prevRankName=sessionStorage.getItem('prevRankName');	
var rank =sessionStorage.getItem('rank');
var prevRank=getPrevRank(rank);

query = getTotalQuery(prevRank,prevRankName,rank);
var dbUrl="http://dbpedia.org/sparql"   
    var queryUrl = encodeURI(dbUrl + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: totalQuerySuccess
    });
	
/*	
	var data = [
    {
        value: 300,color:randomColorGenerator(),highlight: randomColorGenerator(),label: "Red"
    },
    {
        value: 50,
        color: randomColorGenerator(),
        highlight: randomColorGenerator(),
        label: "Green"
    },
    {
        value: 100,
        color: randomColorGenerator(),
        highlight: randomColorGenerator(),
        label: "Yellow"
    }
	
];	

*/
function getPlural(word){
	if (word=='phylum')
		return 'phyla'
	else if (word=='class')
		return 'classes'
	else if (word == 'order')
		return 'orders'
	else if (word=='family')
		return families
	else if (word=='genus')
		return 'genera'
	else if (word=='kingdom')
		return 'kingdoms'
}