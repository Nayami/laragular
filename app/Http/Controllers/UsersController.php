<?php

namespace App\Http\Controllers;

use App\User;
use App\Usermeta;
use Illuminate\Http\Request;

use App\Http\Requests;

class UsersController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request $request
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function store( Request $request )
	{
		$user_data = $request->except( 'role' );
		$role      = $request->only( 'role' );
		$user      = User::create( $user_data );
		$usermeta  = Usermeta::create( [
			'user_id'    => $user->id,
			'meta_key'   => 'role',
			'meta_value' => $role['role']['name']
		] );

		return [
			'response' => [
				'user' => User::find($user->id),
				'avatar'  => get_gravatar( $user->email, 40 ),
				'role'=> $role['role']['name']
			]
		];
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int $id
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function show( $id )
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int $id
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function edit( $id )
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  int $id
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function update( Request $request, $id )
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int $id
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function destroy( $id )
	{
		//
	}
}
