'use strict';

require( '../' );
var assert = require( 'assert' );

describe( 'Object.isObject()', function () {

	it( 'should return false for an array', function () {
		assert.equal( Object.isObject( [] ), false );
		assert.equal( Object.isObject( [ "one", "two", "three" ] ), false );
	} );

	it( 'should return false for NULL', function () {
		assert.equal( Object.isObject( null ), false );
	} );

	it( 'should return false for UNDEFINED', function () {
		assert.equal( Object.isObject( undefined ), false );
	} );

	it( 'should return false for a string', function () {
		assert.equal( Object.isObject( "string" ), false );
		assert.equal( Object.isObject( "" ), false );
	} );

	it( 'should return false for an integer', function () {
		assert.equal( Object.isObject( 1 ), false );
		assert.equal( Object.isObject( 0 ), false );
		assert.equal( Object.isObject( -1 ), false );
	} );

	it( 'should return false for a float', function () {
		assert.equal( Object.isObject( 1.1 ), false );
		assert.equal( Object.isObject( 0.0 ), false );
		assert.equal( Object.isObject( -1.1 ), false );
	} );

	it( 'should return false for a boolean', function () {
		assert.equal( Object.isObject( true ), false );
		assert.equal( Object.isObject( false ), false );
	} );

	it( 'should return true for an object {}', function () {
		assert.equal( Object.isObject( {} ), true );
	} );

	describe( 'should return true for any kind of object:', function () {

		it( 'new Date()', function () {
			assert.equal( Object.isObject( new Date() ), true );
		} );

		it( 'new RegExp()', function () {
			assert.equal( Object.isObject( new RegExp() ), true );
		} );

	} );

} );

describe( 'Object.getType()', function () {

	it( 'should handle UNDEFINED', function () {
		assert.equal( Object.getType( undefined ), 'undefined' );
	} );

	it( 'should handle NULL', function () {
		assert.equal( Object.getType( null ), 'null' );
	} );

	it( 'should handle strings', function () {
		assert.equal( Object.getType( "string" ), "string" );
		assert.equal( "string".getType(), "string" );
	} );

	it( 'should handle integers', function () {
		assert.equal( Object.getType( 1 ), 'integer' );
		assert.equal( (1).getType(), 'integer' );
		assert.equal( Object.getType( -1 ), 'integer' );
		assert.equal( (-1).getType(), 'integer' );
		assert.equal( Object.getType( 0 ), 'integer' );
		assert.equal( (0).getType(), 'integer' );
		assert.equal( Object.getType( 0.0 ), 'integer' );
		assert.equal( (0.0).getType(), 'integer' );
		assert.equal( Object.getType( Number.MAX_VALUE ), 'integer' );
		assert.equal( (Number.MAX_VALUE).getType(), 'integer' );
		assert.equal( Object.getType( -Number.MAX_VALUE ), 'integer' );
		assert.equal( (-Number.MAX_VALUE).getType(), 'integer' );
	} );

	it( 'should handle floats', function () {
		assert.equal( Object.getType( 1.1 ), 'float' );
		assert.equal( (1.1).getType(), 'float' );
		assert.equal( Object.getType( -1.1 ), 'float' );
		assert.equal( (-1.1).getType(), 'float' );
		assert.equal( Object.getType( Number.MIN_VALUE ), 'float' );
		assert.equal( (Number.MIN_VALUE).getType(), 'float' );
		assert.equal( Object.getType( -Number.MIN_VALUE ), 'float' );
		assert.equal( (-Number.MIN_VALUE).getType(), 'float' );
	} );

	it( 'should handle booleans', function () {
		assert.equal( Object.getType( true ), 'boolean' );
		assert.equal( Object.getType( false ), 'boolean' );
		assert.equal( (true).getType(), 'boolean' );
		assert.equal( (false).getType(), 'boolean' );
	} );

	it( 'should handle arrays', function () {
		assert.equal( Object.getType( [] ), 'array' );
		assert.equal( Object.getType( [ "one", "two", "three" ] ), 'array' );
		assert.equal( [].getType(), 'array' );
		assert.equal( [ "one", "two", "three" ].getType(), 'array' );
	} );

	it( 'should handle functions', function () {
		assert.equal( Object.getType( function () {
		} ), 'function' );
		assert.equal( (function () {
		}).getType(), 'function' );
	} );

	it( 'should handle {}', function () {
		assert.equal( Object.getType( {} ), 'object' );
		assert.equal( {}.getType(), 'object' );
	} );

	describe( 'should handle any other kind of object:', function () {

		it( 'new Date()', function () {
			assert.equal( Object.getType( new Date() ), 'object' );
			assert.equal( (new Date()).getType(), 'object' );
		} );

		it( 'new RegExp()', function () {
			assert.equal( Object.getType( new RegExp() ), 'object' );
			assert.equal( (new RegExp()).getType(), 'object' );
		} );

	} );

} );

