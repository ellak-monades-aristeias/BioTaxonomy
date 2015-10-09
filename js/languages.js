function getLanguageResources() {
    var gr = new Array(); var en = new Array();
 
    gr['about'] = "Σχετικά"; en['about'] = "About";
    gr['kingdom'] = "Βασίλειο"; en['kingdom'] = "Kingdom";
    gr['phylum'] = "Συνομοταξία"; en['phylum'] = "Phylum";
    gr['class'] = "Ομοταξία"; en['class'] = "Class";
	gr['order'] = "Τάξη"; en['order'] = "Order";
	gr['family'] = "Οικογένεια"; en['family'] = "Family";
	gr['genus'] = "Γένος"; en['genus'] = "Genus";
	gr['species'] = "Είδος"; en['species'] = "Species";
  
    gr['kingdomPlural'] = "Βασίλεια"; en['kingdomPlural'] = "Kingdoms";
    gr['phylumPlural'] = "Συνομοταξίες"; en['phylumPlural'] = "Phyla";
    gr['classPlural'] = "Ομοταξίες"; en['classPlural'] = "Classes";
	gr['orderPlural'] = "Τάξεις"; en['orderPlural'] = "Orders";
	gr['familyPlural'] = "Οικογένειες"; en['familyPlural'] = "Families";
	gr['genusPlural'] = "Γένη"; en['genusPlural'] = "Genera";
	gr['speciesPlural'] = "Είδη"; en['speciesPlural'] = "Species";
  
	gr['full_article'] = "Δείτε το πλήρες άρθρο"; en['full_article'] = "Read full article";
	gr['details'] = "Λεπτομέρειες"; en['details'] = "Details";
   	gr['plant'] = "Φυτό"; en['plant'] = "Plant";
   	gr['animal'] = "Ζώο"; en['animal'] = "Animal";
    gr['return'] = "Επιστροφή"; en['return'] = "Return";
   gr['wikiPage'] = "Σελίδα της Wikipedia"; en['wikiPage'] = "Wikipedia Page"; 
   gr['articleTo'] = "Το"; en['articleTo'] = ""; 
   gr['articleΗ'] = "H"; en['articleΗ'] = ""; 
    gr['has'] = "έχει"; en['has'] = "has"; 
    gr['withTotal'] = "με σύνολο"; en['withTotal'] = "with a total of"; 
    gr['members'] = "μέλη"; en['members'] = "members"; 
	gr['noResults'] = "Κανένα αποτέλεσμα!"; en['noResults'] = "No results!"; 
    
   
    var resources = new Array();
    resources['gr'] = gr;
    resources['en'] = en;
 
    return resources;
}

function treeToGreek(container){
	console.log("in maketRe");
 var nameList=[];
			 	$(container).find('.caption>p[caption]').each(function() {
		nameList.push($( this ).attr('caption'));
});
   var queryUrl = returnGreekNameQuery(nameList);

    $.ajax({
       // type: "GET",
        dataType: "jsonp",
        url: queryUrl,
		container:container,
        success:greekSuccess 
    });
	
	
}

function greekSuccess(_data){
	
 //changeLanguage('gr');

var results = _data.query.pages; 

	
        for (var i in results) {
			
		if (results[i].langlinks != undefined){
		
		
		var greekName=results[i].langlinks[0][Object.keys(results[i].langlinks[0])[1]];
		$( "p[caption='"+results[i].title+"']" ).html(greekName);
		}else{
			$( "p[caption='"+results[i].title+"']" ).html(results[i].title);	
		
		}	
			
		}
 $(this.container).find('.caption p').quickfit();	
}	
	

function changeLanguage(lang) {
	
	$('html').attr('lang',lang);
 
	
	if (lang=='gr'){
		console.log('sdf');
	treeToGreek('#tree_container');
	}else{
		
		$('#tree_container').find('.caption p').each(function() {
		
$( this ).html($( this ).attr('caption')) ;
});

$('#tree_container').find('.caption p').quickfit();
	}
	
   var langResources = getLanguageResources()[lang];
	sessionStorage.setItem('lang', lang);

    $("span[name='lbl']").each(function (i, elt) {
        $(elt).text(langResources[$(elt).attr("caption")]);
    });
		
}

//todo na allazoun ta onomata otan kapoios allazei glwssa


// na allaxw kai to placeholder <input class="form-control" id="searchBox"
//                                    placeholder="Search" type="text">
//<span name="lbl" caption="about"></span>
