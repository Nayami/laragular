<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Usermeta;
use Carbon\Carbon;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller {

	use AuthenticatesAndRegistersUsers, ThrottlesLogins;

	protected $redirectTo = '/';

	public function __construct()
	{
		$this->middleware( $this->guestMiddleware(), [ 'except' => 'logout' ] );
	}

	protected function validator( array $data )
	{
		return Validator::make( $data, [
			'name'     => 'required|max:255',
			'email'    => 'required|email|max:255|unique:users',
			'password' => 'required|min:6|confirmed',
		] );
	}


	protected function create( array $data )
	{
		dd($data);
		$user = User::create( [
			'name'     => $data[ 'name' ],
			'email'    => $data[ 'email' ],
			'password' => bcrypt( $data[ 'password' ] ),
		] );
		$user->assign(Role::whereName('customer')->first());
//		$usermeta = [
//			[
//				'user_id' => $user->id,
//				'meta_key' => 'role',
//				'meta_value' => 'customer',
//				'created_at' => Carbon::now(),
//				'updated_at' => Carbon::now()
//			],
//		];
//		Usermeta::insert( $usermeta );

		return $user;
	}
}
