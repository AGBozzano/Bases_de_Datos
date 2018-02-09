<?php

	require('conector.php');



	$con = new ConectorBD('localhost','root','');

	if ($con->initConexion('calendario_db') == 'OK') {

		$response['msg']="OK";
	
}	
	echo json_encode($response);
	$con -> cerrarConexion();


 ?>