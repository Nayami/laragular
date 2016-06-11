<?php

function get_gravatar( $email, $size = 30 )
{
	$email = md5( $email );

	return "//www.gravatar.com/avatar/{$email}?s={$size}";
}