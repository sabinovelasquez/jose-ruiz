
function FlickrPhotoSet(albumId){
    var apiCall = 'https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id='+albumId+'&per_page=100&page=1&api_key=6d578cf191cfbff7d715f5ee286784b8&jsoncallback=?';
    $.getJSON(apiCall, function(data){
        $.each(data.photoset.photo, function(index,item){
            console.log(item);
            var img_src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret;
            var dataB = img_src + "_o.jpg";
            var img = '<div class="col-xs-12 col-sm-4 col-lg-3 item">';
            img += '<a data = "'+dataB+'" ><div class="hover"></div><img class="img-responsive center-block" src="'+img_src+'.jpg" /></a>';
            img += '</div>';
            var a_href = "http://www.flickr.com/photos/" + data.photoset.owner + "/" + item.id + "/";
            $("#gal").append(img);
        });
        $('#gal').imagesLoaded( function(){
            $('#content').isotope({
                itemSelector : '.item'
            });
        });
    });
};
FlickrPhotoSet('72157631622073873');