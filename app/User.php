<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {

	protected $fillable = [
		'name', 'email', 'password', 'created_at', 'updated_at'
	];

	protected $hidden = [
		'password', 'remember_token',
	];

	public function setPasswordAttribute( $password )
	{
		$this->attributes[ 'password' ] = bcrypt( $password );
	}

	public function meta()
	{
		return $this->hasMany( 'App\Usermeta' );
	}

	public function roles()
	{
		return $this->belongsToMany( 'App\Role' );
	}

	public function hasRole( $role )
	{
		if ( is_string( $role ) ) {
			return $this->roles()->contains( 'name', $role );
		}

		return !! $role->intersect($this->roles)->count();
//		foreach ( $role as $r ) {
//			if ( $this->hasRole( $r->name ) ) {
//				return true;
//			}
//		}
//
//		return false;
	}

	public function assign( $role )
	{
		if ( is_string( $role ) ) {
			return $this->roles()->save(
				Role::whereName($role)->firstOrFail()
			);
		}

		return $this->roles()->save($role);
	}

}
