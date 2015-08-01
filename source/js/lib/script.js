"use-strict";

var gsheet = '1oojR3DLLsh6qOmn5Nm_Xl7yzSiPBAaFpccsx8E6Ez-8',
    url = 'https://spreadsheets.google.com/feeds/list/' + gsheet + '/od6/public/values?alt=json',
    casos = [],
    w=0,
    h=0;

var Caso = function() {
    name = this.name;
    description = this.description;
    flickrId = this.flickrId;
    category = this.category;
    published = this.published;
    photos = this.photos;
}

var Album = function (){

    // $.each(data.photoset.photo, function(index,item){
    //     console.log(item);
    //     var img_src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret;
    //     var dataB = img_src + "_o.jpg";
    //     var img = '<div class="col-xs-12 col-sm-4 col-lg-3 item">';
    //     img += '<a data = "'+dataB+'" ><div class="hover"></div><img class="img-responsive center-block" src="'+img_src+'.jpg" /></a>';
    //     img += '</div>';
    //     var a_href = "http://www.flickr.com/photos/" + data.photoset.owner + "/" + item.id + "/";
    //     $("#gal").append(img);
    // });
}

function getCase(key){
    var caso = casos[key];
    $('#caso-title').text(caso.name);
    $('#modal-casos .caso-info').empty();
    $('#modal-casos ol').empty();
    $(caso.photos).each(function(index, photo){
        var active = '';
        if(index == 0){
            active = 'active';
        }
        var img_src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + '_b.jpg';
        var li = '<li class="'+active+'" data-target = "#modal-casos" data-slide-to = "'+index+'" ></li>';
        var item = '<div class="item '+active+'">';
        item += '<div class="col-xs-12 col-sm-12 col-lg-6">';
        item += '<img class="img-responsive" src="'+img_src+'" alt="'+photo.name+'" />';
        item += '</div><!--.col-->';
        item += '<div class="col-xs-12 col-sm-12 col-lg-6">';
        item += '<h3 class="text-center">'+photo.title+'</h3>';
        item += '</div><!--.col-->';
        item += '</div><!--.item-->';
        
        $('#modal-casos ol').append(li);
        $('#modal-casos .caso-info').append(item);
    });
}

function FlickrPhotoSet(albumId, caso, template){
    var apiCall = 'https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id='+albumId+'&per_page=100&page=1&api_key=6d578cf191cfbff7d715f5ee286784b8&jsoncallback=?';
    $.getJSON(apiCall, function(data){
        caso.photos = data.photoset.photo;
    }).done(function(){
        var bg = "http://farm" + caso.photos[0].farm + ".static.flickr.com/" + caso.photos[0].server + "/" + caso.photos[0].id + "_" + caso.photos[0].secret;
        console.log( bg );
        template.find('.bg').css({'background-image':'url("'+bg+'.jpg")'});
    });
};

function makeCases(){
    $(casos).each(function(index, item){
        var template = $('#caso-template').clone().removeAttr('id');
        template.find('.hover').attr('data' , index);
        template.find('.title h3').text(item.name);
        template.find('.desc p').text(item.description);
        template.appendTo('#gal');
        FlickrPhotoSet(item.flickrId, item, template);
    });
    $('.hover').click(function(){
        var key = $(this).attr('data');
        getCase(key);
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
