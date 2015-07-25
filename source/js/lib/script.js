"use-strict";

var gsheet = '1oojR3DLLsh6qOmn5Nm_Xl7yzSiPBAaFpccsx8E6Ez-8',
    url = 'https://spreadsheets.google.com/feeds/list/' + gsheet + '/od6/public/values?alt=json',
    casos = [],
    w=0,
    h=0;

var Caso = function(name, description, flickrId, category, published) {
    name = this.name;
    description = this.description;
    flickrId = this.flickrId;
    category = this.category;
    published = this.published;
}

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
    });
};

function makeCases(){
    $(casos).each(function(index, item){

    });
}

$.getJSON(url, function(data) {
    var entry = data.feed.entry;
    $(entry).each(function(index, item){
        var caso = new Caso();
        caso.name = item.gsx$nombre.$t;
        caso.description = item.gsx$descripcion.$t;
        caso.category = item.gsx$categoria.$t;
        caso.flickrId = item.gsx$flickrid.$t;
        caso.published = item.gsx$publicado.$t;
        casos.push(caso);
    });
    makeCases();
});




//FlickrPhotoSet('72157631786914725');