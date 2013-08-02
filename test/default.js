'use strict';

var assert = require( 'assert' );
var coreExtensions = require( '../' );

var nameSpaces = [
	undefined, // default init
	{ // test uniform namespace and unset of default
		isObject: 'oneIsObject',
		getType: 'oneGetType',
		clone: 'one-Clone',
		mixin: 'oneMixin'
	},
	{ // test uniform namespace and unset of custom namespace
		isObject: 'twoIsObject',
		getType: 'twoGetType',
		clone: 'twoClone',
		mixin: '_twoMixin'
	},
	{ // test partial namespace and unset of custom namespace
		getType: 'threeGetType',
		clone: 'four_Clone'
	},
	{ // test uniform namespace and unset of custom namespace
		isObject: 'sixIs0bject',
		getType: 'sixGetType4',
		clone: 'six-Clone',
		mixin: 'sixMixin'
	},
	{ // test explicit set of default name space and unset of custom namespace
		isObject: 'isObject',
		getType: 'getType',
		clone: 'clone',
		mixin: 'mixin'
	}
];

for ( var i = 1; i < nameSpaces.length; i++ ) {
	testNameSpace( nameSpaces[i] );
	if ( i > 0 ) {
		testUnsetNameSpace( nameSpaces[i - 1] );
	}

}

testImproperNameSpaces();


function testImproperNameSpaces() {
	describe( 'set improper namespaces', function () {

		[
			'334kj' ,
			'hlkjdf*' ,
			'*sdfsadf' ,
			'sdfasdf.safasdf.' ,
			'isObjec.t' ,
			'isObject$'
		].forEach(
			function ( nameSpace ) {
				testImproperNameSpace( nameSpace );
			}
		);

	} );
}

function testImproperNameSpace( nameSpace ) {
	it( 'should not allow the nameSpace ' + nameSpace, function () {

		assert.throws( function () {

			coreExtensions.init( {
				isObject: nameSpace
			} );

		}, Error );

	} );
}

function testUnsetNameSpace( conf ) {

	if ( !conf ) {
		conf = {};
	}

	describe( 'unset namespace ' + JSON.stringify( conf ), function () {

		var expectedConf = {
			isObject: typeof conf.isObject === 'string' ? conf.isObject : 'isObject',
			getType: typeof conf.getType === 'string' ? conf.getType : 'getType',
			clone: typeof conf.clone === 'string' ? conf.clone : 'clone',
			mixin: typeof conf.mixin === 'string' ? conf.mixin : 'mixin'
		};

		describe( 'isObject', function () {
			it( 'should be undefined', function () {
				assert.strictEqual( Object[expectedConf.isObject], undefined, 'was not undefined' );
			} );
		} );
		describe( 'getType', function () {
			it( 'should be undefined', function () {
				assert.strictEqual( Object[expectedConf.getType], undefined, 'was not undefined' );
			} );
		} );
		describe( 'clone', function () {
			it( 'should be undefined', function () {
				assert.strictEqual( Object[expectedConf.clone], undefined, 'was not undefined' );
			} );
		} );
		describe( 'mixin', function () {
			it( 'should be undefined', function () {
				assert.strictEqual( Object[expectedConf.mixin], undefined, 'was not undefined' );
			} );
		} );

	} );
}

