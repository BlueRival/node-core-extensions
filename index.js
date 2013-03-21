"use strict";

Object.defineProperty( Object.prototype, 'isObject', {
	enumerable: false,
	value: function ( thing ) {
		return typeof thing === 'object' && !Array.isArray( thing ) && thing !== null;
	}
} );

Object.defineProperty( Object.prototype, 'getType', {
	enumerable: false,
	value: function ( thing ) {

		// support calling on Object root class directly, or off a variable (doesn't work directly off of variable for undefined or null)
		if ( arguments.length < 1 ) {
			thing = this;
		}

		// handle exceptions that typeof doesn't handle
		if ( thing === null ) {
			return 'null';
		}
		else if ( Array.isArray( thing ) ) {
			return 'array';
		}

		var type = typeof thing;

		// more resolution on numbers
		if ( type === 'number' ) {
			if ( Math.ceil( thing ) > Math.floor( thing ) ) {
				type = 'float';
			}
			else {
				type = 'integer';
			}
		}

		return type;

	}
} );

var cloneDepth = 0;

Object.defineProperty( Object.prototype, "clone", {
	enumerable: false,
	value: function () {

		cloneDepth++;

		if ( cloneDepth >= 100 ) {
			cloneDepth = 0;
			throw new Error( 'max clone depth of 100 reached' );
		}

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
		else { // functions, etc. not clonable yet, and will pass through, though for primitives like strings and numbers, this is cloning
			target = this;
		}

		cloneDepth--;

		return target;
	}
} );

var mixinDepth = 0;

Object.defineProperty( Object.prototype, "mixin", {
	enumerable: false,
	value: function () {

		mixinDepth++;

		if ( mixinDepth >= 100 ) {
			mixinDepth = 0;
			throw new Error( 'max mixin depth of 100 reached' );
		}

		var target = this.clone(); // clone so we don't modify the original

		// handle arbitrary number of mixins. precedence is from last to first item passed in.
		for ( var i = 0; i < arguments.length; i++ ) {

			var source = arguments[i];

			// mixin the source differently depending on what is in the destination
			switch ( target.getType() ) {

				case 'object':
				case 'array':
				case 'function':

					// mixin in the source differently depending on its type
					switch ( Object.getType( source ) ) {

						case 'array':
						case 'object':
						case 'function':

							// we don't care what descendant of object the source is
							for ( var field in source ) {

								// don't mixin parent fields
								if ( source.hasOwnProperty( field ) ) {

									// if the target is an array, only take fields that are integers
									if ( Array.isArray( target ) ) {

										var fieldFloat = parseFloat( field );

										// the field started with a number, or no number at all, then had non-numeric characters
										if ( isNaN( fieldFloat ) || fieldFloat.toString().length != field.length || fieldFloat.getType() != 'integer' ) {
											continue;
										}

									}

									// recurse mixin differently depending on what the target value is
									switch ( Object.getType( target[field] ) ) {

										// for any non-objects, do this
										case 'undefined':
										case 'null':

											switch ( Object.getType( source[field] ) ) {
												case 'undefined':
													// NO-OP undefined doesn't override anything
													break;
												case 'null':
													target[field] = null;
													break;
												default:
													target[field] = source[field].clone();
													break;
											}

											break;

										// if the target is already an object, we can mixin on it
										default:

											target[field] = target[field].mixin( source[field] );

											break;
									}

								}
							}

							break;

						default:
							// NO-OP, primitives can't mixin to objects, arrays and functions
							break;

					}

					break;

				default:

					// mixin in the source differently depending on its type
					switch ( Object.getType( source ) ) {

						// arrays and objects just replace primitives
						case 'array':
						case 'object':

							// override primitives by just passing through a clone of parent
							target = source.clone();

							break;

						default:

							// target is a primitive and can't be null or undefined here, and all other primitives have equal precedence, so just pass through
							target = source;

							break;

					}

					break;
			}

		}

		mixinDepth--;

		return target;

	}
} );




