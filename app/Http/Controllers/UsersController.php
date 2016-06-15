<?php

namespace App\Http\Controllers;

use App\Role;
use App\User;
use App\Usermeta;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller {

	public function index(){}

	public function create(){}

	public function store( Request $request )
	{
		$all = $request->all();

		if ( $all[ 'name' ] && $all[ 'email' ] && $all[ 'password' ] ) {
			// @TODO: password and email validation
			$user_data = $request->except( 'roles' );
			$roles     = $request->only( 'roles' );
			$user      = User::create( $user_data );

			DB::table( 'role_user' )
			  ->where( 'user_id', '=', $user->id )
			  ->delete();
			$response_roles = [ ];
			foreach ( $roles[ 'roles' ] as $role ) {
				$user->assign( $role[ 'name' ] );
				$response_roles[] = Role::whereName( $role[ 'name' ] )->first();
			}

			return [
				'response' => [
					'user'   => User::find( $user->id ),
					'avatar' => get_gravatar( $user->email, 40 ),
					'roles'  => $response_roles
				]
			];
		} else {
			return 'fail';
		}

	}

	public function show( $id ){}

	public function edit( $id ){}

	/**
	 * @param Request $request
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( Request $request, $id )
	{
		$input = $request->all();
		$roles = $input[ '__roles' ];
		User::where( 'id', $id )->update( [
			'name'  => $input[ 'name' ],
			'email' => $input[ 'email' ],
		] );
		DB::table( 'role_user' )
		  ->where( 'user_id', '=', $id )
		  ->delete();

		foreach ( $roles as $role ) {
			User::find( $id )->assign( $role[ 'name' ] );
		}

		return response( [ 'status' => 'success' ] );
	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function destroy( $id )
	{
		if ( Auth::user()->id === (int) $id )
			return response( [ 'status' => 'self_del' ] );

		if ( User::destroy( $id ) ) {
			DB::table( 'role_user' )
			  ->where( 'user_id', '=', $id )
			  ->delete();

			return response( [ 'status' => 'success' ] );
		}

		return response( [ 'status' => 'fail' ] );
	}
}
