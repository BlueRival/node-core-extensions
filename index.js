"use strict";

var lastConf = null;

module.exports.init = function ( conf ) {

	if ( !conf ) {
		conf = {};
	}

	conf = {
		isObject: typeof conf.isObject === 'string' ? conf.isObject : 'isObject',
		getType: typeof conf.getType === 'string' ? conf.getType : 'getType',
		clone: typeof conf.clone === 'string' ? conf.clone : 'clone',
		mixin: typeof conf.mixin === 'string' ? conf.mixin : 'mixin'
	};

	// validate new config
	for ( var functionName in conf ) {
		if ( conf.hasOwnProperty( functionName ) ) {
			var nameSpace = conf[functionName];
			if ( typeof nameSpace !== 'string' || nameSpace.length < 1 || nameSpace.match( /^[^A-Za-z_]/ ) || nameSpace.match( /[^A-Za-z0-9\-_]/ ) ) {
				throw new Error( 'Name space ' + (typeof nameSpace) + ' for ' + functionName + ' is invalid, must start with letter or underscore, and must only contain letters, numbers dashes and underscores' );
			}
		}
	}

	// undo previous configs if any
	if ( lastConf ) {

		for ( functionName in lastConf ) {
			if ( lastConf.hasOwnProperty( functionName ) ) {
				if ( Object.prototype.hasOwnProperty( lastConf[functionName] ) ) {
					delete Object.prototype[lastConf[functionName]];
				}
			}
		}

	}
	lastConf = conf;

	Object.defineProperty( Object.prototype, conf.isObject, {
		configurable: true,
		enumerable: false,
		value: function ( thing ) {
			return typeof thing === 'object' && !Array.isArray( thing ) && thing !== null;
		}
	} );

	Object.defineProperty( Object.prototype, conf.getType, {
		configurable: true,
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

	Object.defineProperty( Object.prototype, conf.clone, {
		configurable: true,
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
					if ( Array.isArray( this[i] ) || Object[conf.isObject]( this[i] ) ) {
						target[i] = this[i][conf.clone]();
					}
					else {
						target[i] = this[i];
					}
				}
			}
			else if ( Object[conf.isObject]( this ) ) {
				target = {};
				for ( var field in this ) {
					if ( this.hasOwnProperty( field ) ) {
						if ( Array.isArray( this[field] ) || Object[conf.isObject]( this[field] ) ) {
							target[field] = this[field][conf.clone]();
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

	Object.defineProperty( Object.prototype, conf.mixin, {
		configurable: true,
		enumerable: false,
		value: function () {

			mixinDepth++;

			if ( mixinDepth >= 100 ) {
				mixinDepth = 0;
				throw new Error( 'max mixin depth of 100 reached' );
			}

			var target = this[conf.clone](); // clone so we don't modify the original

			// handle arbitrary number of mixins. precedence is from last to first item passed in.
			for ( var i = 0; i < arguments.length; i++ ) {

				var source = arguments[i];

				// mixin the source differently depending on what is in the destination
				switch ( target[conf.getType]() ) {

					case 'object':
					case 'array':
					case 'function':

						// mixin in the source differently depending on its type
						switch ( Object[conf.getType]( source ) ) {

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
											if ( isNaN( fieldFloat ) || fieldFloat.toString().length != field.length || fieldFloat[conf.getType]() != 'integer' ) {
												continue;
											}

										}

										// recurse mixin differently depending on what the target value is
										switch ( Object[conf.getType]( target[field] ) ) {

											// for any non-objects, do this
											case 'undefined':
											case 'null':

												switch ( Object[conf.getType]( source[field] ) ) {
													case 'undefined':
														// NO-OP undefined doesn't override anything
														break;
													case 'null':
														target[field] = null;
														break;
													default:
														target[field] = source[field][conf.clone]();
														break;
												}

												break;

											// if the target is already an object, we can mixin on it
											default:

												target[field] = target[field][conf.mixin]( source[field] );

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
						switch ( Object[conf.getType]( source ) ) {

							// arrays and objects just replace primitives
							case 'array':
							case 'object':

								// override primitives by just passing through a clone of parent
								target = source[conf.clone]();

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

	return module.exports;
};

// auto-init with defaults
module.exports.init();
