//**************************************************************************
// CG : 30-11-2015 Widget d'affichage du dump carousel laposte.net
// Parametres : { 
//  typeUser : Type utilisateur (String) {"particulier,professionnel"},
//  imgloading : Image de chargement(String URL),
//  imgError : Image d'erreur de chargement(String URL),
//  arrayColor: liste de fond(String Hexa),
//  }
//************************************************************************** 
(function($) {


    $.fn.carouselPartPro = function(options) {
        var $self = $(this)
        var settings = $.extend({
            typeUser: "particulier",
            imgloading: "./error/loading.jpg",
            loadingMessageHaut: "Nouveau ! Avec Colissimo",
            loadingMessageBas: "réexpédiez vos colis depuis votre boîte aux lettres.",
            loadingMessagetextColor : "#333",
            imgError: "./error/loading.jpg",
            errorMessageHaut: "Nouveau ! Avec Colissimo Error",
            errorMessageBas: "réexpédiez vos colis depuis votre boîte aux lettres.",
            errorMessagetextColor : "#333",
        }, options);
        var imgload = settings.imgloading;
        var imgerr = settings.imgError;
        var lMessageHaut = settings.loadingMessageHaut;
        var lMessageBas = settings.loadingMessageBas;
        var lMessagetextColor = settings.loadingMessagetextColor;
        var eMessageHaut = settings.errorMessageHaut;
        var eMessageBas = settings.errorMessageBas;
        var eMessagetextColor = settings.errorMessagetextColor;
       $self.html('');
       $self.html(templateLoadingError(lMessageHaut,lMessageBas,imgload,lMessagetextColor)); 


      $("#widget-carousel-content-" + settings.typeUser).owlCarousel({

                        navigation: false, // Show next and prev buttons
                        slideSpeed: 500,
                        paginationSpeed: 400,
                        loop: false,
                        baseClass: "owl-carousel",
                        rewindNav: true,
                        scrollPerPage: false,
                        pagination: false,
                        transitionStyle: "fade",
                        theme: "owl-theme",
                        singleItem: true
                    });
        var dataPromise = getData();

        function templateLoadingError(messageHaut,messageBas,imgcharg,messagetextColor){
            return '<section class="lp-slider lp-section"> \
                        <div class="slider-container"> \
                            <div data-lp-slider="full-width" id="widget-carousel-content-particulier" class="owl-carousel owl-theme" style="opacity: 1; display: block;"> \
                                <div class="owl-wrapper-outer"> \
                                    <div class="owl-wrapper" style="width: 16800px; left: 0px; display: block; transition: all 0ms ease; transform: translate3d(0px, 0px, 0px); transform-origin: 840px 50% 0px; perspective-origin: 840px 50%;"> \
                                        <div class="owl-item" style="width: 1680px;"> \
                                            <div data-slide="s1"> \
                                                <figure class="cropped-img" > \
                                                    <img src="'+imgcharg+'"> \
                                                </figure> \
                                                <div class="slide-content mediatron--light-text"> \
                                                    <div class="container-fluid"> \
                                                        <div class="jumbotron"> \
                                                            <p class="h1" style="color:'+messagetextColor+'"> \
                                                                '+messageHaut+' \
                                                            </p> \
                                                            <p class="h2" style="color:'+messagetextColor+'"> \
                                                                '+messageBas+' \
                                                            </p> \
                                                        </div> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </section>';
        }

        function getData() {
            // 
            var deferred = $.Deferred();

            // ---- AJAX Call ---- //    
            $.ajax({

                // url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22https%3A%2F%2Fwww.laposte.fr%2F" + settings.typeUser + "%22%20and%20compat%3D%22html5%22%20and%20xpath%3D'%2F%2Fdiv%5B%40data-slide%5D'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
               
                url : "https://disfelaposte.herokuapp.com/",
                type: "GET",
                dataType: "html",
                cache: true,               
                beforeSend: function(request) {               
                    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');                  
                },
                success: function(data) {

                    console.log("SUCESS");
                    //Fill div with results
                    var dataFormatted = data;
                    dataFormatted = dataFormatted.replace(/src="/g, 'src="https://disfelaposte.herokuapp.com/');
                    dataFormatted = dataFormatted.replace(/href="\//g, 'href="https://disfelaposte.herokuapp.com/');
                    xmlDoc = $.parseXML(dataFormatted),
                        xml = $(xmlDoc),
                        result = xml.find("results").html();
                    $self.html('<section class="lp-slider lp-section"><div class="slider-container"><div data-lp-slider="full-width" id="widget-carousel-content-' + settings.typeUser + '" class="owl-carousel" >' + result + '</div></div></section>');


                    $("#widget-carousel-content-" + settings.typeUser).owlCarousel({

                        navigation: false, // Show next and prev buttons
                        slideSpeed: 500,
                        paginationSpeed: 400,
                        loop: true,
                        baseClass: "owl-carousel",
                        rewindNav: true,
                        scrollPerPage: false,
                        autoPlay: 5000,
                        pagination: true,
                        transitionStyle: "fade",
                        theme: "owl-theme",
                        singleItem: true
                    });


                    $(".btn-group-control").html("");
                },
                error: function(xhr, status, error) {

                    deferred.reject("flux inaccessible");

                },
                onload: function() {
                    if (this.status >= 200 && this.status < 300) {
                        // On utilise la fonction "resolve" lorsque this.status vaut 2xx
                        deferred.resolve(this.response);
                    } else {
                        // On utilise la fonction "reject" lorsque this.status est différent de 2xx
                        deferred.reject(this.statusText);
                    }
                }
            });

            return deferred.promise();
        }

        // register a function to get called when the data is resolved
        dataPromise.done(function(data) {
            //  alert("status : " + data);
        });

        // register the failure function
        dataPromise.fail(function(ex) {

        $self.html('');
        $self.html(templateLoadingError(eMessageHaut,eMessageBas,imgError,eMessagetextColor)); 
        $("#widget-carousel-content-" + settings.typeUser).owlCarousel({

                            navigation: false, // Show next and prev buttons
                            slideSpeed: 500,
                            paginationSpeed: 400,
                            loop: false,
                            baseClass: "owl-carousel",
                            rewindNav: true,
                            scrollPerPage: false,
                            pagination: false,
                            transitionStyle: "fade",
                            theme: "owl-theme",
                            singleItem: true
        });
            console.log("Widget PartPro chargement impossible : " + ex);
        });

        var nodeFormatted = {
            items: []
        };


    };

}(jQuery));
