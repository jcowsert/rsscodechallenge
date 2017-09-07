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



$(document).ready(function() {
    
    $("#getFeed").submit(displayRssFeed);
    
});

function displayRssFeed(event){
    event.preventDefault();
    $('#rssFeed').empty();
    var feedurl =  $("input[name='feedUrl']").val();
 
    $.YQL("select * from feed where url='"+feedurl+"'", function (data) {
            // parse response data
                
                var feed = data.query.results.item;
                console.log(feed);
                
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
                        rssMarkup += '<img src = ' +feed[i].enclosure.url +'<br />'
                        rssMarkup += feed[i].pubDate +'<br />'
                        rssMarkup += '<a href="' + feed[i].link + '">'
                        rssMarkup += feed[i].title + '</a><br />'
                        rssMarkup += feed[i].description + '</p>'
                        $('#rssFeed').append(rssMarkup)
                        imgcounter++;
                        }
                }
                
            }
                

                console.log(feed.sort(function(a,b){
                    return new Date(a.pubDate).getTime()- new Date(b.pubDate).getTime()
                }))

                var earliestDate = feed[0].pubDate;
                var latestDate = feed[feed.length-1].pubDate;

                console.log(earliestDate);
                console.log(latestDate);

                dateFormat.masks.formatThis = 'yyyy-mm-dd hh:mm'
                
                //format earliest date
                var now = new Date(earliestDate);
                earliestDate = now.format("formatThis");
                console.log(earliestDate)
                $("#overviewReport").html('<p>Earliest Date: '+earliestDate+'</p>')
                
                //format latest date
                var now = new Date(latestDate);
                latestDate = now.format('formatThis');
                $("#overviewReport").append('<p>Latest Date: '+latestDate+'</p>');
                //write initial RSS date to webpage   
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
                    rssMarkup += '<img src = ' +feed[i].enclosure.url +'<br />'
                    rssMarkup += feed[i].pubDate +'<br />'
                    rssMarkup += '<a href="' + feed[i].link + '">'
                    rssMarkup += feed[i].title + '</a><br />'
                    rssMarkup += feed[i].description + '</p>'
                    $('#rssFeed').append(rssMarkup)
                    imgcounter++;
                    }
            }

                $("#overviewReport").append('<p>Number of Articles: '+feed.length+'</p>');
                $("#overviewReport").append('<p>Articles with Images: '+imgcounter+'</p>');
                
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
                    function compare(a,b){
                        const descriptionA = a.description.toUpperCase();
                        const descriptionB = b.description.toUpperCase();
        
                        let comparison = 0;
        
                        if (descriptionA > descriptionB){
                            comparison = 1;
                        } else if (descriptionA <descriptionB){
                            comparison = -1
                        }
                        return comparison;
                    }
                    feed.sort(compare);
                    writeRssFeed();
                   }
                   else if (currentValue ==="title"){
                    $("#rssFeed").html('');
                    function compare(a,b){
                        const titleA = a.title.toUpperCase();
                        const titleB = b.title.toUpperCase();
        
                        let comparison = 0;
        
                        if (titleA > titleB){
                            comparison = 1;
                        } else if (titleA <titleB){
                            comparison = -1
                        }
                        return comparison;
                    }
                    feed.sort(compare);
                    writeRssFeed();

                   }
                });
                
        });
    
        return false;
}