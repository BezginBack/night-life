var coordinates = {
    lat: null,
    lon: null
};

var yelp_stars = {
    0: "/public/img/yelp_stars/small_0.png",
    1: "/public/img/yelp_stars/small_1.png",
    1.5: "/public/img/yelp_stars/small_1_half.png",
    2: "/public/img/yelp_stars/small_2.png",
    2.5: "/public/img/yelp_stars/small_2_half.png",
    3: "/public/img/yelp_stars/small_3.png",
    3.5: "/public/img/yelp_stars/small_3_half.png",
    4: "/public/img/yelp_stars/small_4.png",
    4.5: "/public/img/yelp_stars/small_4_half.png",
    5: "/public/img/yelp_stars/small_5.png",
};

window.addEventListener('keydown', function(e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
        if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            if($(".middle-middle-row").css('display') == 'none') {
                $(".middle-top-row").fadeOut(750, function(){
                    $(".top-hidden").slideDown(250);
                    $(".middle-middle-row").css('display', 'block');
                    $(".middle").css('display', 'block');
                });
                $(".top").slideUp(1000);
                $(".middle").animate({height: '95%'}, 1000, function () {
                    if($('#get-location i').attr('class') != 'glyphicon glyphicon-record'){
                        var url = '/api/location-coords';
                        var data = {
                            address: charConvert($('#location-input').val())
                        };
                        var wait = function() {
                            $('.page-hidden').css('display', 'block');
                        };
                        var complete = function() {
                            $('.page-hidden').css('display', 'none');
                        };
                        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
                            if(err) {
                                console.log(err);
                            } else {
                                if(res.results[0]){
                                    coordinates.lat = res.results[0].geometry.location.lat;
                                    coordinates.lon = res.results[0].geometry.location.lng;
                                    getResults();
                                    $('#location-input-hidden').val($('#location-input').val());
                                }
                            }
                        }));
                    } else {
                        getResults();
                        $('#location-input-hidden').val($('#location-input').val());
                    }
                });
            } else {
                if($('#get-location-hidden i').attr('class') != 'glyphicon glyphicon-record'){
                    $(".container-body, .container-footer").css('opacity', '0');
                    var url = '/api/location-coords';
                    var data = {
                        address: charConvert($('#location-input-hidden').val())
                    };
                    var wait = function() {
                        $('.page-hidden').css('display', 'block');
                    };
                    var complete = function() {
                        $('.page-hidden').css('display', 'none');
                    };
                    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
                        if(err) {
                            console.log(err);
                        } else {
                            if(res.results[0]){
                                coordinates.lat = res.results[0].geometry.location.lat;
                                coordinates.lon = res.results[0].geometry.location.lng;
                                getResults();
                            }
                        }
                    }));
                } else {
                    $(".container-body, .container-footer").css('opacity', '0');
                    getResults();
                }
            }
        }
    }
});

window.onload = function(){
    var phrase = "<p>Here are some specific usage information: As an unauthenticated user, you can view all bars in your area."; 
    phrase += " As an authenticated user, you can add yourself to a bar to indicate you are going there tonight."; 
    phrase += " As an authenticated user, you can remove yourself from a bar if you no longer want to go there."; 
    phrase += " As an unauthenticated user, when you login you do not have to search again.</p>";
    $('.middle-top-row').html(phrase);
    if($('#main-link-hidden').data('auth') == true){
        if (typeof(Storage) !== "undefined") {
            if (sessionStorage.searchResults) {
                $(".middle-top-row").fadeOut(750, function(){
                    $(".top-hidden").slideDown(250);
                    $(".middle-middle-row").css('display', 'block');
                });
                $(".top").slideUp(1000);
                $(".middle").animate({height: '95%'}, 1000, function () {
                    pagination.current = sessionStorage.searchPage;
                    pagination.itemsArr = JSON.parse(sessionStorage.searchResults);
                    pagination.displayLoc = $('.container-body');
                    pagination.displayTools = $('.container-footer');
                    pagination.displayPage(sessionStorage.searchPage);
                    $(".container-body, .container-footer").animate({opacity: '1'}, 750);
                    $("#location-input-hidden").val(sessionStorage.searchVal);
                });
            } else {
                getCurrentLoc();        
            }
        } else {
            getCurrentLoc();
        }
    } else {
        getCurrentLoc();
    }
};

