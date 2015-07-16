function FlickrPhotoSet(){
    var apiCall = "https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=72157629938135441&per_page=100&page=1&api_key=6d578cf191cfbff7d715f5ee286784b8&jsoncallback=?";
    $.getJSON(apiCall, function(data){
        console.log('get pics');
        $.each(data.photoset.photo, function(index,item){
            console.log(item);
            var img_src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret;
            var dataB = img_src + "_b.jpg";
            var a_href = "http://www.flickr.com/photos/" + data.photoset.owner + "/" + item.id + "/";
            $('<img class="img-responsive center-block" />').attr("src", img_src + '_m.jpg').appendTo("#gal").wrap(('<div class="col-xs-12 col-sm-4 col-lg-3"></div>'));
        });
    });
};
FlickrPhotoSet();