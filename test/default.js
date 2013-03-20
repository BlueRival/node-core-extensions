'use strict';

require( '../' );
var assert = require( 'assert' );

describe( 'Object.isObject()', function () {

	it( 'should return false for an array', function () {
		assert.equal( Object.isObject( [] ), false );
	} );

	it( 'should return false for NULL', function () {
		assert.equal( Object.isObject( null ), false );
	} );

	it( 'should return false for UNDEFINED', function () {
		assert.equal( Object.isObject( undefined ), false );
	} );

	it( 'should return false for a string', function () {
		assert.equal( Object.isObject( "string" ), false );
	} );

	it( 'should return false for an integer', function () {
		assert.equal( Object.isObject( 1 ), false );
	} );

	it( 'should return false for a float', function () {
		assert.equal( Object.isObject( 1.1 ), false );
	} );

	it( 'should return false for a boolean', function () {
		assert.equal( Object.isObject( true ), false );
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
				1, 4.45, 32, 3, 3413
			],
			'object': {
				'array field': [
					'hi', 'there'
				],
				'number': 1,
				'float': 1.04,
				'array numbers': [
					1, 4.45, 32, 3, 3413
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
			}
		}
	};

	var theDefaultObject = {
		statusCode: 500,
		data: {
			subscription: {
				id: null
			}
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

	// deep structure with empty input
	it( 'should return the same deep structure with empty input object', function () {
		assert.deepEqual( theObject.mixin( {} ), theObject );
	} );
	it( 'should return the same deep structure with empty input array', function () {
		assert.deepEqual( theArray.mixin( [] ), theArray );
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
			'three'
		];

		var expectedArrayFromObject = [
			0,
			[ 'one' ],
			2,
			3
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

} );