var getCurrentLoc = function() {
    var options = {
        timeout: 5000
    };
    
    var success = function (pos) {
        var crd = pos.coords;
        var url = '/api/location-name';
        var data = {
            latitude: crd.latitude,
            longitude: crd.longitude
        };
        var wait = function() {
            $('.page-hidden').css('display', 'block');
        };
        var complete = function() {
            $('.page-hidden').css('display', 'none');
        };
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
            if(err) {
                console.log(err);
            } else {
                if(res.results[0]){
                    $('#location-input').val(res.results[0].formatted_address);
                    $('#location-input-hidden').val(res.results[0].formatted_address);
                    $('#get-location i').removeClass('glyphicon-map-marker');
                    $('#get-location i').addClass('glyphicon-record');
                    $('#get-location').attr('title', 'Watching Location');
                    $('#get-location-hidden i').removeClass('glyphicon-map-marker');
                    $('#get-location-hidden i').addClass('glyphicon-record');
                    $('#get-location-hidden').attr('title', 'Watching Location');
                    coordinates.lat = data.latitude;
                    coordinates.lon = data.longitude;
                }
            }
        }));
    };

    var error = function (err) {
        var x = $(".geo-alert");
        switch(err.code) {
            case err.PERMISSION_DENIED:
                x.html("<p>Permission denied.</p>");
                break;
            case err.POSITION_UNAVAILABLE:
                x.html("<p>Position unavailable.</p>");
                break;
            case err.TIMEOUT:
                x.html("<p>Request time out.</p>");
                break;
            case err.UNKNOWN_ERROR:
                x.html("<p>Unknown error.</p>");
                break;
        }
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
};

var pagination = {
    current: null,
    itemsArr: [],
    itemPerPage : 5,
    displayLoc: null,
    displayTools: null,
    displayPage : function(p){
        var html = "";
        var pager = "";
        for (var i = (p-1) * this.itemPerPage; i < (p * this.itemPerPage) && i < this.itemsArr.length; i++) {
            html += "<div class='container-fluid holder'><div class='container-fluid media-left'>";
            html += "<div class='media-object'>";
            if(this.itemsArr[i].image_url){
                html += "<img class='image-responsive' src='" + this.itemsArr[i].image_url + "' alt='no-image' width='150' height='90'/></div>";
            } else {
                html += "<img class='image-responsive' src='/public/img/no-image.png' alt='no-image' width='150' height='90'/></div>";
            }
            html += "</div><div class='container-fluid media-body'><div class='row media-heading'>";
            html += "<div class='col-sm-8 media-title'>" + this.itemsArr[i].name + " <span class='glyphicon glyphicon-cog'></span></div><div class='col-sm-4 text-right rating-stars'>";
            html += "<img class='image-responsive' src='" + yelp_stars[this.itemsArr[i].rating] + "' alt='no-rate' title='Yelp Rating: " + this.itemsArr[i].rating + "' /></div>";
            html += "</div><div class='row media-info'><div class='col-sm-5 communication'><div class='address'>";
            html += this.itemsArr[i].location.display_address.join(', ');
            if(this.itemsArr[i].display_phone){
                html += "</div><div class='phone'>" + this.itemsArr[i].display_phone + "</div>";
            } else {
                html += "</div><div class='phone'>no phone information available</div>";
            }
            html += "</div><div class='col-sm-2 price'>";
            if(this.itemsArr[i].price){
                html += "<div>Price Level : " + this.itemsArr[i].price + "</div>";
            } else {
                html += "<div>Price Level : No Data</div>";
            }
            html += "<div>Distance (m) : " + this.itemsArr[i].distance.toFixed(0) + "</div>";
            html += "</div><div class='col-sm-3 links'><div><a class='yelp-url' href='" + this.itemsArr[i].url + "' target='_blank'>see reviews on yelp.com<a/></div>";
            html += "<div><span class='media-adder' data-id='" + this.itemsArr[i].id + "' >add yourself</span></div>";
            html += "<div class='media-getter' data-id='" + this.itemsArr[i].id + "' data-name='" + this.itemsArr[i].name + "'></div>";
            html += "</div><div class='col-sm-2'><div class='image-holder text-right'><img class='image-responsive' src='/public/img/Yelp_trademark_RGB.png' width='75' height='48'/>";
            html += "</div></div></div></div></div>";
        }
        pager += "<ul class='pager'><li class='previous'><a href='javascript:pagination.prevPage()' id='prev-button'>&laquo; Prev</a></li>";
        pager += "<li>" + p + '/' + this.numPages() + "</li>";
        pager += "<li class='next'><a href='javascript:pagination.nextPage()' id='next-button'>Next &raquo;</a><li></ul>";
        this.displayLoc.html(html);
        this.displayTools.html(pager);
        $('.media-title span').on('click', function() {
            linksModal(this);
        });
        $('.media-adder').on('click', function() {
            people.addyourselfto(this);
        });
        $('.media-getter').each(function(){
            people.getpeople(this);
        });
        if (p == 1) {
            $('#prev-button').css('visibility', 'hidden');
        } else {
            $('#prev-button').css('visibility', 'visible');
        }

        if (p == this.numPages()) {
            $('#next-button').css('visibility', 'hidden');
        } else {
            $('#next-button').css('visibility', 'visible');
        }
        if (typeof(Storage) !== "undefined") {
            sessionStorage.searchPage = this.current;
        }
    },
    numPages: function(){
        return Math.ceil(this.itemsArr.length / this.itemPerPage);
    },
    prevPage: function() {
        if (this.current > 1) {
            this.current--;
            this.displayPage(this.current);
        }
    },
    nextPage: function(){
        if (this.current < this.numPages()) {
            this.current++;
            this.displayPage(this.current);
        }
    }
};

