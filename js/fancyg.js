/**
 * Ely Gallery Plugin :: Powerfull Touch Support Gallery
 * Author :: Sabri Taieb
 * @version 2.0.0
 * @param jQuery object
 */
(function( $ ){
    if( window.FancyG != undefined ) return true;

    'use strict';

    /**
     * Global data
     */
    window.FGData = {
        slides : false,
        currentCategory : false,
        currentSlideIndex : false,
        totalCategories : 0,
    };

    /**
     * Ely Gallery Plugin
     * @param {object} galleries 
     * @param {string} animationSpeed 
     * @param {object} i18n 
     */
    window.FancyG = function FancyG( galleries, animationSpeed, i18n ){
        this.animationSpeed = animationSpeed || '0.3s';
        this.i18n = i18n || {
            'prev_slide' : 'Prev Slide',
            'next_slide' : 'Next Slide',
            'fullscreen' : 'Full Screen',
            'exit' : 'Exit',
            'zoomin' : 'Zoom In',
            'zoomout' : 'Zomm Out',
            'share' : 'Share',
        };

        // General
        this.detectTouch();
        this.buildMarkup();

        // these must be outside and after buildMarkup function
        this.toolbar = $('.fg_toolbar');
        this.slidesWrapper = $('.fg_slides');
        this.captionWrapper = $('.fg_caption');
        this.counterWrapper = $('.fg_counter');

        // General
        this.dragEvent();
        this.toolbarEvents();
        this.keypressEvents();
        this.windowResizeEvent();
        this.browserBackForwardEvents();

        // Leave these at the end
        this.addGallery( galleries );
    }

    // params
    FancyG.prototype.document = $(document);
    FancyG.prototype.window = $(window);
    FancyG.prototype.body = $('body');
    FancyG.prototype.isTouchDevice = false;
    FancyG.prototype.touchstart = 'mousedown';
    FancyG.prototype.touchmove = 'mousemove';
    FancyG.prototype.touchend = 'mouseup';
    FancyG.prototype.touchcancel = '';
    FancyG.prototype.icons = {
        arrowRight : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M15.707 8.472l-7.354 7.354-0.707-0.707 6.146-6.146h-12.792v-1h12.793l-6.147-6.148 0.707-0.707 7.354 7.354z" /></svg>',
        arrowLeft : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M16 8.972h-12.793l6.146 6.146-0.707 0.707-7.353-7.353 7.354-7.354 0.707 0.707-6.147 6.147h12.793v1z" /></svg>',
        zoomIn : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M16.604 15.896l-5.173-5.173c0.975-1.137 1.569-2.61 1.569-4.223 0-3.584-2.916-6.5-6.5-6.5-1.737 0-3.369 0.676-4.597 1.904-1.228 1.227-1.903 2.86-1.903 4.596 0 3.584 2.916 6.5 6.5 6.5 1.612 0 3.086-0.594 4.224-1.569l5.173 5.173 0.707-0.708zM6.5 12c-3.033 0-5.5-2.467-5.5-5.5 0-1.47 0.571-2.851 1.61-3.89 1.039-1.038 2.42-1.61 3.89-1.61 3.033 0 5.5 2.467 5.5 5.5 0 3.033-2.467 5.5-5.5 5.5zM7 6h2v1h-2v2h-1v-2h-2v-1h2v-2h1v2z" /></svg>',
        zoomOut : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M16.604 15.868l-5.173-5.173c0.975-1.137 1.569-2.611 1.569-4.223 0-3.584-2.916-6.5-6.5-6.5-1.736 0-3.369 0.676-4.598 1.903-1.227 1.228-1.903 2.861-1.902 4.597 0 3.584 2.916 6.5 6.5 6.5 1.612 0 3.087-0.594 4.224-1.569l5.173 5.173 0.707-0.708zM6.5 11.972c-3.032 0-5.5-2.467-5.5-5.5-0.001-1.47 0.571-2.851 1.61-3.889 1.038-1.039 2.42-1.611 3.89-1.611 3.032 0 5.5 2.467 5.5 5.5 0 3.032-2.468 5.5-5.5 5.5zM4 5.972h5v1h-5v-1z" /></svg>',
        close : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M9.207 8.5l6.646 6.646-0.707 0.707-6.646-6.646-6.646 6.646-0.707-0.707 6.646-6.646-6.647-6.646 0.707-0.707 6.647 6.646 6.646-6.646 0.707 0.707-6.646 6.646z" /></svg>',
        share : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M6.795 13.396c-1.11-1.037-1.747-2.502-1.747-4.021 0-3.033 2.468-5.5 5.5-5.5h2.912l-2.646-2.646 0.707-0.707 3.854 3.854-3.854 3.854-0.707-0.707 2.646-2.646h-2.912c-2.481 0-4.5 2.019-4.5 4.5 0 1.261 0.508 2.429 1.429 3.29l-0.682 0.729zM16.048 9.030v6.47c0 0.275-0.225 0.5-0.5 0.5h-14c-0.275 0-0.5-0.225-0.5-0.5v-6.475h-1v6.475c0 0.827 0.673 1.5 1.5 1.5h14c0.827 0 1.5-0.673 1.5-1.5v-6.47h-1z" /></svg>',
        facebook : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M12.461 5.57l-0.309 2.93h-2.342v8.5h-3.518v-8.5h-1.753v-2.93h1.753v-1.764c0-2.383 0.991-3.806 3.808-3.806h2.341v2.93h-1.465c-1.093 0-1.166 0.413-1.166 1.176v1.464h2.651z" /></svg>',
        twitter : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M15.253 5.038c0.011 0.151 0.011 0.302 0.011 0.454 0 4.605-3.506 9.912-9.913 9.912-1.974 0-3.808-0.572-5.351-1.564 0.281 0.032 0.551 0.042 0.842 0.042 1.629 0 3.127-0.55 4.325-1.488-1.532-0.032-2.815-1.036-3.257-2.417 0.215 0.032 0.431 0.054 0.656 0.054 0.314 0 0.627-0.043 0.918-0.118-1.596-0.324-2.794-1.726-2.794-3.419 0-0.011 0-0.033 0-0.043 0.464 0.258 1.003 0.42 1.575 0.442-0.938-0.626-1.553-1.694-1.553-2.901 0-0.647 0.173-1.241 0.475-1.759 1.715 2.115 4.293 3.496 7.184 3.646-0.055-0.259-0.087-0.529-0.087-0.799 0-1.919 1.554-3.483 3.484-3.483 1.003 0 1.909 0.42 2.546 1.1 0.787-0.151 1.541-0.442 2.211-0.841-0.259 0.809-0.809 1.489-1.532 1.919 0.702-0.075 1.381-0.269 2.007-0.539-0.475 0.69-1.068 1.306-1.747 1.802z" /></svg>',
        fullscreen : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M15.996 11.352l0.004 4.648-4.649-0.004 0.001-1 2.94 0.003-5.792-5.791-5.792 5.792 2.94-0.003 0.001 1-4.649 0.003 0.004-4.649 1 0.001-0.003 2.939 5.792-5.791-5.792-5.792 0.003 2.939-1 0.001-0.004-4.648 4.649 0.004-0.001 1-2.94-0.003 5.792 5.792 5.792-5.792-2.94 0.003-0.001-1 4.649-0.004-0.004 4.649-1-0.001 0.003-2.939-5.792 5.791 5.792 5.792-0.003-2.939 1-0.001z" /></svg>',
        normalscreen : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M3 3v11h11v-11h-11zM13 13h-9v-9h9v9z" /></svg>'
    };
    FancyG.prototype.socialShare = {
        facebook : 'https://www.facebook.com/share.php?u=',
        twitter : 'https://twitter.com/intent/tweet?url=',
    };
    FancyG.prototype.pageUrl = window.location.href;
    FancyG.prototype.pageTitle = document.getElementsByTagName("title")[0].innerHTML;

    /**
     * Detect touch device and set events
     */
    FancyG.prototype.detectTouch = function(){
        if( 'ontouchstart' in window ||
            window.navigator.maxTouchPoints > 0 ||
            window.navigator.msMaxTouchPoints > 0 ||
            window.DocumentTouch && document instanceof DocumentTouch
        ){
            this.isTouchDevice = true;
            this.touchstart = 'touchstart';
            this.touchend = 'touchend';
            this.touchmove = 'touchmove';
            this.touchcancel = 'touchcancel';
        }
    }

    /**
     * Build Markup
     */
    FancyG.prototype.buildMarkup = function(){
        if( this.body.hasClass('fg_markup') ) return true;
        this.body.addClass('fg_markup');

        this.body.append(
            '\
            <div class="fg_overlay"></div>\
            <div class="fg_slides"></div>\
            <div class="fg_info">\
                <div><span class="fg_counter">0/0</span>\
                <span class="fg_caption"></span></div>\
            </div>\
            <ul class="fg_toolbar">\
                <li class="fg_btn_exit" title="'+this.i18n.exit+'">'+ this.icons.close +'</li>\
                <li class="fg_btn_fullscreen" title="'+this.i18n.fullscreen+'">'+ this.icons.fullscreen +'</li>\
                <li class="fg_btn_zoomin" title="'+this.i18n.zoomin+'">'+ this.icons.zoomIn +'</li>\
                <li class="fg_btn_zoomout" title="'+this.i18n.zoomout+'">'+ this.icons.zoomOut +'</li>\
                <li class="fg_btn_share" title="'+this.i18n.share+'">\
                    '+ this.icons.share +'\
                    <ul class="fg_subtoolbar">\
                        <li data-share="facebook">'+ this.icons.facebook +'</li>\
                        <li data-share="twitter">'+ this.icons.twitter +'</li>\
                    </ul>\
                </li>\
                <li class="fg_btn_prev_slide" title="'+this.i18n.prev_slide+'">'+ this.icons.arrowLeft +'</li>\
                <li class="fg_btn_next_slide" title="'+this.i18n.next_slide+'">'+ this.icons.arrowRight +'</li>\
            </ul>'
        );
    }

    /**
     * Setup galleries
     * @param {object} galleries 
     */
    FancyG.prototype.addGallery = function( galleries ){
        if( ! galleries ) return false;
        if( galleries.jquery === undefined ) return false;
        if( galleries.length === 0 ) return false;

        var plugin = this;
        
        galleries.filter(':not(.fg_gallery_started)').each(function( i ){
            var self = $(this);
            FGData.totalCategories += 1;
            plugin.setID( self );
            plugin.addClickListener( self );
            self.addClass('fg_gallery_started');
        });
        this.openByUrlParams();
    }

    /**
     * Set Gallery id   
     * @param {object} gallery 
     */
    FancyG.prototype.setID = function( gallery ){
        if( gallery.data('id') === undefined ){
            var id = 'ely-' + FGData.totalCategories;
            gallery.attr( 'id', id ).attr('data-id', id);
        }        
    }

    /**
     * Add Click Events To the Gallery Links
     */
    FancyG.prototype.addClickListener = function( gallery ){
        var touch = 'click';
        var plugin = this;

        if( plugin.isTouchDevice ) touch = 'touchstart';

        gallery.find('.item-fg').on( touch, function( event ){
            event.preventDefault();
            var self = $(this);

            FGData.currentCategory = self.closest('.gallery-fg').attr('data-id');
            plugin.createSlides( self );
            plugin.setCurrentSlide( self );
            plugin.open();
        });
    }

    /**
     * Open
     */
    FancyG.prototype.open = function(){
        this.body.addClass('fg_opened');
        this.changePageUrl();
    }

    /**
     * Add Gallery id & current slide index to page url
     */
    FancyG.prototype.changePageUrl = function(){
        history.pushState(
            { id: 'fg_gallery' }, 
            this.pageTitle, 
            this.pageUrl.replace( /#fg=.*/gi, '' ) + '#fg=' + FGData.currentCategory + '&slide=' + ( FGData.currentSlideIndex + 1 )
        );
    }

    /**
     * Change back the page url
     */
    FancyG.prototype.changeBackPageUrl = function(){
        history.pushState(
            { id: 'fg_gallery' }, 
            this.pageTitle, 
            this.pageUrl.replace( /#fg=.*/gi, '' )
        );
    }

    /**
     * Create Slides
     * @param object clickedLink
     */
    FancyG.prototype.createSlides = function( clickedLink ){
        var img;
        var src;
        var caption;
        var plugin = this;

        // reset
        plugin.slidesWrapper.html('');

        // create
        clickedLink.closest('.gallery-fg').find('img').each(function(){

            var img = $(this);
            var src = img.attr('src');
            var srcset = img.attr('srcset');

            if( img.attr('data-big') ){
                src = img.attr('data-big');
            }

            if( ! srcset ){
                srcset = '';
            }

            caption = '';
            captionEl = img.parent().find('.caption');

            if( captionEl.length ){
                caption = captionEl.text();
            }

            plugin.slidesWrapper.append('<div class="fg_slide" data-caption="'+caption+'"><img draggable="false" src="'+src+'" srcset="'+srcset+'" alt=""></div>');
        });

        FGData.slides = $('.fg_slide', plugin.slidesWrapper );

        if( FGData.slides.length == 1 ){
            plugin.body.addClass('fg_onlyone');
        }
        else{
            plugin.body.removeClass('fg_onlyone');
        }
    }

    /**
     * Set Current Item
     * @param object clickedLink
     */
    FancyG.prototype.setCurrentSlide = function( clickedLink ){
        FGData.currentSlideIndex = clickedLink.closest('.item-fg').index();
        FGData.currentCategory = clickedLink.closest('.gallery-fg').attr('data-id');
        FGData.slides.css({ 'transform':'', 'transition':'' });
        FGData.slides.filter('.fg_current_slide').removeClass('fg_current_slide');
        FGData.slides.eq( FGData.currentSlideIndex ).addClass('fg_current_slide');
        this.setSlideCaption();
        this.setSlidesCounter();
    }

    /**
     * Set Slide Caption
     */
    FancyG.prototype.setSlideCaption = function(){
        var slide = FGData.slides.eq( FGData.currentSlideIndex );

        if( slide.data('caption').length ){
            this.captionWrapper.text( slide.data('caption') )
                .css('display','');
        }
        else{
            this.captionWrapper.css('display','none');
        }
    }

    /**
     * Set Slides Counter
     */
    FancyG.prototype.setSlidesCounter = function(){
        this.counterWrapper.text( ( FGData.currentSlideIndex + 1 ) + ' / ' + FGData.slides.length );
    }

    /**
     * Drag Slide
     */
    FancyG.prototype.dragEvent = function(){
        if( this.body.hasClass('fg_drag') ) return true;
        this.body.addClass('fg_drag');

        var dragstartx;
        var dragx;
        var dragLength = 0; // 0 fixes an issue when click on the slide 
        var dragDestination;
        var dragMove;
        var plugin = this;

        plugin.document.on( plugin.touchstart, '.fg_current_slide', function( event ){
            event.stopPropagation();
            dragMove = true;
            dragLength = 0; // reset fixes an issue when click on the slide 

            if( plugin.touchstart == 'mousedown' ){
                dragstartx = event.originalEvent.pageX;
            }
            else{
                dragstartx = event.originalEvent.touches[0].pageX;
            }

            // remove transition to prevent animation issues when dragging
            FGData.slides.css('transition', '');
        });

        plugin.document.on( plugin.touchmove, '.fg_current_slide', function( event ){
            event.stopPropagation();

            // prevent moving if the slides number is 1
            if( FGData.slides.length == 1 ) return true;

            if( plugin.touchmove == 'mousemove' ){
                if( dragMove && event.originalEvent.pageX != 0 ){
                    dragx = event.originalEvent.pageX;
                    dragLength = dragx - dragstartx;
                    plugin.moveSlide( dragLength );
                }
            }
            else{
                dragx = event.originalEvent.touches[0].pageX;
                dragLength = dragx - dragstartx;
                plugin.moveSlide( dragLength );
            }

        });

        plugin.document.on( plugin.touchend, '.fg_current_slide', function( event ){
            event.stopPropagation();

            // prevent moving if the slides number is 1
            if( FGData.slides.length == 1 ) return true;

            // Drag Left
            if( dragLength < -100 || dragLength > 100 ){
                if( dragLength < -100 ){
                    plugin.nextSlide();
                }
                else if( dragLength > 100 ){
                    plugin.prevSlide();
                }

                plugin.setSlideCaption();  
                plugin.setSlidesCounter();
                plugin.changePageUrl();
                sessionStorage.setItem( 'fg_gallery', FGData.currentCategory );
                sessionStorage.setItem( 'fg_slide', FGData.currentSlideIndex );
            }
            else{
                // not enough
                $(this).css({'transform':'translate3d(0,0,0)'});
            }

            dragMove = false;
        });

    }

    /**
     * Move Slide 
     */
    FancyG.prototype.moveSlide = function( dragLength ){

        var nextSlideIndex;

        FGData.slides.filter('.fg_current_slide').css('transform','translate3d( '+ dragLength +'px,0,0)');

        // drag left
        if( dragLength < 0 ){
            nextSlideIndex = FGData.currentSlideIndex + 1;
            
            if( FGData.currentSlideIndex + 1 > ( FGData.slides.length - 1 ) ){
                nextSlideIndex = 0;
            }
            
            FGData.slides.eq( nextSlideIndex ).css({
                'transform' : 'translate3d( '+ ( $(window).width() + dragLength ) +'px,0,0)'
            }); 
        }
        // drag right
        else{
            nextSlideIndex = FGData.currentSlideIndex - 1;
            
            if( FGData.currentSlideIndex - 1 < 0 ){
                nextSlideIndex = FGData.slides.length - 1;
            }

            FGData.slides.eq( FGData.currentSlideIndex - 1 ).css({
                'transform' : 'translate3d( '+ ( dragLength - $(window).width() ) +'px,0,0)'
            });    
        }
    }

    /**
     * Next Slide
     */
    FancyG.prototype.nextSlide = function(){

        var nextIndex;

        FGData.slides.eq( FGData.currentSlideIndex - 1 ).css({
            'transition' : '',
            'transform' : '',
        }); 

        FGData.slides.filter('.fg_current_slide').css({
            'transition' : 'transform ' + this.animationSpeed,
            'transform' : 'translate3d(-100%,0,0)',
        }).removeClass('fg_current_slide');

        if( FGData.currentSlideIndex + 1 > ( FGData.slides.length - 1 ) ){
            nextIndex = 0;
        }
        else{
            nextIndex = FGData.currentSlideIndex + 1;          
        }

        FGData.slides.eq( nextIndex ).css({
            'transition' : 'transform ' + this.animationSpeed,
            'transform' : 'translate3d(0,0,0)',
        }).addClass('fg_current_slide');

        FGData.currentSlideIndex = nextIndex;
        this.setSlideCaption();  
        this.setSlidesCounter();
        sessionStorage.setItem( 'fg_gallery', FGData.currentCategory );
        sessionStorage.setItem( 'fg_slide', FGData.currentSlideIndex );
    }

    /**
     * Prev Slide
     */
    FancyG.prototype.prevSlide = function(){

        var nextIndex;

        FGData.slides.eq( FGData.currentSlideIndex + 1 ).css({
            'transition' : '',
            'transform' : '',
        }); 

        FGData.slides.filter('.fg_current_slide').css({
            'transition' : 'transform ' + this.animationSpeed,
            'transform' : 'translate3d(100%,0,0)',
        }).removeClass('fg_current_slide');

        if( FGData.currentSlideIndex - 1 < 0 ){
            nextIndex = FGData.slides.length - 1;
        }
        else{
            nextIndex = FGData.currentSlideIndex - 1;          
        }

        FGData.slides.eq( nextIndex ).css({
            'transition' : 'transform ' + this.animationSpeed,
            'transform' : 'translate3d(0,0,0)',
        }).addClass('fg_current_slide');   

        FGData.currentSlideIndex = nextIndex;
        this.setSlideCaption();  
        this.setSlidesCounter();
        sessionStorage.setItem( 'fg_gallery', FGData.currentCategory );
        sessionStorage.setItem( 'fg_slide', FGData.currentSlideIndex );
    }

    /**
     * Toolbar buttons events
     */
    FancyG.prototype.toolbarEvents = function(){
        var plugin = this;

        /**
         * Exit
         */
        $('.fg_btn_exit').on( 'click', function( event ){
            if( plugin.body.hasClass('fg_fullscreen') ){
                plugin.exitFullScreen();
            }
            else{
                plugin.body.removeClass('fg_opened');
                plugin.changeBackPageUrl();
            }
        });

        /**
         *  zoom in/out
         */
        $('.fg_btn_zoomin, .fg_btn_zoomout').on( 'click', function(){
            var self = $(this);
            var img = $('.fg_current_slide img');    
            var scale = parseInt( img.attr('data-scale') ) || 1;

            if( self.is('.fg_btn_zoomin') ){
                scale += 1;
            }
            else{
                scale -= 1;
            }

            if( scale == 0 ) return true;

            img.attr('data-scale', scale )
                .css('transform','scale3d('+scale+', '+scale+', 1)');
        });

        /**
         * Fullscreen / normal screen
         */
        $('.fg_btn_fullscreen').on( 'click', function(){
            if( plugin.body.hasClass('fg_fullscreen') ){
                plugin.exitFullScreen();
            }
            else{
                plugin.fullScreen();
            }
        });

        /**
         * Next/Prev Slide
         */
        $('.fg_btn_prev_slide, .fg_btn_next_slide').on( 'click', function(){
            if( $(this).hasClass('fg_btn_next_slide') ){
                plugin.moveSlide( -1 );
                setTimeout(function(){
                    plugin.nextSlide();
                    plugin.changePageUrl();
                }, 30);   
            }
            else{
                plugin.moveSlide( 1 );
                setTimeout(function(){
                    plugin.prevSlide();
                    plugin.changePageUrl();
                }, 30);
            }
        });

        /**
         * Toggle Share Box
         */
        $('.fg_btn_share').on( 'click', function( event ){
            event.stopPropagation();
            plugin.body.toggleClass('fg_share_open');
        });

        /**
         * Share links
         */
        $('.fg_btn_share li').on( 'click', function( event ){
            event.preventDefault();
            var self = $(this);
            var url = plugin.socialShare[ self.data('share') ] + encodeURI( location.href );
            var win = window.open(url, '_blank');
            win.focus();
        });

    }

    /**
     * Go Full Screen
     */
    FancyG.prototype.fullScreen = function(){
        var i = document.body;

        if (i.requestFullscreen) {
            i.requestFullscreen();
        } else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
        } else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
        } else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
        }

        this.body.addClass('fg_fullscreen');
    }

    /**
     * Exit Full Screen
     */
    FancyG.prototype.exitFullScreen = function(){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        this.body.removeClass('fg_fullscreen');
    }

    /**
     * Keypress Events
     */
    FancyG.prototype.keypressEvents = function(){
        var plugin = this;

        plugin.document.on('keyup', function( event ){

            if( ! plugin.body.hasClass('fg_opened') ) return true;
             event.preventDefault();

            var code = event.keyCode || event.which;

            if( code == 39 ){
                // prevent moving if the slides number is 1
                if( FGData.slides.length == 1 ) return true;
                
                plugin.moveSlide( -1 );
                setTimeout(function(){
                    plugin.nextSlide();
                    plugin.changePageUrl();
                }, 30);    
            }
            else if( code == 37 ) {
                // prevent moving if the slides number is 1
                if( FGData.slides.length == 1 ) return true;

                plugin.moveSlide( 1 );
                setTimeout(function(){
                    plugin.prevSlide();
                    plugin.changePageUrl();
                }, 30);
            }
            else if( code == 27 ) {
                plugin.body.removeClass('fg_opened fg_fullscreen');
                plugin.changeBackPageUrl();
            }

        });
    }

    /**
     * Window Resize Event
     */
    FancyG.prototype.windowResizeEvent = function(){
        var plugin = this;
        var windowTimeout;
        var availHeight = window.screen.availHeight;
        var availWidth = window.screen.availWidth;
        
        $(window).resize(function(){
            clearTimeout( windowTimeout )
            windowTimeout = setTimeout(function(){
                if( $(window).width() <= availWidth && $(window).height() < availHeight && plugin.body.hasClass('fg_fullscreen') ){
                    plugin.body.removeClass('fg_fullscreen');
                }
            }, 30);
        });
    }

    /**
     * Get Gallery ID / Slide From Browser Hash
     * @return {[type]} [description]
     */
    FancyG.prototype.getDataFromBrowserHash = function(){
        if( location.hash == '' ) return false;

        var hash = location.hash;
        var regex = /fg=(.+?)&slide=(\d\d?)/gi;
        var result = regex.exec( hash );
        
        if( ! result ) return false;
        
        var galleryID = result[1];
        var slideID = parseInt( result[2] ) - 1;
        var links = $( '#' + galleryID + ' .item-fg' );
        var slide = links.eq( slideID );

        // no gallery or no slide
        if( ! links.length || ! slide.length ) return false;

        return {
            galleryID : galleryID,
            slideID : slideID,
            slide : slide,
            links : links,
        };
    }

    /**
     * Open Gallery if url params are set
     */
    FancyG.prototype.openByUrlParams = function(){
        var data = this.getDataFromBrowserHash();
        if( ! data ) return;
        
        FGData.currentCategory = data.galleryID;
        this.createSlides( data.links.eq( data.slideID ) );
        this.setCurrentSlide( data.slide );
        this.open();
    }

    /**
     * Detect Bowser Back And Forward Events
     */
    FancyG.prototype.browserBackForwardEvents = function(){
        var plugin = this;
        var hashData;

        plugin.window.on('popstate', function( e ){
            hashData = plugin.getDataFromBrowserHash();
            if( ! hashData ){
                plugin.body.removeClass('fg_opened');
                return true;
            }
            else if( ! plugin.body.hasClass('fg_opened') ){
                plugin.open();
            }

            if( hashData.galleryID != FGData.currentCategory ){
                plugin.openByUrlParams();
            }

            FGData.slides.css('transform','');
            
            if( sessionStorage.getItem('fg_gallery') ){
                if( hashData.slideID < sessionStorage.getItem( 'fg_slide' ) ){
                    plugin.moveSlide(1);
                    setTimeout(function(){
                        plugin.prevSlide();
                    },20);
                }
                else{
                    plugin.moveSlide(-1);
                    setTimeout(function(){
                        plugin.nextSlide();
                    },20);
                }   
            }
        });
    }

    /**
     * Start 
     * @param {object} gallery 
     */
    var startGallery = function( gallery ){

        if( gallery.data('design') === 'justified' ){
            
            var rowHeight = gallery.data('rowheight');
            var margins = gallery.data('margins');
            var id = gallery.data('id') ? gallery.data('id') : 0;

            if( ! rowHeight ){
                rowHeight = 170;
            }
            else if( typeof( rowHeight ) !== 'number' ){
                rowHeight.replace('px','');
            }

            if( ! margins ){
                margins = 0;
            }
            else if( typeof( margins ) !== 'number' ){
                margins.replace('px','');
            }

            gallery.justifiedGallery({
                lastRow : 'nojustify', 
                rowHeight : rowHeight,
                rel : 'gallery' + id,
                selector: '.item-fg',
                margins : margins,
            }).on('jg.complete', function () {
                execFancyG.addGallery( gallery );
            });

        }
        else{
            execFancyG.addGallery( gallery );
        }

    }

	/**
	 * All Galleries
	 */
    var galleries = $('.gallery-fg');
    var execFancyG = new FancyG();

    // wait for images to load
    galleries.each(function(){

        var gallery = $(this);
        var images = $( 'img', this );
        var count = 0;
        
        images.on('load',function(){

            count = count + 1;

            if( count == images.length ){
                startGallery( gallery );
            }

        }).each(function() {
            if(this.complete) $(this).trigger('load'); // jQuery 3
        });    

    });

})( jQuery );
