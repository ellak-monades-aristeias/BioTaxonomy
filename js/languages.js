function getLanguageResources() {
    var gr = new Array(); var en = new Array();
 
    gr['about'] = "Σχετικά"; en['about'] = "settings";
    gr['kingdom'] = "Βασίλειο"; en['kingdom'] = "Kingdom";
    gr['phylum'] = "Συνομοταξία"; en['phylum'] = "Phylum";
    gr['class'] = "Ομοταξία"; en['class'] = "Class";
	gr['order'] = "Τάξη"; en['order'] = "Order";
	gr['family'] = "Οικογένεια"; en['family'] = "Family";
	gr['genus'] = "Γένος"; en['genus'] = "Genus";
	gr['species'] = "Είδος"; en['species'] = "Species";
	gr['full_article'] = "Δείτε το πλήρες άρθρο"; en['full_article'] = "Read full article";
	gr['details'] = "Λεπτομέρειες"; en['details'] = "Details";
    var resources = new Array();
    resources['gr'] = gr;
    resources['en'] = en;
 
    return resources;
}