<?php

//Route::group( [ 'middleware' => 'frontend' ], function () {});

Route::get( '/', 'FrontendController@index' );

//Route::group( [ 'middleware' => 'auth' ], function () {});
Route::auth();

Route::get( '/dashboard', 'DashboardController@index' );



Route::group( [ 'middleware' => 'auth' ], function () {

	Route::get( 'api/users/{id?}', function ( $id = null ) {
		if ( $id ) {
			return \App\User::with( 'meta' )->find( $id );
		}

		return \App\User::with( 'meta' )->get();
	} );

	Route::get( 'api/data/{helper}/{argues?}',
		function ( $helper, $argues ) {
			return $helper($argues);
		} );

} );
