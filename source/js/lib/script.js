"use-strict";

var gsheet = '1oojR3DLLsh6qOmn5Nm_Xl7yzSiPBAaFpccsx8E6Ez-8',
    url = 'https://spreadsheets.google.com/feeds/list/' + gsheet + '/od6/public/values?alt=json',
    casos = [],
    masonry_pics = [],
    count = 0,
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

function getCase(key){
    var caso = casos[key];
    $('#caso-title').text(caso.name);
    $('#modal-casos .caso-info').empty();
    $('#modal-casos ol').empty();
    $(caso.photos).each(function(index, photo){
        var img_src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + '_b.jpg';
        var li = '<li data-target = "#modal-casos" data-slide-to = "'+index+'" ></li>';
        var item = '<div class="item">';
        item += '<div class="col-xs-12 col-sm-12 col-lg-6">';
        item += '<img class="img-responsive center-block" src="'+img_src+'" alt="'+photo.name+'" />';
        item += '</div><!--.col-->';
        item += '<div class="col-xs-12 col-sm-12 col-lg-6">';
        item += '<h3 class="text-center">'+photo.title+'</h3>';
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

    $(masonry_pics).each(function(index, item){
        var n_width = '';
        if(index % 2 != 0){
            //n_width = 'grid-item--width2';
        }
        var pic = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
        grid += '<div class="grid-item ' + n_width + '"> <img src = "' + pic + '" alt = "' + item.title + '" /> </div>'; 
    });
    $('.grid').append(grid);
    $('.grid').imagesLoaded( function(){
        $('.grid').removeClass('invisible')
        $('.grid').masonry({
            itemSelector: '.grid-item'
        });
        var offset = $('.grid').height();
        var headerH = $('.slider').height();
        //console.log(offset);
        $('.grid').addClass('motion');
        $('.motion').css({ 'top': - (offset-headerH) });
    });

    
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

(function($) {
$.fn.randomize = function(childElem) {
  return this.each(function() {
      var $this = $(this);
      var elems = $this.children(childElem);

      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

      $this.remove(childElem);  

      for(var i=0; i < elems.length; i++)
        $this.append(elems[i]);      

  });    
}
})(jQuery);
