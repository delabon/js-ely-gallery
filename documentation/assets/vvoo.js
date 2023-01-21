        /**
        * jQuery Like Light Weight
        */
       (function( window ){

        /**
        * Add matches support for IE9+
        */
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector;
        }

        /**
        * Query selector
        * @param {mix} selector 
        */
        var Query = function( selector ){

            if( typeof selector == 'string' ){
                this.items = [].slice.call( document.querySelectorAll( selector ) );
            }
            else if( this.isNodeList( selector ) ){
                this.items = [].slice.call( selector );            
            }
            else if( selector instanceof Query ){
                this.items = selector.items;
            }
            else if( selector instanceof Node) {
                this.items = [ selector ];
            }
            else if( Array.isArray( selector ) ){
                this.items = selector.filter(function( item ){
                    return item instanceof Node;
                });
            }
            else{
                this.items = [];
            }

        };

        /**
        * Is this a node list ?
        * @param {nodeList} nodes 
        */
        Query.prototype.isNodeList = function(nodes) {
            var stringRepr = Object.prototype.toString.call(nodes);
        
            return typeof nodes === 'object' &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
                (typeof nodes.length === 'number') &&
                (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
        }

        /**
        * Filter the current items
        * @param {string} selector 
        */
        Query.prototype.filter = function( selector ){
            var data = this.items.filter(function( item ){
                return item.matches( selector );
            });

            return new Query( data );
        }

        /**
        * Get parents list
        * @param {string} selector 
        * @return new Query | false
        */
        Query.prototype.parents = function( selector ){
            if( ! this.get(0) ) return false;
            if( ! selector ) return false;

            var item = this.get(0);

            // Setup parents array
            var parents = [];

            // Get matching parent elements
            for ( ; item && item !== document; item = item.parentNode ) {
                if ( item.matches( selector ) ) {
                    parents.push( item );
                }
            }

            return new Query( parents );
        }

        /**
        * Get parent
        * @return new Query | false
        */
        Query.prototype.parent = function(){
            if( ! this.get(0) ) return false;
            return new Query( this.get(0).parentNode );
        }

        /**
        * Add Class
        * @param {string} className 
        * @return this
        */
        Query.prototype.addClass = function( className ){
            if( className.search(' ') == -1 ){
                this.items.map(function( item ){
                    item.classList.add( className );
                });
            }
            else{
                var classes = className.split(' ').filter(function( currentClass ){
                    return currentClass != '' && currentClass != ' ';
                });

                this.items.map(function( item ){
                    classes.map(function( className ){
                        item.classList.add( className );
                    });
                });
            }

            return this;
        };

        /**
        * Has class ?
        * @param {string} className 
        * @return bool
        */
        Query.prototype.hasClass = function( className ){
            if( ! this.get(0) ) return false;
            return this.get(0).classList.contains( className );
        };

        /**
        * Remove class 
        * @param {string} className 
        * @return this
        */
        Query.prototype.removeClass = function( className ){
            
            if( className.search(' ') == -1 ){
                this.items.map(function( item ){
                    item.classList.remove( className );
                });
            }
            else{
                var classes = className.split(' ').filter(function( currentClass ){
                    return currentClass != '' && currentClass != ' ';
                });

                this.items.map(function( item ){
                    classes.map(function( className ){
                        item.classList.remove( className );
                    });
                });
            }

            return this;
        };

        /**
        * loop through each item
        * @param {function} callback 
        */
        Query.prototype.each = function( callback ){
            if( typeof callback != 'function' ) return false;

            this.items.map(function( item ){
                callback( item );
            });
        };

        /**
        * Get items or an item with an index
        * @return array | Node | bool
        */
        Query.prototype.get = function(){
            if( arguments.length ){
                if( this.items[ arguments[0] ] ){
                    return this.items[ arguments[0] ];
                }
                
                return false;
            }
            else{
                return this.items;
            }
        };

        /**
        * Add events
        * @param  {string}   event    
        * @param  {Function} callback
        */
        Query.prototype.on = function( event, callback ){
            this.items.map(function( item ){
                item.addEventListener( event, callback );
            });
        };

        /**
        * Get last item
        * @return new Query|false      
        */
        Query.prototype.last = function(){
            if( this.items.length ){
                return new Query( this.get( this.items.length - 1 ) );
            }
            return false;
        };

        /**
        * Get first item
        * @return new Query|false      
        */
        Query.prototype.first = function(){
            if( this.items.length ){
                return new Query( this.get(0) );
            }
            return false;
        };

        /**
        * Find children
        * @return new Query|false      
        */
        Query.prototype.find = function( selector ){
            if( this.get(0) && selector ){
                return new Query( this.get(0).querySelectorAll( selector ) );
            }

            return false;
        };

        /**
        * Remove
        * @return this     
        */
        Query.prototype.remove = function(){
            this.items.map(function( item ){
                item.remove();
            });

            this.items = [];
            return this;
        };

        /**
        * Get or Set Value
        * @param {mix} value 
        */
        Query.prototype.value = function( value ){

            // set value
            if( value != undefined ){
                this.items.map(function( item ){
                    item.value = value;
                });

                return this;
            }

            // get value
            else if( this.get(0) ) {
                return this.get(0).value;
            }
        }

        /**
        * Get or Set Text
        * @param {mix} value 
        */
        Query.prototype.text = function( value ){

            // set value
            if( value ){
                this.items.map(function( item ){
                    item.textContent = value;
                });

                return this;
            }

            // get value
            else if( this.get(0) ) {
                return this.get(0).textContent;
            }
        }

        /**
        * Get or Set HTML
        * @param {mix} value 
        */
        Query.prototype.html = function( value ){

            // set value
            if( value != undefined ){
                this.items.map(function( item ){
                    item.innerHTML = value;
                });

                return this;
            }

            // get value
            else if( this.get(0) ) {
                return this.get(0).innerHTML;
            }
        }

        /**
        * Get/Set attribute
        * @param  {string} name 
        * @param  {string} value 
        * @return {this}      
        */
        Query.prototype.attr = function( name, value ){
            if( this.get(0) && name && value == undefined ){
                return this.get(0).getAttribute( name );
            }
            else if( name && value != undefined ){
                this.items.map(function( item ){
                    item.setAttribute( name, value );
                });
            }
        };

        /**
        * Create a HTML tag from a string ex <div class="a">text</div>
        * @param {String} html
        * @return {Element}
        */
        Query.prototype.htmlToElement = function(html) {
            var template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }

        /**
        * Append
        * @param {mix} value 
        */
        Query.prototype.append = function( value ){
            if( ! value ) return this;

            if( value instanceof Node ){
                value = value.outerHTML;
            }
            else if( value instanceof Query ){
                if( ! value.get(0) ) return this;
                value = value.get(0).outerHTML;
            }

            this.items.map(function( item ){
                item.innerHTML += value;
            });

            return this;
        }

        /**
        * Prepend
        * @param {mix} value 
        */
        Query.prototype.prepend = function( value ){
            if( ! value ) return this;

            if( value instanceof Node ){
                value = value.outerHTML;
            }
            else if( value instanceof Query ){
                if( ! value.get(0) ) return this;
                value = value.get(0).outerHTML;
            }

            this.items.map(function( item ){
                item.innerHTML = value + item.innerHTML;
            });

            return this;
        }
        
        /**
        * jQuery Like Lightweight
        * @param {string} selector 
        */
        window.vvoo = function( selector ){
            return new Query( selector );        
        };

    })( window );








        /**
         * Code highlight
         */ 
        vvoo( 'code, pre' ).each(function(item) {
            hljs.highlightBlock( item   );
        });

        /** 
        * Docs Script
        */
        var menuItems = vvoo('nav a');
        var sections = vvoo('section');
        var searchInput = vvoo('nav input');
        var searchItems = vvoo('nav form ul');

        /**
        * Listen for page link change
        * @param {object} event 
        */
        window.onpopstate = function(event) {
            var hash = location.hash;

            menuItems.filter('.active').removeClass('active');

            menuItems.each(function( item ){
                var self = vvoo( item );
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

                    sections.each(function( section ){
                        section = vvoo( section );
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
        vvoo('form').on('submit', function( event ){
            event.preventDefault();
        });

        /**
         * Listen for search change
         */
        searchInput.on('keyup', function( event){
            
            // reset
            searchItems.html('');

            if( searchInput.value().length < 3 ) return;
            
            // search
            sections.each(function( article ){
                
                var self = vvoo( article );
                var h2 = self.find('h2');

                if( self.text().toLowerCase().search( searchInput.value().toLowerCase() ) != -1 ){
                    searchItems.prepend( '<li><a href="#'+h2.attr('id')+'">' + h2.text() + '</a></li>' );
                }

            });

        });

        /**
         * Clear search
         */
        vvoo('nav form span').on( 'click', function( event ){
            event.preventDefault();
            searchItems.html('');
            searchInput.value('');
        });
