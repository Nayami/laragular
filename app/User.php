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

	protected $appends = [
		'gravatar_image'
	];

	/**
	 * Append Gravatar Image
	 * @return string
	 */
	public function getGravatarImageAttribute()
	{
		return $this->appends['gravatar_image'] = get_gravatar($this->email, 40);
	}

	/**
	 * Crypting password befor save
	 * @param $password
	 */
	public function setPasswordAttribute( $password )
	{
		$this->attributes[ 'password' ] = bcrypt( $password );
	}

	/**
	 * Relation with user_meta
	 * @return \Illuminate\Database\Eloquent\Relations\HasMany
	 */
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
