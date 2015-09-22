var url = "http://dbpedia.org/sparql";
$(document).on("click", ".details", function() {

 var animals_html="";
  var name = getName($(this));
  var rank = getRank($(this));
  
  var img_url = $(this).closest('.thumbnail').find('img').attr('src'); 

var title = $(this).closest('.thumbnail').find('.caption').children().first().text();   
  
 query= getImportantQuery(rank,name);
 console.log("details "+query); 


    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        data:{img_url:img_url,title:title},
        success: function(_data) {
			animals_html="";
  var a=0;
   var k=0;  
   var array=[];  
       
            var dbpedia_results = _data.results.bindings;
         
           var wikirank_results = jsonObject.items;
           for (var j in dbpedia_results) {
                var src2 = dbpedia_results[j].name.value;
                   var name = nameFromUrl(src2);
                    name = name.replace("_", ' ');
                  array[j]=name;
                    
                }    
          
               
                for (var i in wikirank_results) {
                
                    var src = $.trim(wikirank_results[i].n);
                 
           if($.inArray(src, array)>-1){
           
           k++;
           var thumb = dbpedia_results[$.inArray(src, array)].thumb.value;
           animals_html=animals_html+" <li><div class='span1'><img src='"+thumb+"'width='50px' ><p>"+src+"</p></div></li>" ;
           
           }
               
              if(k>6)
              break;

                }
 makeDialog(title,img_url,animals_html);       
        

        }
    });
              


 

});



$(document).on("click", ".open", function() {

  
   
      var name = getName($(this));
  var rank = getRank($(this));
    var next_rank = $("#" + rank).next().attr('id') //get the next rank
  
  query=getOpenQuery(name,rank,next_rank);
    executeQuery(query, next_rank, name);
});

function executeQuery(query, rank, name) {
    

    var queryUrl = encodeURI(url + "?query=" + query + "&format=json");
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        rank: rank,
        success: function(_data) {

            $("#" + rank).nextAll().andSelf().html(""); // clear data of next ranks before adding new data
            var results = _data.results.bindings;
            if (results.length > 0) {  
                for (var i in results) {
                    var src = results[i].taxon.value;
                    var name = nameFromUrl(src);
                    
                    
                    var thumb_url = results[i].thumb.value;
                    var html=thumbHtml(name,thumb_url);

                
                    $("#" + rank).append(html);


                }
            } else {

                $("#" + rank).append("</br>No results!");
            }


        }
    });

}
//Helper functions
function getName(obj){
  return name = obj.parents('div:eq(1)').attr('id'); //get name of taxon

}
function getRank(obj){
  return rank = obj.parents('div:eq(2)').attr('id'); 
}
function makeDialog(title,img_url,animals_html){      
         $("body").append('<div id="dialog"  ><div class="container-fluid">   <div class="row"><div class="span7">'+title+'</div><div class="row "><div class="span7"><img src="'+img_url+'"width="200px"></div></div><div class="span6"><div class="row"><ul class="list-inline">'+animals_html+'</ul></div></div></div></div></div>');
  $( "#dialog" ).dialog({
 width: 700,
  height: 400 ,
  close: function( event, ui ) {
  $( "#dialog" ).remove();
  }
 
}); 
}

function thumbHtml(name,thumb_url){
return html = '   <div class=\"thumbnail\" id=\"' + name + '\">' +
                        '<img src=\"'+thumb_url+'\" alt=\"...\">' +
                        '<div class=\"caption\"><p>' + name +
                        '</p>         <p><a href=\"#\" class=\"btn btn-primary details\" role=\"button\">Λεπτομέρειες</a> <a href=\"#\" class=\"btn btn-primary open\" role=\"button\"> Aνοιγμα</a></p>    ' +
                        '</div>   ' +
                        '</div>';

}

function nameFromUrl(src){
  var name = src.substring(src.lastIndexOf('/') + 1);
  name = name.replace(/\_/g, ' ');
  return name;
}