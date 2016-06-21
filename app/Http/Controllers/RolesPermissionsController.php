<?php

namespace App\Http\Controllers;

use App\Permission;
use App\Role;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

	/**
	 * @param Request $request
	 * @param $id
	 *
	 * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
	 */
	public function update( Request $request, $id )
	{
		$input = $request->all();
		if ( empty( $input[ 'name' ] ) || empty( $input[ 'label' ] ) )
			return response( [ 'status' => 'empty_fields' ] );

		if ( $input[ 'type' ] === 'role' ) {
			$role = Role::find( $id );
			$role->update( [
				'name'  => $input[ 'name' ],
				'label' => $input[ 'label' ],
			] );

			$query_permissions = $input['permissions'];

			DB::table( 'permission_role' )
			  ->where( 'role_id', '=', $id )
			  ->delete();
			foreach ( $query_permissions as $q_p ) {
				$_permission = Permission::whereName($q_p['name'])->first();
				$role->assign($_permission);
			}

		}

		if ( $input[ 'type' ] === 'permission' ) {
			$permission = Permission::find( $id );
			$permission->update( [
				'name'  => $input[ 'name' ],
				'label' => $input[ 'label' ],
			] );
		}

		return response( [
			'status' => 'success'
		] );
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