var getResults = function() {
    var url = '/search/get-results?lat=';
    url += coordinates.lat + '&lon=';
    url += coordinates.lon;
    var data = null;
    var wait = function() {
        $('.page-hidden').css('display', 'block');
    };
    var complete = function() {
        $('.page-hidden').css('display', 'none');
    };
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', url, data, wait, complete, function (err, res) {
        if(err){
            aModal.modalTitle = "Oops! Something went wrong.";
            aModal.modalBody = "But we don't know why.";
            aModal.modalLocaton = $('.modal-hidden');
            aModal.modalAdder();
            $("#aModal").modal();
        } else {
            if(res.businesses) {
                var results = res.businesses;
                pagination.itemsArr = results;
                pagination.current = 1;
                pagination.displayLoc = $('.container-body');
                pagination.displayTools = $('.container-footer');
                pagination.displayPage(1);
                $(".container-body, .container-footer").animate({opacity: '1'}, 750);
                if (typeof(Storage) !== "undefined") {
                    sessionStorage.searchResults = JSON.stringify(results);
                    sessionStorage.searchVal = $('#location-input-hidden').val();
                }
            }
        }
    }));
};

var people = {
    addyourselfto : function(obj){
        var url = '/addyourself/' + $(obj).data('id');
        var data = null;
        var wait = function() {
            $('.page-hidden').css('display', 'block');
        };
        var complete = function() {
            $('.page-hidden').css('display', 'none');
        };
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
            if(err) {
                if(err.responseText == 'not auth') {
                    aModal.modalTitle = "You are not logged in!";
                    aModal.modalBody = "Please <a class='btn btn-default' href='/auth/github' id='secondary-link'>login</a> via GitHub.";
                    aModal.modalLocaton = $('.modal-hidden');
                    aModal.modalAdder();
                    $("#aModal").modal();
                } else {
                    aModal.modalTitle = "Oops! Something went wrong.";
                    aModal.modalBody = "But we don't know why.";
                    aModal.modalLocaton = $('.modal-hidden');
                    aModal.modalAdder();
                    $("#aModal").modal();
                }
            } else {
                if(res){
                    $('#main-link-hidden').data('where', $(obj).data('id'));
                    people.getpeople($(obj).parent().parent().find('.media-getter')[0]);
                } else {
                    aModal.modalTitle = "Oops! You do not seem to be free for tonight.";
                    aModal.modalBody = "Please <a class='btn btn-default' href='/removeperson/" + $('#main-link-hidden').data('where') + "'>be free</a>";
                    aModal.modalLocaton = $('.modal-hidden');
                    aModal.modalAdder();
                    $("#aModal").modal();
                }
            }
        }));
    },
    getpeople : function(obj){
        var id = $(obj).data('id');
        var url = '/getpeople/' + id;
        var data = null;
        var wait = function() {
            $('.page-hidden').css('display', 'block');
        };
        var complete = function() {
            $('.page-hidden').css('display', 'none');
        };
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
            if(err) {
                //console.log(err);
            } else {
                var htmll = "<a href='#' class='drop-down-link'>people for tonight <span class='badge'>" + res.length + "</span><a/>";  
                htmll += "<ul class='list-fixed'>";
                for(var k = 0; k < res.length; k++) {
                    htmll += "<li>" + res[k] + "</li>";
                    if($('.btn-dropdown').eq(0).text().trim() == res[k] || $('.btn-dropdown').eq(1).text().trim() == res[k]){
                        var html = "<a href='/removeperson/" + id + "'> out from here</a>";
                        $(obj).parent().find('.media-adder').after(html);
                        $(obj).parent().find('.media-adder').remove();
                    }
                }
                htmll += "</ul>";
                $(obj).html(htmll);
                var list = $(obj).find('ul');
                $(obj).find('.drop-down-link').on('click', function(){
                    if(list.css('display') == 'none') {
                        $('.list-fixed').css('display', 'none');
                        list.css('display', 'block');    
                    } else {
                        list.css('display', 'none');
                    }
                });
                $(obj).find('.list-fixed').find('li').on('click', function(){
                    list.css('display', 'none');
                });
            }
        }));
    }
};

