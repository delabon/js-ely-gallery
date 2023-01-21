var sections = $('.content-block');
var menuItems = $('#desktop-nav a');
var searchInput = $('#desktop-nav input');
var searchItems = $('#desktop-nav form ul');
var mobile_menu = $('#mobile-nav');


/**
 * Code Highlighter
 */
$( 'pre > code' ).each(function( i ) {
    hljs.highlightBlock( this );
});


/**
 * Toggle Mobile Menu
 */
$('.mobile-nav-opener').on( 'click', function(){
    mobile_menu.toggleClass('_open');
});


/**
* Listen for page link change
* @param {object} event 
*/
window.onpopstate = function(event) {
    var hash = location.hash;

    mobile_menu.removeClass('_open');

    menuItems.filter('.active').removeClass('active');

    menuItems.each(function( index ){

        var self = $( this );
        var target;

        if( self.attr('href') == hash ){
            
            self.addClass('active');
            
            // open section
            if( self.attr('data-depth') == 0 ){
                target = self.attr('href').replace('#','');
            }
            else{
                target = self.parents('li').last().find('a').attr('href');
            }

            sections.each(function( secindex ){

                section = $( this );

                if( section.attr('id') == target.replace('#','') ){
                    section.attr('style','display:block;');
                }
                else{
                    section.attr('style','display:none;');
                }

            });
        }
    });
};

window.onpopstate();


/**
 * Disable Form Submit
 */
$('form').on('submit', function( event ){
    event.preventDefault();
});

/**
 * Listen for search change
 */
searchInput.on('keyup', function( event){
    
    // reset
    searchItems.html('');

    if( searchInput.val().length < 3 ) return;
    
    // search
    sections.each(function( index ){
        
        var self = $( this );
        var articles = self.find('article');

        articles.each(function( arIndex ){

            var artic = $( this );
            var h2 = $( 'h2', this );

            if( artic.text().toLowerCase().search( searchInput.val().toLowerCase() ) != -1 ){
                searchItems.prepend( '<li><a href="#'+h2.eq(0).attr('id')+'">' + h2.eq(0).text() + '</a></li>' );
            }

        });

    });

});

/**
 * Clear search
 */
$('nav form span').on( 'click', function( event ){
    event.preventDefault();
    searchItems.html('');
    searchInput.val('');
});
