"use strict";

Object.isObject = function ( thing ) {
	return typeof thing === 'object' && !Array.isArray( thing ) && thing !== null;
};

Object.defineProperty( Object.prototype, "clone", {
	enumerable: false,
	value: function () {

		var target = null;

		if ( this instanceof Date ) {
			target = new Date( this.toISOString() );
		}
		else if ( Array.isArray( this ) ) {
			target = [];
			for ( var i = 0; i < this.length; i++ ) {
				if ( Array.isArray( this[i] ) || Object.isObject( this[i] ) ) {
					target[i] = this[i].clone();
				}
				else {
					target[i] = this[i];
				}
			}
		}
		else if ( Object.isObject( this ) ) {
			target = {};
			for ( var field in this ) {
				if ( this.hasOwnProperty( field ) ) {
					if ( Array.isArray( this[field] ) || Object.isObject( this[field] ) ) {
						target[field] = this[field].clone();
					}
					else {
						target[field] = this[field];
					}
				}
			}
		}
		else { // functions, etc. not clonable yet, just pass through
			target = this;
		}

		return target;
	}
} );

var mixinDepth = 0;

Object.defineProperty( Object.prototype, "mixin", {
	enumerable: false,
	value: function () {

		mixinDepth++;

		if ( mixinDepth >= 100 ) {
			throw new Error( 'max mixin depth of ' + mixinDepth + ' reached' );
		}

		var child = this.clone(); // clone so we don't modify the original

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof child !== "object" && typeof child !== 'function' ) {
			child = {};
		}
		var childIsArray = Array.isArray( child );

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

					// only allow integer fields from parent if target is an array
					if ( childIsArray ) {

						var parsedName = parseFloat( name );

						// detect not numbers
						if ( isNaN( parsedName ) ) {
							continue;
						}

						// detect floating point
						if ( name.length !== Math.floor( parsedName ).toString().length ) {
							continue;
						}

					}

					var target = child[ name ];
					var source = parent[ name ];

					// if target exists and is an array...
					if ( Array.isArray( target ) ) {

						// can't replace an array in the target with anything else
						if ( Array.isArray( source ) ) {

							// ...merge source array into target array
							for ( var j = 0; j < source.length; j++ ) {

								child[ name ][j] = child[ name ][j].mixin( source[j] );

							}

						}

					}

					// if target is an object, try to mixin source
					else if ( Object.isObject( target ) ) {
						child[ name ] = target.mixin( source );
					}

					else if ( source === undefined ) {
						child[ name ] = undefined;
					}

					else if ( source === null ) {
						child[ name ] = null;
					}

					// otherwise, target becomes source
					else {
						child[ name ] = source.clone();
					}
				}
			}

		}

		mixinDepth--;

		return child;

	}
} );




