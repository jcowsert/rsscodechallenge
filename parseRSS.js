(function($) {
    $.YQL = function(query, callback) {

        if (!query || !callback) {
            throw new Error('$.YQL(): Parameters may be undefined');
        }

        var encodedQuery = encodeURIComponent(query.toLowerCase()),
            url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&callback=?';

        $.getJSON(url, callback);
    };
})($);



var titleSort = function(ascending){
    
      return function(a,b){ 
    
        if(a.title === null){
          return 1;
        }
        else if(b.title === null){
          return -1;
        }
        else if(a.title === b.title){
          return 0;
        }
        else if(ascending) {
          return a.title < b.title ? -1 : 1;
        }
        else if(!ascending) {
          return a.title < b.title ? 1 : -1;
        }
      };
    }

var descriptionSort = function(ascending){
    
        return function(a,b){ 
    
        if(a.description === null){
            return 1;
        }
        else if(b.description === null){
            return -1;
        }
        else if(a.description === b.description){
            return 0;
        }
        else if(ascending) {
            return a.description < b.description ? -1 : 1;
        }
        else if(!ascending) {
            return a.description < b.description ? 1 : -1;
        }
        };
    }



$(document).ready(function() {
    
    $("#getFeed").submit(displayRssFeed);
   
});

function displayRssFeed(event){
    event.preventDefault();
    $('#rssFeed').empty();
    $('#overviewReport, #title').empty();
    $('#title').append('<h1>Articles<h1>');
    
    var feedurl =  $("input[name='feedUrl']").val();
 
    $.YQL("select * from feed where url='"+feedurl+"'", function (data) {
            // parse response data
                
                var feed = data.query.results.item;
                
                //writes feed info to RSS Div
                function writeRssFeed(){
                    var imgcounter = 0
                    for (var i=0; i<feed.length; i++){
                        //test if has images
                        var rssMarkup = '<p>'
                        if(typeof feed[i].enclosure === 'undefined'){
                            rssMarkup += feed[i].pubDate +'<br />'
                            rssMarkup += '<a href="' + feed[i].link + '">'
                            rssMarkup += feed[i].title + '</a><br />'
                            rssMarkup += feed[i].description + '</p>' 
                            $('#rssFeed').append(rssMarkup)
                        }
                        else {
                            //if it has images 
                        rssMarkup += '<img src = ' +feed[i].enclosure.url
                        rssMarkup += feed[i].pubDate +'<br />'
                        rssMarkup += '<a href="' + feed[i].link + '">'
                        rssMarkup += feed[i].title + '</a><br />'
                        rssMarkup += feed[i].description + '</p>'
                        $('#rssFeed').append(rssMarkup)
                        imgcounter++;
                        }
                }
                
                }
                
                
                

                feed.sort(function(a,b){
                    return new Date(a.pubDate).getTime()- new Date(b.pubDate).getTime()
                })

                var earliestDate = feed[0].pubDate;
                var tempDateLast = feed[feed.length-1].pubDate;

                if (tempDateLast == null){
                    var negCounter = 1;
                    while(feed[feed.length-negCounter].pubDate == null){
                        
                        negCounter++ 
                        var latestDate = feed[feed.length-negCounter].pubDate
                        
                        
                        
                        
                    }
                }
                else {latestDate = tempDateLast;}
                console.log(earliestDate);
                console.log(latestDate);

                dateFormat.masks.formatThis = 'yyyy-mm-dd hh:mm'
                
                //format earliest date
                var now = new Date(earliestDate);
                earliestDate = now.format("formatThis");
                console.log(earliestDate)

                $("#overviewReport").append('<h1>RSS Link Overview</h1>')
                
                
                //format latest date
                var now = new Date(latestDate);
                latestDate = now.format('formatThis');
                console.log(latestDate);
                //write initial RSS date to webpage   
                var imgcounter = 0

                
                writeRssFeed();

                $("#overviewReport").append('<p>Number of Articles: '+feed.length+'</p>');
                $("#overviewReport").append('<p>Articles with Images: '+imgcounter+'</p>');
                $("#overviewReport").append('<p>Earliest Published Date: '+earliestDate+'</p>')
                $("#overviewReport").append('<p>Latest Published Date: '+latestDate+'</p>');
                
                //clear feedUrl after sending data
                $('#feedUrl').val('');

                //sort by selection 
                $("select").change(function(){
                   var currentValue = this.value;
                   if (currentValue=== "date"){
                    $("#rssFeed").html('');
                    feed.sort(function(a,b){
                        return new Date(a.pubDate).getTime()- new Date(b.pubDate).getTime()                 
                    })
                    writeRssFeed();
                 } 
                   else if (currentValue ==="description"){
                    $("#rssFeed").html('');
                    feed.sort(descriptionSort(true));
                    writeRssFeed();
                   }
                   else if (currentValue ==="title"){
                    $("#rssFeed").html('');
                    feed.sort(titleSort(true));
                    writeRssFeed();

                   }
                });
                
        });
    
        return false;
}

