function getLanguageResources() {
    var gr = new Array(); var en = new Array();
 
    gr['about'] = "�������"; en['about'] = "settings";
    gr['kingdom'] = "��������"; en['kingdom'] = "Kingdom";
    gr['phylum'] = "�����������"; en['phylum'] = "Phylum";
    gr['class'] = "��������"; en['class'] = "Class";
	gr['order'] = "����"; en['order'] = "Order";
	gr['family'] = "����������"; en['family'] = "Family";
	gr['genus'] = "�����"; en['genus'] = "Genus";
	gr['species'] = "�����"; en['species'] = "Species";
	gr['full_article'] = "����� �� ������ �����"; en['full_article'] = "Read full article";
	gr['details'] = "������������"; en['details'] = "Details";
    var resources = new Array();
    resources['gr'] = gr;
    resources['en'] = en;
 
    return resources;
}