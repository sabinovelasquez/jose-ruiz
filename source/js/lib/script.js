"use-strict";

var gsheet = '1oojR3DLLsh6qOmn5Nm_Xl7yzSiPBAaFpccsx8E6Ez-8',
    url = 'https://spreadsheets.google.com/feeds/list/' + gsheet + '/od6/public/values?alt=json',
    casos = [],
    categories = [],
    masonry_pics = [],
    coverPics = [],
    rotatePic = 4,
    count = 0,
    totalPics = 0,
    reachedTop = 0,
    picInterval,
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
var Category = function() {
    name = this.name;
    clean = this.clean;
}

var ellipsis = "...";

function TrimLength(text, maxLength) {
    text = $.trim(text);

    if (text.length > maxLength) {
        text = text.substring(0, maxLength - ellipsis.length)
        return text.substring(0, text.lastIndexOf(" ")) + ellipsis;
    }else{
        return text;
    }
}

function cleanText(input) {
    return input.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function swapPic(){
    var rand = Math.floor(Math.random() * 8 );
    var randPic = Math.floor(Math.random() *coverPics.length );
    var newPic = coverPics[randPic];
    $('img#cp_'+rand).attr('src', newPic);
    $('.grid').masonry('layout');
}

function getCase(key){
    var caso = casos[key];
    $('#caso-title').text(caso.name);
    $('#modal-casos .caso-info').empty();
    $('#modal-casos ol').empty();
    $(caso.photos).each(function(index, photo){
        var img_src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + '_b.jpg';
        var li = '<li data-target = "#modal-casos" data-slide-to = "'+index+'" ></li>';
        var name = '<h3 class="text-center">'+photo.title+'</h3>';
        var item = '<div class="item">';
        item += '<div class="col-xs-12 col-sm-12 col-lg-12">';
        item += '<img class="img-responsive center-block" src="'+img_src+'" alt="'+photo.name+'" />';
        item += '</div><!--.col-->';
        item += '<div class="col-xs-12 col-sm-12 col-lg-12">';
        item += '</div><!--.col-->';
        item += '</div><!--.item-->';
        
        $('#modal-casos ol').append(li);
        $('#modal-casos .caso-info').append(item);
    });
    $('#modal-casos .caso-info .item').first().addClass('active');
    $('#modal-casos ol li').first().addClass('active');
}

function getCover(caso, key){
    
    var apiurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6d578cf191cfbff7d715f5ee286784b8&photo_id='+key+'&format=json&nojsoncallback=1';
    
    $.getJSON(apiurl, function(data){
        caso.cover = data.sizes.size[10].source;
    });

}

function masonry(){

    console.warn('loading masonry...');

    masonry_pics = _.flatten(masonry_pics);
    masonry_pics = _.shuffle(masonry_pics);

    var grid = '';
    totalPics = masonry_pics.length;

    $(masonry_pics).each(function(index, item){
        var pic = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
        coverPics.push(pic);
        grid += '<div class="grid-item"> <img id="cp_' + index + '" src = "' + pic + '" /> </div>'; 
    });

    // for ( var i = 0; i<10; i++ ){

    //     var pic = 'http://farm' + masonry_pics[i].farm + '.static.flickr.com/' + masonry_pics[i].server + '/' + masonry_pics[i].id + '_' + masonry_pics[i].secret + '.jpg';
    //     grid += '<div class="grid-item"> <img src = "' + pic + '" alt = "' + masonry_pics[i].title + '" /> </div>'; 

    // }

    $('.grid').append(grid);
    $('.grid').imagesLoaded( function(){
        $('.grid').removeClass('invisible')
        $('.grid').masonry({
            itemSelector: '.grid-item'
        });
        var offset = $('.grid').height();
        var headerH = $('#slider').height();
        // $('.grid').addClass('motion');
        // $('.motion').css({ 'top': - (offset-headerH) });
        // $('.motion').on('transitionend webkitTransitionEnd', function(e){
        //     if(reachedTop != 0){
        //         reachedTop = 0;
        //         $('.motion').css({ 'top': - (offset-headerH) });
        //     }else{
        //         reachedTop = 1;
        //         $('.motion').css({ 'top': 0 });
        //     }
            
        // });
    });
    picInterval = setInterval(swapPic, rotatePic*1000)
    console.warn('masonry loaded.');
}

function FlickrPhotoSet(albumId, caso, template){
    var apiCall = 'https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id='+albumId+'&per_page=50&page=1&api_key=6d578cf191cfbff7d715f5ee286784b8&jsoncallback=?';
    $.getJSON(apiCall, function(data){
        caso.photos = data.photoset.photo;
    }).done(function(){
        count ++;
        masonry_pics.push(caso.photos);
        var bg = "http://farm" + caso.photos[0].farm + ".static.flickr.com/" + caso.photos[0].server + "/" + caso.photos[0].id + "_" + caso.photos[0].secret;
        getCover(caso, caso.photos[0].id);
        template.find('.bg').css({'background-image':'url("'+bg+'.jpg")'});
        if(casos.length == count){
            masonry();
        }
    });
};

function makeCases(){
    $(casos).each(function(index, item){

        var category = new Category();

        category.name = item.category;
        category.clean = cleanText(item.category);

        var exist = _.findIndex(categories, function(cat) {
            return cat.name == category.name;
        });

        if(exist < 0 ){
            categories.push(category);
        }
        

        var template = $('#caso-template').clone().removeAttr('id');
        template.find('.hover').attr('data' , index);
        template.find('.title h3').text(item.name);
        template.find('.desc p').text(TrimLength(item.description, 100));
        template.addClass(category.clean);
        template.appendTo('#gal');
        FlickrPhotoSet(item.flickrId, item, template);
    });

    $(categories).each(function(index, item){
        var tag = '<a class="btn btn-default btn-sm" data="'+item.clean+'"><i class="fa fa-tag"></i>'+item.name+'</a>';
        $('#tags').append(tag);
    });


    $('#tags a').click(function(){
        var filter = $(this).attr('data');
        $('.item').addClass('invisible');
        $('.'+filter).removeClass('invisible');
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
        if(caso.published == 1){
            casos.push(caso);
        }
        
    });
    makeCases();
});
