$(function(){

    // Variables   
    var $window       = $(window),    
        fsImg         = $('.img-fs'),
        startwidth    = 640, 
        startheight   = 360,
        ratio         = startheight/startwidth,
        imagewidth    = $(this).width(),
        imageheight   = $(this).height(),
        browserwidth  = $(window).width(),
        browserheight = $(window).height();


    //$('#main').css({ overflow:'hidden', transform:'translateX(-100%)' });
    $('header, #mobile-nav-btn').css({ opacity:'0', transform:'translateY(-100px)' });
    $('.scroll-cue').css({ opacity:'0', transform:'translateY(60px)' });
    TweenMax.staggerTo($('.pre-loader strong'), 0.6, {opacity:1, y:0, delay:0.4,ease:Expo.easeOut},0.05 );
    $window.on('load', function(){
       
        $('#main').css({ overflow:'visible'});

        TweenMax.to($('.pre-loader'), 0.8, {opacity:0, left:'100%', x:'100%', delay:1,ease:Expo.easeInOut} );
        TweenMax.to($('#main'), 0.8, {x:0, delay:1, ease:Expo.easeInOut, overwrite:'all', onComplete:function(){
            
            $('#hero .show-text').addClass('active');
            $('.pre-loader').css({ left:'50%', transform:'translateX(-50%)' });
            TweenMax.to($('header, #mobile-nav-btn, .scroll-cue'), 0.6, {opacity:1, y:0, delay:0.4,ease:Expo.easeOut} );

            $('.slick-active video')[0].play(); 

        }});
    });


    //Slick slider
    
    $('#hero').slick({
          autoplay: false,
          speed: 750,
          infinite:true,
          dots:true,
          customPaging : function(slider, i) { 
            return '<a></a>';
          },
          slidesToShow:1,
          slidesToScroll:1,
          fade: false,
          prevArrow:'.arrow-prev',
          nextArrow:'.arrow-next'
    });
    $('#hero').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.slick-active').next().find('video')[0].play(); 
    });
    
                 
    // Window resize handler
    $window.on('resize', function(){ 
        
        imagewidth    = $(this).width();
        imageheight   = $(this).height();
        browserwidth  = $(window).width();
        browserheight = $(window).height();
                    
        fsImage();  
                        
    });

    // Fullscreen image/video
    function fsImage(){
     
        if ((browserheight/browserwidth) > ratio){
            fsImg.height(browserheight);
            fsImg.width(browserheight / ratio);
        } else {
            fsImg.width(browserwidth);
            fsImg.height(browserwidth * ratio);
        };
        fsImg.css('left', (browserwidth - fsImg.width())/2);
        fsImg.css('top', (browserheight - fsImg.height())/2);

    };
    fsImage();  
      
    // Handle the menu btn interaction          
    $('#mobile-nav-btn').on('mousedown', function(){

        $(this).toggleClass('active open'); 
        $('nav, .logo.hide').fadeToggle('fast').toggleClass('active');

        if( $(this).hasClass('active') ){

            TweenMax.staggerFromTo($('nav li'), 0.8, {opacity:0, y:60}, {opacity:1, y:0, delay:0.2, ease:Expo.easeOut, overwrite:'all'}, 0.07);
            $('body').css({ overflow:'hidden'});
            $window.off("mousewheel");

        } else{

            $('body').css({ overflow:'visible'});
            $window.on("mousewheel", smoothWindow);

        } 

    }); 
    

    // Animate the window for smooth mousewheel scrolling
    var scrollTime = 1.2;
    var scrollDistance = 220;

    $window.on("mousewheel", smoothWindow);

    function smoothWindow(event){
        event.preventDefault();

        var delta       = event.originalEvent.wheelDelta/120;
        var scrollTop   = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta*scrollDistance) * 3;
        
        TweenMax.to($window, scrollTime, {
            scrollTo : { y: finalScroll, autoKill:true },
            ease: Power1.easeOut,
            overwrite: 5                         
        });
    }


    // Scrolling stuff animations
    $('.show-thumbs .col-1, .show-thumbs .col-1-2').css({ opacity:'0', transform:'translateY(120px)' });

    var raf           = requestAnimationFrame;
    var lastScrollTop = $window.scrollTop();

    if (raf) {

        loop();

    }

    function loop() {

        var scrollTop = $window.scrollTop();
        var y         = (scrollTop > lastScrollTop) ? 'down' : ((scrollTop === lastScrollTop) ? 'none' : 'up');
        var show      = $('.show-text');
        var thumbs    = $('.show-thumbs');

        if (lastScrollTop === scrollTop) {

            raf(loop);
            return;

        } else {

            lastScrollTop = scrollTop;
            raf(loop);

            show.each(function(){

                var offset = $(this).offset().top - scrollTop;

                if( offset <= $window.height()/1.5 ){

                    $(this).addClass('active');

                }

            });

            thumbs.each(function(){

                var offset = $(this).offset().top - scrollTop;

                if( offset <= $window.height()/1.5 ){

                    TweenMax.staggerTo($(this).find('.col-1-2, .col-1'), 1.6, {y:0, opacity:1, ease:Expo.easeOut},0.2);

                }

            });

            if( scrollTop > 30 ){

                $('.scroll-cue').fadeOut();

            }

        }

        if( y == 'down' && scrollTop > $window.height()/2 ){

              TweenMax.to($('#mobile-nav-btn.open'), 0.8, {y:-120, ease:Expo.easeOut} );

        } else{

            TweenMax.to($('#mobile-nav-btn.open'), 0.8, {y:0, ease:Expo.easeOut} );

        }

        lastScrollTop = scrollTop;

    }


    // Polyfill for requestAnimationFrame to add support/fallback in older browsers 
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
              window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

  
	
});


