<?php

use App\Role;
use App\User;

function get_gravatar( $email, $size = 30 )
{
	$email = md5( $email );

	return "//www.gravatar.com/avatar/{$email}?s={$size}";
}

/**
 * ==================== Angular Http Helpers ======================
 * 11.06.2016
 */

if ( ! function_exists( 'user_avatar' ) ) {
	function user_avatar( $data )
	{
		$params = json_decode( $data );
		$email  = md5( $params->email );

		return [
			'avatar_uri' => "//www.gravatar.com/avatar/{$email}?s={$params->size}"
		];
	}
}


if ( ! function_exists( 'get_available_roles' ) ) {
	function get_available_roles()
	{
		$roles = Role::all();
		foreach ( $roles as $k => $role ) {
			if($role['name'] === 'developer')
				unset($roles[$k]);
		}
		return $roles;
	}
}