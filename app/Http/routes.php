<?php

//Route::group( [ 'middleware' => 'frontend' ], function () {});

Route::get( '/', 'FrontendController@index' );

//Route::group( [ 'middleware' => 'auth' ], function () {});
Route::auth();

Route::get( '/dashboard', 'DashboardController@index' );



Route::group( [ 'middleware' => 'auth' ], function () {

	Route::get( 'api/users/{id?}', function ( $id = null) {
		if ( $id ) {
			return \App\User::with( 'meta' )->with( 'roles' )->find( $id );
		}

		return \App\User::with( 'meta' )->with( 'roles' )->take(8)->get();
	} );

	Route::get('api/users/paginate/{skip?}/{take?}', function($skip, $take){
		return \App\User::with( 'meta' )->with( 'roles' )->skip( $skip )->take($take)->get();
	});

	Route::get( 'api/data/{helper}/{argues?}',
		function ( $helper, $argues = null ) {
			return $helper( $argues );
		} );

} );

Route::resource( 'restusers', 'UsersController' );
Route::resource( 'settings', 'SettingsController' );