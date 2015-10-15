function getLanguageResources() {
    var gr = new Array();
    var en = new Array();
    gr['about'] = "Σχετικά";
    en['about'] = "About";
    gr['kingdom'] = "Βασίλειο";
    en['kingdom'] = "Kingdom";
    gr['phylum'] = "Συνομοταξία";
    en['phylum'] = "Phylum";
    gr['class'] = "Ομοταξία";
    en['class'] = "Class";
    gr['order'] = "Τάξη";
    en['order'] = "Order";
    gr['family'] = "Οικογένεια";
    en['family'] = "Family";
    gr['genus'] = "Γένος";
    en['genus'] = "Genus";
    gr['species'] = "Είδος";
    en['species'] = "Species";
    gr['kingdomPlural'] = "Βασίλεια";
    en['kingdomPlural'] = "Kingdoms";
    gr['phylumPlural'] = "Συνομοταξίες";
    en['phylumPlural'] = "Phyla";
    gr['classPlural'] = "Ομοταξίες";
    en['classPlural'] = "Classes";
    gr['orderPlural'] = "Τάξεις";
    en['orderPlural'] = "Orders";
    gr['familyPlural'] = "Οικογένειες";
    en['familyPlural'] = "Families";
    gr['genusPlural'] = "Γένη";
    en['genusPlural'] = "Genera";
    gr['speciesPlural'] = "Είδη";
    en['speciesPlural'] = "Species";
    gr['full_article'] = "Δείτε το πλήρες άρθρο";
    en['full_article'] = "Read full article";
    gr['details'] = "Λεπτομέρειες";
    en['details'] = "Details";
    gr['plant'] = "Φυτό";
    en['plant'] = "Plant";
    gr['animal'] = "Ζώο";
    en['animal'] = "Animal";
    gr['return'] = "Επιστροφή";
    en['return'] = "Return";
    gr['wikiPage'] = "Σελίδα της Wikipedia";
    en['wikiPage'] = "Wikipedia Page";
    gr['articleTo'] = "Το";
    en['articleTo'] = "";
    gr['articleH'] = "H";
    en['articleH'] = "";
    gr['has'] = "έχει";
    en['has'] = "has";
    gr['withTotal'] = "με σύνολο";
    en['withTotal'] = "with a total of";
    gr['members'] = "μέλη";
    en['members'] = "members";
    gr['noResults'] = "Κανένα αποτέλεσμα!";
    en['noResults'] = "No results!";
    gr['is']="είναι";
    en['is']="is";
    gr['with']="με";
    en['with']="with";
 
    var resources = new Array();
    resources['gr'] = gr;
    resources['en'] = en;
    return resources;
}

function treeToGreek(container) {
    var nameList = [];
    $(container).find('.caption>p[caption]').each(function() {
        nameList.push($(this).attr('caption'));
    });
    fiftyCounter = Math.floor(nameList.length / 50);
    for (i = 0; i <= fiftyCounter; i++) {
        fiftyNameList = nameList.slice(i * 50, (i * 50) + 50);
        var queryUrl = returnGreekNameQuery(fiftyNameList);
		
        $.ajax({
            // type: "GET",
            dataType: "jsonp",
            url: queryUrl,
            container: container,
            success: greekSuccess,
            error: ajaxError
        });
    }
}

function greekSuccess(_data) {
	
	
    var results = _data.query.pages;
    for (var i in results) {
        if (results[i].langlinks != undefined) {
            var greekName = results[i].langlinks[0][Object.keys(results[i].langlinks[0])[1]];
               
            $("p[caption='" + results[i].title + "']").html(greekName);
        } else {
            $("p[caption='" + results[i].title + "']").html(results[i].title);
        }
    }
    $(this.container).find('.caption p').quickfit();
	
}

function changeLanguage(lang) {
        $('html').attr('lang', lang);
        $("a:contains('en')").removeClass("not-active");
        $("a:contains('gr')").addClass("not-active");
        var currPage = getCurrPage();
        if (lang == 'gr') {
            $("a:contains('en')").attr('id', ' ');
            $("a:contains('gr')").attr('id', 'langNotActive');
            if (currPage == 'index.html') {
                treeToGreek('#tree_container');
                $('#tree_container').find('.caption p').quickfit();
            }
        } else {
            $("a:contains('gr')").attr('id', ' ');
            $("a:contains('en')").attr('id', 'langNotActive');
            if (currPage == 'index.html') {
                $('#tree_container').find('.caption p').each(function() {
                    $(this).html($(this).attr('caption'));
                });
                $('#tree_container').find('.caption p').quickfit();
            }
        }
        if (currPage == 'article.html') {
            if ((lang == 'gr') && (sessionStorage.getItem('name') !=
                sessionStorage.getItem('greekName'))) {
                 console.log("first one");
                $('#title').html(sessionStorage.getItem('greekName'));
                $('#wikiLink').attr('href', 'https://el.wikipedia.org/wiki/' +
                    (sessionStorage.getItem('greekName')).replace(' ', '_')
                );
                $('#article').wikiblurb({
                    wikiURL: "http://el.wikipedia.org/",
                    section: 0,
                    page: sessionStorage.getItem('greekName'),
                });
                console.log("before greek");
                $('#statName').html(sessionStorage.getItem('greekName'));

                getGreekName($('#statPrevRank').attr('caption'));
                
                console.log(sessionStorage.getItem('greekName'));
                
            } else {
                 $('#statName').html(sessionStorage.getItem('name'));
                  $('#statPrevRank').html($('#statPrevRank').attr('caption'));
                $('#title').html(sessionStorage.getItem('name'));
                $('#wikiLink').attr('href', 'https://en.wikipedia.org/wiki/' +
                    (sessionStorage.getItem('name')).replace(' ', '_'));
                $('#article').wikiblurb({
                    section: 0,
                    page: sessionStorage.getItem('name'),
                });
                $('#statName').html(sessionStorage.getItem('name'));
            }
        }
        
        
        var langResources = getLanguageResources()[lang];
        sessionStorage.setItem('lang', lang);
        $("span[name='lbl']").each(function(i, elt) {
            $(elt).text(langResources[$(elt).attr("caption")]);
        });
		
	
    }
 
 function getGreekName(name) {
  var queryUrl = returnOneGreekNameQuery(name);
  $.ajax({
    // type: "GET",
    dataType: "jsonp",
    url: queryUrl,
    name: name,
    success: greekNameSuccess,
    error: ajaxError
  });
  //return obj.closest('.thumbnail').find('.caption>p[caption]').html()
}
function greekNameSuccess(_data) {
    var currPage = getCurrPage();
    var results = _data.query.pages;
    for (var i in results) {
      if (results[i].langlinks !== undefined) {
        if (currPage == 'article.html') {
          $('#statPrevRank').html(results[i].langlinks[0][
            Object.keys(results[i].langlinks[0])[1]
          ]);
        } else {
          sessionStorage.setItem('greekName', results[i].langlinks[0][
            Object.keys(results[i].langlinks[0])[1]
          ]);
        }
      } else {
        if (currPage == 'article.html') {
          $('#statPrevRank').html(this.name);
        } else {
          sessionStorage.setItem('greekName', this.name);
        }
      }
    }
 
  
 
  
  console.log("in query"+sessionStorage.getItem('greekName'));
} 