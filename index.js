"use strict";

Object.isObject = function ( thing ) {
	return typeof thing === 'object' && !Array.isArray( thing ) && thing !== null;
};

Object.defineProperty( Object.prototype, "clone", {
	enumerable: false,
	value:      function () {

		var target = null;
		var type = typeof this;

		if ( this === undefined ) {
			target = undefined;
		}
		else if ( this === null ) {
			target = null;
		}
		else if ( type == 'string' || type == 'number' || type == 'boolean' ) {
			target = this;
		}
		else if ( this instanceof Date ) {
			target = new Date( this.toISOString() );
		}
		else if ( Object.isObject( this ) || Array.isArray( this ) ) {
			target = JSON.parse( JSON.stringify( this ) ); // probably a slightly more efficient way to do this, but this is ok for now
		}
		else { // functions, etc. not clonable yet
			target = undefined;
		}

		return target;
	}
} );

Object.defineProperty( Object.prototype, "mixin", {
	enumerable: false,
	value:      function () {

		var child = this.clone(); // clone so we don't modify the original

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof child !== "object" && typeof child != 'function' ) {
			child = {};
		}

		// handle arbitrary number of mixins. precedence is from last to first item passed in.
		for ( var i = 0; i < arguments.length; i++ ) {

			var parent = arguments[i];

			if ( !parent || (!Array.isArray( parent ) && !Object.isObject( parent ) ) ) {
				continue;
			}

			// Extend the base object
			for ( var name in parent ) {

				// don't copy parent stuffs
				if ( parent.hasOwnProperty( name ) ) {

					var target = child[ name ];
					var source = parent[ name ];

					// Prevent never-ending loop
					if ( child === source ) {
						continue;
					}

					// if target exists and is an array...
					if ( Array.isArray( target ) ) {

						if ( Array.isArray( source ) ) {

							// ...merge source array into target array
							for ( var j = 0; j < source.length; j++ ) {

								if ( typeof child[ name ][j] === 'object' ) {
									child[ name ][j] = child[ name ][j].mixin( source[j] );
								}
								else {
									child[ name ][j] = source[j];
								}

							}

						}

					}
					// if target is an object, try to mixin source
					else if ( Object.isObject( target ) ) {

						target.mixin( source );

					}
					// otherwise, target becomes source
					else {

						child[ name ] = source;

					}
				}
			}

		}

		return child;
	}
} );