var linksModal = function (obj) {
    aModal.modalTitle = "You have some options like these";
    aModal.modalBody = "<div class='mobile-link'><a href='" + $(obj).parent().parent().parent().find('.yelp-url')[0].href + "' target='_blank'>see reviews on yelp.com<a/></div>";
    aModal.modalBody += "<div class='mobile-adder'><span class='media-adder' data-id='" + $(obj).parent().parent().parent().find('.media-getter')[0].dataset.id + "'>add yourself</span></div>";
    aModal.modalBody += "<div class='media-getter mobile-getter' data-id='" + $(obj).parent().parent().parent().find('.media-getter')[0].dataset.id + "' ></div>";
    aModal.modalLocaton = $('.modal-hidden');
    aModal.modalAdder();
    $("#aModal").modal({backdrop: false});
    $('.media-adder').on('click', function() {
        people.addyourselfto(this);
    });
    $("#aModal").on('shown.bs.modal', function () {
        people.getpeople($('.media-getter'));
    });
};

$(document).ready(function(){
    $("#search-button").on('click', function(){
        $(".middle-top-row").fadeOut(750, function(){
            $(".top-hidden").slideDown(250);
            $(".middle-middle-row").css('display', 'block');
        });
        $(".top").slideUp(1000);
        $(".middle").animate({height: '95%'}, 1000, function () {
            if($('#get-location i').attr('class') != 'glyphicon glyphicon-record'){
                var url = '/api/location-coords';
                var data = {
                    address: charConvert($('#location-input').val())
                };
                var wait = function() {
                    $('.page-hidden').css('display', 'block');
                };
                var complete = function() {
                    $('.page-hidden').css('display', 'none');
                };
                ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
                    if(err) {
                        console.log(err);
                    } else {
                        if(res.results[0]){
                            coordinates.lat = res.results[0].geometry.location.lat;
                            coordinates.lon = res.results[0].geometry.location.lng;
                            getResults();
                            $('#location-input-hidden').val($('#location-input').val());
                        }
                    }
                }));
            } else {
                getResults();
                $('#location-input-hidden').val($('#location-input').val());
            }
        });
    });
    
    $("#search-button-hidden").on('click', function(){
        if($('#get-location-hidden i').attr('class') != 'glyphicon glyphicon-record'){
            $(".container-body, .container-footer").css('opacity', '0');
            var url = '/api/location-coords';
            var data = {
                address: charConvert($('#location-input-hidden').val())
            };
            var wait = function() {
                $('.page-hidden').css('display', 'block');
            };
            var complete = function() {
                $('.page-hidden').css('display', 'none');
            };
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, complete, function (err, res) {
                if(err) {
                    console.log(err);
                } else {
                    if(res.results[0]){
                        coordinates.lat = res.results[0].geometry.location.lat;
                        coordinates.lon = res.results[0].geometry.location.lng;
                        getResults();
                    }
                }
            }));
        } else {
            $(".container-body, .container-footer").css('opacity', '0');
            getResults();
        }
    });
    
    $('#get-location').on('click', function(){
        if($('#get-location i').attr('class') == 'glyphicon glyphicon-map-marker'){
            getCurrentLoc();
        }
    });
    
    $('#get-location-hidden').on('click', function(){
        if($('#get-location-hidden i').attr('class') == 'glyphicon glyphicon-map-marker'){
            getCurrentLoc();
        }
    });
    
    $('#location-input, #location-input-hidden').on('keyup', function() {
        $('#get-location i').removeClass('glyphicon-record');
        $('#get-location i').addClass('glyphicon-map-marker');
        $('#get-location').attr('title', 'Current Location');
        $('#get-location-hidden i').removeClass('glyphicon-record');
        $('#get-location-hidden i').addClass('glyphicon-map-marker');
        $('#get-location-hidden').attr('title', 'Current Location');
    });
    
    $('#main-link, #main-link-hidden, #home, #home-hidden').on('click', function() {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.removeItem('searchResults');
            sessionStorage.removeItem('searchVal');
            sessionStorage.removeItem('searchPage');
        }
    });
    
});                                                        