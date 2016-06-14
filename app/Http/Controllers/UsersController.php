<?php

namespace App\Http\Controllers;

use App\User;
use App\Usermeta;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

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
		$all = $request->all();

		if($all['name'] && $all['email'] && $all['password']) {
			// @TODO: password and email validation
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
		} else {
			return 'fail';
		}

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
		$input = $request->all();
		$user = $request->except(['role']);
		$role = $input['role'];
		User::where('id', $id)->update($user);
		Usermeta::where('user_id', $id)
			->where('meta_key', 'role')
			->update([
				'meta_value'=> $role['name']
			]);
		// @TODO: check if user can manage users

		return response(['status'=>'success']);
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
		if(Auth::user()->id === (int)$id)
			return response([ 'status' => 'self_del' ]);

		if ( User::destroy($id) )
			return response( [ 'status' => 'success' ] );

		return response( [ 'status' => 'fail' ] );
	}
}