function testNameSpace( conf ) {

	describe( 'set namespace ' + JSON.stringify( conf ), function () {

		var init = conf !== undefined;

		if ( !conf ) {
			conf = {};
		}

		var expectedConf = {
			isObject: typeof conf.isObject === 'string' ? conf.isObject : 'isObject',
			getType: typeof conf.getType === 'string' ? conf.getType : 'getType',
			clone: typeof conf.clone === 'string' ? conf.clone : 'clone',
			mixin: typeof conf.mixin === 'string' ? conf.mixin : 'mixin'
		};

		if ( init ) {
			before( function () {
				coreExtensions.init( conf );
			} );
		}

		describe( 'isObject', function () {

			it( 'should return false for an array', function () {
				assert.equal( Object[expectedConf.isObject]( [] ), false );
				assert.equal( Object[expectedConf.isObject]( [ "one", "two", "three" ] ), false );
			} );

			it( 'should return false for NULL', function () {
				assert.equal( Object[expectedConf.isObject]( null ), false );
			} );

			it( 'should return false for UNDEFINED', function () {
				assert.equal( Object[expectedConf.isObject]( undefined ), false );
			} );

			it( 'should return false for a string', function () {
				assert.equal( Object[expectedConf.isObject]( "string" ), false );
				assert.equal( Object[expectedConf.isObject]( "" ), false );
			} );

			it( 'should return false for an integer', function () {
				assert.equal( Object[expectedConf.isObject]( 1 ), false );
				assert.equal( Object[expectedConf.isObject]( 0 ), false );
				assert.equal( Object[expectedConf.isObject]( -1 ), false );
			} );

			it( 'should return false for a float', function () {
				assert.equal( Object[expectedConf.isObject]( 1.1 ), false );
				assert.equal( Object[expectedConf.isObject]( 0.0 ), false );
				assert.equal( Object[expectedConf.isObject]( -1.1 ), false );
			} );

			it( 'should return false for a boolean', function () {
				assert.equal( Object[expectedConf.isObject]( true ), false );
				assert.equal( Object[expectedConf.isObject]( false ), false );
			} );

			it( 'should return true for an object {}', function () {
				assert.equal( Object[expectedConf.isObject]( {} ), true );
			} );

			describe( 'should return true for any kind of object:', function () {

				it( 'new Date()', function () {
					assert.equal( Object[expectedConf.isObject]( new Date() ), true );
				} );

				it( 'new RegExp()', function () {
					assert.equal( Object[expectedConf.isObject]( new RegExp() ), true );
				} );

			} );

		} );

		describe( 'getType', function () {

			it( 'should handle UNDEFINED', function () {
				assert.equal( Object[expectedConf.getType]( undefined ), 'undefined' );
			} );

			it( 'should handle NULL', function () {
				assert.equal( Object[expectedConf.getType]( null ), 'null' );
			} );

			it( 'should handle strings', function () {
				assert.equal( Object[expectedConf.getType]( "string" ), "string" );
				assert.equal( "string"[expectedConf.getType](), "string" );
			} );

			it( 'should handle integers', function () {
				assert.equal( Object[expectedConf.getType]( 1 ), 'integer' );
				assert.equal( (1)[expectedConf.getType](), 'integer' );
				assert.equal( Object[expectedConf.getType]( -1 ), 'integer' );
				assert.equal( (-1)[expectedConf.getType](), 'integer' );
				assert.equal( Object[expectedConf.getType]( 0 ), 'integer' );
				assert.equal( (0)[expectedConf.getType](), 'integer' );
				assert.equal( Object[expectedConf.getType]( 0.0 ), 'integer' );
				assert.equal( (0.0)[expectedConf.getType](), 'integer' );
				assert.equal( Object[expectedConf.getType]( Number.MAX_VALUE ), 'integer' );
				assert.equal( (Number.MAX_VALUE)[expectedConf.getType](), 'integer' );
				assert.equal( Object[expectedConf.getType]( -Number.MAX_VALUE ), 'integer' );
				assert.equal( (-Number.MAX_VALUE)[expectedConf.getType](), 'integer' );
			} );

			it( 'should handle floats', function () {
				assert.equal( Object[expectedConf.getType]( 1.1 ), 'float' );
				assert.equal( (1.1)[expectedConf.getType](), 'float' );
				assert.equal( Object[expectedConf.getType]( -1.1 ), 'float' );
				assert.equal( (-1.1)[expectedConf.getType](), 'float' );
				assert.equal( Object[expectedConf.getType]( Number.MIN_VALUE ), 'float' );
				assert.equal( (Number.MIN_VALUE)[expectedConf.getType](), 'float' );
				assert.equal( Object[expectedConf.getType]( -Number.MIN_VALUE ), 'float' );
				assert.equal( (-Number.MIN_VALUE)[expectedConf.getType](), 'float' );
			} );

			it( 'should handle booleans', function () {
				assert.equal( Object[expectedConf.getType]( true ), 'boolean' );
				assert.equal( Object[expectedConf.getType]( false ), 'boolean' );
				assert.equal( (true)[expectedConf.getType](), 'boolean' );
				assert.equal( (false)[expectedConf.getType](), 'boolean' );
			} );

			it( 'should handle arrays', function () {
				assert.equal( Object[expectedConf.getType]( [] ), 'array' );
				assert.equal( Object[expectedConf.getType]( [ "one", "two", "three" ] ), 'array' );
				assert.equal( [][expectedConf.getType](), 'array' );
				assert.equal( [ "one", "two", "three" ][expectedConf.getType](), 'array' );
			} );

			it( 'should handle functions', function () {
				assert.equal( Object[expectedConf.getType]( function () {
				} ), 'function' );
				assert.equal( (function () {
				})[expectedConf.getType](), 'function' );
			} );

			it( 'should handle {}', function () {
				assert.equal( Object[expectedConf.getType]( {} ), 'object' );
				assert.equal( {}[expectedConf.getType](), 'object' );
			} );

			describe( 'should handle any other kind of object:', function () {

				it( 'new Date()', function () {
					assert.equal( Object[expectedConf.getType]( new Date() ), 'object' );
					assert.equal( (new Date())[expectedConf.getType](), 'object' );
				} );

				it( 'new RegExp()', function () {
					assert.equal( Object[expectedConf.getType]( new RegExp() ), 'object' );
					assert.equal( (new RegExp())[expectedConf.getType](), 'object' );
				} );

			} );

		} );

		describe( 'clone', function () {

			describe( 'string', function () {

				var theString = 'the string';

				it( 'should return a string', function () {
					assert.equal( typeof (theString[expectedConf.clone]()), 'string' );
				} );

				it( 'should return a new string with same value', function () {
					assert.equal( theString[expectedConf.clone](), theString );
				} );

			} );

			describe( 'Date', function () {

				var theDate = new Date();

				it( 'should return a date object', function () {
					assert.ok( theDate[expectedConf.clone]() instanceof Date );
				} );

				it( 'should have the same ISO date', function () {
					assert.equal( theDate[expectedConf.clone]().toISOString(), theDate.toISOString() );
				} );

				it( 'should be a new object', function () {
					assert.notStrictEqual( theDate[expectedConf.clone](), theDate );
				} );

			} );

			describe( 'Objects and Arrays', function () {

				var theObject = {
					'array field': [
						'hi', 'there'
					],
					'number': 1,
					'float': 1.04,
					'array numbers': [
						1, 4.45, 32, 3, 3413, function () {
						}
					],
					'func': function () {
					},
					'object': {
						'array field': [
							'hi', 'there'
						],
						'number': 1,
						'float': 1.04,
						'array numbers': [
							1, 4.45, 32, 3, 3413,
							{
								name: 'user1'
							},
							{
								name: 'user2'
							}
						],
						'object': {
							'deep': {
								'array': [
									{
										'more:': 'here'
									}
								]
							}
						}
					}
				};

				it( 'should return an object', function () {
					assert.ok( theObject[expectedConf.clone]() instanceof Object );
				} );

				it( 'should have the same structure and values', function () {
					assert.deepEqual( theObject[expectedConf.clone](), theObject );
				} );

				it( 'should be a new object', function () {
					assert.notStrictEqual( theObject[expectedConf.clone](), theObject );
				} );

				it( 'should not recurse beyond 100 levels', function () {
					assert.throws( function () {

						var cloneObject = {};
						var ref = cloneObject;

						for ( var i = 0; i < 300; i++ ) {
							ref.nesting = {};
							ref = ref.nesting;
						}

						ref.final = "hi";

						cloneObject[expectedConf.clone]();

					} );
				} );

			} );

			describe( 'everything else', function () {

				var theFunction = function () {
					return 'hello';
				};

				it( 'should be === of original', function () {
					assert.strictEqual( theFunction[expectedConf.clone](), theFunction );
				} );

			} );

		} );

		describe( 'mixin', function () {

			var theObject = {
				statusCode: 200,
				data: {
					subscription: {
						id: '1234567890',
						principal_id: 'STACK',
						callback_url: 'https://a.host.com',
						date_created: '2013-02-04T06:57:18Z',
						tags: {
							string: 'germany'
						}
					},
					contacts: [
						{
							name: 'user1'
						},
						{
							name: 'user2'
						}
					]
				},
				func: function () {
				}
			};

			var theDefaultObject = {
				statusCode: 500,
				data: {
					subscription: {
						id: null
					},
					contacts: []
				}
			};

			var theArray = [
				'one',
				1,
				'onepointone',
				1.1,
				{
					'hi': 'germany',
					'bye': 'france',
					'an array': [
						'one',
						function () {
						},
						1,
						'onepointone',
						1.1,
						{
							'hi 2': 'germany',
							'bye 2': 'france',
							'an array 2': [

							]
						}
					]
				}
			];

			var theDefaultArray = [
				'two',
				undefined,
				null,
				null,
				{
					'hi': null
				}
			];

			// original should not be modified
			it( 'should not modify original object', function () {
				theDefaultObject[expectedConf.mixin]( theObject );
				assert.notDeepEqual( theObject, theDefaultObject );
			} );
			it( 'should not modify original array', function () {
				theDefaultArray[expectedConf.mixin]( theArray );
				assert.notDeepEqual( theArray, theDefaultArray );
			} );

			// a new one
			it( 'should return a new object', function () {
				assert.notStrictEqual( theObject[expectedConf.mixin]( {} ), theObject );
			} );
			it( 'should return a new array', function () {
				assert.notStrictEqual( theArray[expectedConf.mixin]( {} ), theArray );
			} );

			// deep structure with empty default
			it( 'should return the same deep structure with empty default object', function () {
				assert.notStrictEqual( {}[expectedConf.mixin]( theObject ), theObject );
			} );
			it( 'should return the same deep structure with empty default array', function () {
				assert.notStrictEqual( [][expectedConf.mixin]( theArray ), theArray );
			} );

			// deep structure with empty input
			it( 'should return the same deep structure with empty input object', function () {
				assert.deepEqual( theObject[expectedConf.mixin]( {} ), theObject );
			} );
			it( 'should return the same deep structure with empty input array', function () {
				assert.deepEqual( theArray[expectedConf.mixin]( [] ), theArray );
			} );

			// deep structure with undefined input
			it( 'should return the same deep structure with undefined input object', function () {
				assert.deepEqual( theObject[expectedConf.mixin]( undefined ), theObject );
			} );
			it( 'should return the same deep structure with undefined input array', function () {
				assert.deepEqual( theArray[expectedConf.mixin]( undefined ), theArray );
			} );

			// deep structure with null input
			it( 'should return the same deep structure with null input object', function () {
				assert.deepEqual( theObject[expectedConf.mixin]( null ), theObject );
			} );
			it( 'should return the same deep structure with null input array', function () {
				assert.deepEqual( theArray[expectedConf.mixin]( null ), theArray );
			} );

			// deep structure with initialized default
			it( 'should return the same deep structure with initialized default object', function () {
				assert.deepEqual( theDefaultObject[expectedConf.mixin]( theObject ), theObject );
			} );
			it( 'should return the same deep structure with initialized default array', function () {
				assert.deepEqual( theDefaultArray[expectedConf.mixin]( theArray ), theArray );
			} );

			// mixin an object to an array
			it( 'should mixin all integer fields from the object to the array', function () {

				var theArrayFromObject = {
					'zero': 0,
					'one': 1,
					'two': 2,
					0: 0,
					1: 1,
					'2': 2,
					'3.0': 'three.zero',
					3: 3,
					'4.1': 4,
					5.2: 5,
					'6six': 6,
					7: 7
				};

				var theDefaultArrayFromObject = [
					'zero',
					[
						'one'
					],
					'two',
					'three',
					{
						'four': 4
					}
				];

				var expectedArrayFromObject = [
					0,
					[ 'one' ],
					2,
					3,
					{
						'four': 4
					}
				];
				expectedArrayFromObject[7] = 7;

				assert.deepEqual( theDefaultArrayFromObject[expectedConf.mixin]( theArrayFromObject ), expectedArrayFromObject );

			} );

			// mixin an array to an object
			it( 'should mixin in an array to an object by converting the integer indexes in the array to string field names in the object', function () {

				var theObjectFromArray = [
					'zero',
					'one',
					'two',
					'three'
				];
				theObjectFromArray[5] = 'five';


				var theDefaultObjectFromArray = {
					zero: 0,
					'one': 1,
					'two': 2,
					0: 0,
					1: 1,
					'2': 2
				};

				var expectedObjectFromArray = {
					'0': 'zero',
					'1': 'one',
					'2': 'two',
					'3': 'three',
					'5': 'five',
					zero: 0,
					one: 1,
					two: 2
				};

				assert.deepEqual( theDefaultObjectFromArray[expectedConf.mixin]( theObjectFromArray ), expectedObjectFromArray );

			} );

			it( 'should mixin nested arrays to objects', function () {

				var theInput = {
					two: [
						'zero',
						'one',
						'two',
						'three'
					]
				};
				theInput.two[5] = 'five';


				var theDefault = {
					zero: 0,
					'one': 1,
					'two': {
						zero: 0,
						'one': 1,
						'two': 'two',
						0: 0,
						1: 1,
						'2': 2
					},
					0: 0,
					1: 1,
					'2': 2
				};

				var expectedObject = {
					'0': 0,
					'1': 1,
					'2': 2,
					'zero': 0,
					'one': 1,
					'two': {
						'0': 'zero',
						'1': 'one',
						'2': 'two',
						'3': 'three',
						'5': 'five',
						'zero': 0,
						'one': 1,
						'two': 'two'
					}
				};

				assert.deepEqual( theDefault[expectedConf.mixin]( theInput ), expectedObject );

			} );

			it( 'should mixin arrays over primitives', function () {

				var theArray = [
					'one',
					'two',
					{
						'three': 'four'
					},
					[
						'five'
					]
				];

				assert.deepEqual( (true)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (false)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (1)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (-1)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (1.1)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (-1.1)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (0)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( (0.0)[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( ("string")[expectedConf.mixin]( theArray ), theArray );
				assert.deepEqual( ("")[expectedConf.mixin]( theArray ), theArray );

			} );

			it( 'should mixin objects over primitives', function () {

				var theObject = {
					'one': 1,
					'two': 2,
					'three': {
						'four': 4
					},
					'five': [
						'six'
					]
				};

				assert.deepEqual( (true)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (false)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (1)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (-1)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (1.1)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (-1.1)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (0)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( (0.0)[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( ("string")[expectedConf.mixin]( theObject ), theObject );
				assert.deepEqual( ("")[expectedConf.mixin]( theObject ), theObject );

			} );

			it( 'should not mixin primitives over objects', function () {

				var theObject = {
					'one': 1,
					'two': 2,
					'three': {
						'four': 4
					},
					'five': [
						'six'
					]
				};

				assert.deepEqual( theObject[expectedConf.mixin]( undefined ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( null ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( true ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( false ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( 1 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( -1 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( 1.1 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( -1.1 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( 0 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( 0.0 ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( "string" ), theObject );
				assert.deepEqual( theObject[expectedConf.mixin]( "" ), theObject );

			} );

			it( 'should not mixin primitives over arrays', function () {

				var theArray = [
					'one',
					'two',
					{
						'three': 'four'
					},
					[
						'five'
					]
				];

				assert.deepEqual( theArray[expectedConf.mixin]( undefined ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( null ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( true ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( false ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( 1 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( -1 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( 1.1 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( -1.1 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( 0 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( 0.0 ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( "string" ), theArray );
				assert.deepEqual( theArray[expectedConf.mixin]( "" ), theArray );

			} );

			it( 'should not recurse beyond 100 levels', function () {
				assert.throws( function () {

					var mixinObject1 = {};
					var mixinObject2 = {};
					var ref1 = mixinObject1;
					var ref2 = mixinObject2;

					for ( var i = 0; i < 300; i++ ) {
						ref1.nesting = {};
						ref1 = ref1.nesting;
						ref2.nesting = {};
						ref2 = ref2.nesting;
					}

					ref1.final = "hi";
					ref2.final = "bye";

					mixinObject1[expectedConf.mixin]( mixinObject2 );

				} );
			} );

		} );
	} );
}
