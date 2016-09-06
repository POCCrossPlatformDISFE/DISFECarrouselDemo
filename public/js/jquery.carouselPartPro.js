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

        function walkTheDOM(node, func) {
            func(node);
            node = node.firstChild;
            while (node) {
                walkTheDOM(node, func);
                node = node.nextSibling;
            }
        }

        function getData() {
            // 
            var deferred = $.Deferred();

            // ---- AJAX Call ---- //    
            $.ajax({
               
                url : "https://disfelaposte.herokuapp.com/"+settings.typeUser,
                type: "GET",
                dataType: "html",
                cache: true,               
                beforeSend: function(request) {               
                    request.setRequestHeader('Content-Type','text/plain');                  
                },
                success: function(data) {

                    data = data.replace(/src="/g, 'src="https://disfelaposte.herokuapp.com');
                    data = data.replace(/href="\//g, 'href="https://disfelaposte.herokuapp.com/');

                    var containerFluidNode;


                    var doc = new DOMParser().parseFromString(data,'text/xml');
                   
                    var html = $.parseHTML(data);                  
                    
                    html.forEach(function(node) {
                        var branch = $(node).find('#carousel-'+settings.typeUser);
                       if(branch.length >0){
                            carouselDOM = branch[0];
                       }
                    }, this);
                  
                    $self.html(carouselDOM.innerhtml);

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
                    console.log(error);
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
        $self.html(templateLoadingError(eMessageHaut,eMessageBas,imgerr,eMessagetextColor)); 
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
