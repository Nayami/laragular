<?php

namespace App\Http\Controllers;

use App\Permission;
use App\Role;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class RolesPermissionsController extends Controller {

	/**
	 * @return mixed
	 */
	public function index()
	{
		// @TODO: skip developer role and debug
		return [
			'roles'       => Role::with( 'permissions' )->get(),
			'permissions' => Permission::all(),
		];
	}

	public function create()
	{
	}

	/**
	 * @param Request $request
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function store( Request $request )
	{
		$input = $request->all();

		switch ( strtolower( $input[ 'type' ] ) ) {
			case 'role':
				if ( Role::whereName( $input[ 'name' ] )->first() )
					return response( [ 'status' => 'exists' ] );
				$role = Role::create( $request->except( 'type' ) );

				return response( [
					'status' => 'success',
					'_role'  => Role::with( 'permissions' )->find( $role->id ),
				] );

				break;
			case 'permission':
				if ( Permission::whereName( $input[ 'name' ] )->first() )
					return response( [ 'status' => 'exists' ] );
				$permission = Permission::create( $request->except( 'type' ) );

				return response( [
					'status'      => 'success',
					'_permission' => $permission
				] );
				break;
			default :
				return response( [ 'status' => 'fail' ] );
		}
	}

	public function show( $id )
	{
	}

	public function edit( $id )
	{
	}

	public function update( Request $request, $id )
	{
	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function destroy( $id )
	{
		$auth_user = Auth::user();
		$role      = Role::find( $id );
		$user      = User::find( $auth_user->id );
		if ( $user->hasRole( $role->name ) ) {
			return response( [ 'status' => 'self_role' ] );
		}
		$role->delete();

		return response( [ 'status' => 'success' ] );
	}

	/**
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function destroyPermission( $id )
	{
		$auth_user  = Auth::user();
		$user       = User::find( $auth_user->id );
		$permission = Permission::find( $id );
		if ( $user->can( $permission->name ) ) {
			return response( [ 'status' => 'self_permission' ] );
		}
		$permission->delete();

		return response( [ 'status' => 'success' ] );
	}
}