describe( 'clone()', function () {

	describe( 'string', function () {

		var theString = 'the string';

		it( 'should return a string', function () {
			assert.equal( typeof (theString.clone()), 'string' );
		} );

		it( 'should return a new string with same value', function () {
			assert.equal( theString.clone(), theString );
		} );

	} );

	describe( 'Date', function () {

		var theDate = new Date();

		it( 'should return a date object', function () {
			assert.ok( theDate.clone() instanceof Date );
		} );

		it( 'should have the same ISO date', function () {
			assert.equal( theDate.clone().toISOString(), theDate.toISOString() );
		} );

		it( 'should be a new object', function () {
			assert.notStrictEqual( theDate.clone(), theDate );
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
			assert.ok( theObject.clone() instanceof Object );
		} );

		it( 'should have the same structure and values', function () {
			assert.deepEqual( theObject.clone(), theObject );
		} );

		it( 'should be a new object', function () {
			assert.notStrictEqual( theObject.clone(), theObject );
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

				cloneObject.clone();

			} );
		} );

	} );

	describe( 'everything else', function () {

		var theFunction = function () {
			return 'hello';
		};

		it( 'should be === of original', function () {
			assert.strictEqual( theFunction.clone(), theFunction );
		} );

	} );

} );

describe( 'mixin()', function () {

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
		theDefaultObject.mixin( theObject );
		assert.notDeepEqual( theObject, theDefaultObject );
	} );
	it( 'should not modify original array', function () {
		theDefaultArray.mixin( theArray );
		assert.notDeepEqual( theArray, theDefaultArray );
	} );

	// a new one
	it( 'should return a new object', function () {
		assert.notStrictEqual( theObject.mixin( {} ), theObject );
	} );
	it( 'should return a new array', function () {
		assert.notStrictEqual( theArray.mixin( {} ), theArray );
	} );

	// deep structure with empty default
	it( 'should return the same deep structure with empty default object', function () {
		assert.notStrictEqual( {}.mixin( theObject ), theObject );
	} );
	it( 'should return the same deep structure with empty default array', function () {
		assert.notStrictEqual( [].mixin( theArray ), theArray );
	} );

	// deep structure with empty input
	it( 'should return the same deep structure with empty input object', function () {
		assert.deepEqual( theObject.mixin( {} ), theObject );
	} );
	it( 'should return the same deep structure with empty input array', function () {
		assert.deepEqual( theArray.mixin( [] ), theArray );
	} );

	// deep structure with undefined input
	it( 'should return the same deep structure with undefined input object', function () {
		assert.deepEqual( theObject.mixin( undefined ), theObject );
	} );
	it( 'should return the same deep structure with undefined input array', function () {
		assert.deepEqual( theArray.mixin( undefined ), theArray );
	} );

	// deep structure with null input
	it( 'should return the same deep structure with null input object', function () {
		assert.deepEqual( theObject.mixin( null ), theObject );
	} );
	it( 'should return the same deep structure with null input array', function () {
		assert.deepEqual( theArray.mixin( null ), theArray );
	} );

	// deep structure with initialized default
	it( 'should return the same deep structure with initialized default object', function () {
		assert.deepEqual( theDefaultObject.mixin( theObject ), theObject );
	} );
	it( 'should return the same deep structure with initialized default array', function () {
		assert.deepEqual( theDefaultArray.mixin( theArray ), theArray );
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

		assert.deepEqual( theDefaultArrayFromObject.mixin( theArrayFromObject ), expectedArrayFromObject );

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

		assert.deepEqual( theDefaultObjectFromArray.mixin( theObjectFromArray ), expectedObjectFromArray );

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

		assert.deepEqual( theDefault.mixin( theInput ), expectedObject );

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

		assert.deepEqual( (true).mixin( theArray ), theArray );
		assert.deepEqual( (false).mixin( theArray ), theArray );
		assert.deepEqual( (1).mixin( theArray ), theArray );
		assert.deepEqual( (-1).mixin( theArray ), theArray );
		assert.deepEqual( (1.1).mixin( theArray ), theArray );
		assert.deepEqual( (-1.1).mixin( theArray ), theArray );
		assert.deepEqual( (0).mixin( theArray ), theArray );
		assert.deepEqual( (0.0).mixin( theArray ), theArray );
		assert.deepEqual( ("string").mixin( theArray ), theArray );
		assert.deepEqual( ("").mixin( theArray ), theArray );

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

		assert.deepEqual( (true).mixin( theObject ), theObject );
		assert.deepEqual( (false).mixin( theObject ), theObject );
		assert.deepEqual( (1).mixin( theObject ), theObject );
		assert.deepEqual( (-1).mixin( theObject ), theObject );
		assert.deepEqual( (1.1).mixin( theObject ), theObject );
		assert.deepEqual( (-1.1).mixin( theObject ), theObject );
		assert.deepEqual( (0).mixin( theObject ), theObject );
		assert.deepEqual( (0.0).mixin( theObject ), theObject );
		assert.deepEqual( ("string").mixin( theObject ), theObject );
		assert.deepEqual( ("").mixin( theObject ), theObject );

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

		assert.deepEqual( theObject.mixin( undefined ), theObject );
		assert.deepEqual( theObject.mixin( null ), theObject );
		assert.deepEqual( theObject.mixin( true ), theObject );
		assert.deepEqual( theObject.mixin( false ), theObject );
		assert.deepEqual( theObject.mixin( 1 ), theObject );
		assert.deepEqual( theObject.mixin( -1 ), theObject );
		assert.deepEqual( theObject.mixin( 1.1 ), theObject );
		assert.deepEqual( theObject.mixin( -1.1 ), theObject );
		assert.deepEqual( theObject.mixin( 0 ), theObject );
		assert.deepEqual( theObject.mixin( 0.0 ), theObject );
		assert.deepEqual( theObject.mixin( "string" ), theObject );
		assert.deepEqual( theObject.mixin( "" ), theObject );

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

		assert.deepEqual( theArray.mixin( undefined ), theArray );
		assert.deepEqual( theArray.mixin( null ), theArray );
		assert.deepEqual( theArray.mixin( true ), theArray );
		assert.deepEqual( theArray.mixin( false ), theArray );
		assert.deepEqual( theArray.mixin( 1 ), theArray );
		assert.deepEqual( theArray.mixin( -1 ), theArray );
		assert.deepEqual( theArray.mixin( 1.1 ), theArray );
		assert.deepEqual( theArray.mixin( -1.1 ), theArray );
		assert.deepEqual( theArray.mixin( 0 ), theArray );
		assert.deepEqual( theArray.mixin( 0.0 ), theArray );
		assert.deepEqual( theArray.mixin( "string" ), theArray );
		assert.deepEqual( theArray.mixin( "" ), theArray );

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

			mixinObject1.mixin( mixinObject2 );

		} );
	} );

} );
