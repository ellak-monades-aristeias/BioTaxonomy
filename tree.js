$(".open").click(function(){
console.log("in open")
     var id = this.id;
   var name =$(this).parents('div:eq(1)').attr('id');  //get id of parent's parent
   var rank =$(this).parents('div:eq(2)').attr('id'); 
   var next_rank=$( "#"+rank ).next().attr('id')
var query="PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon WHERE { ?name  dbo:"+rank+" dbr:"+name+";dbo:"+next_rank+" ?taxon;rdf:type ?type.FILTER (?type=dbo:Animal)  }";
// var query="PREFIX db: <http://dbpedia.org/resource/> SELECT DISTINCT ?taxon WHERE { ?name  dbo:kingdom dbr:Animal;dbo:phylum ?taxon;rdf:type ?type.FILTER (?type=umbel-rc:Animal)  }";
  //  var query = "PREFIX db: <http://dbpedia.org/resource/> SELECT ?name WHERE { ?name  dbp:genus \"Felis\"@en .FILTER (?name!=dbr:Felis)}";
    
  executeQuery(query,next_rank,name)
});
   
function executeQuery(query,rank,name)    {
var url = "http://dbpedia.org/sparql"; 
  console.log("rank is "+rank);
    var queryUrl = encodeURI( url+"?query="+query+"&format=json" );
    $.ajax({
        dataType: "jsonp",  
        url: queryUrl,
        rank:rank,
        success: function( _data ) {
             console.log(this.rank);
            var results = _data.results.bindings;
              console.log("rank is"+this.rank);
            for ( var i in results ) {
                var src = results[i].taxon.value;
                var value = src.substring(src.lastIndexOf('/') + 1);
                value = value.replace(/\_/g, ' ');
                
               var html='   <div class=\"thumbnail\" id=\"'+value+'\">'+
  '<img src=\"...\" alt=\"...\"> '+
      '<div class=\"caption\"> ' +value+
        
       ' <p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Λεπτομέρειες</a> <a href=\"#\" class=\"btn btn-primary open\" role=\"button\"> Aνοιγμα</a></p>    '+
     ' </div>   ' +
   ' </div>';
                
                
                
                
                $("#"+rank).append(html);
               
                //na katharizei ta ranks pou einai epomena apo to paron rank
            }
            
            
        }
    });
    
    }