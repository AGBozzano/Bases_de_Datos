<?php

	session_start();
	require ('conector.php');

	if ($_SESSION['isLogin']) {

		$con = new ConectorBD('localhost', 'root', '');
		$response['conexion'] = $con -> initConexion('calendario_db');
		
		if ($response['conexion'] == 'OK') {
			
			if ($con -> eliminarRegistro('Eventos', 'id = ' . $_POST['id']))
				$response['msg'] = 'OK';
			else
				$response['msg'] = 'Error al guardar el evento';
		} else
			$response['msg'] = 'Eror en la conexión a la base de datos';
	} else
		$response['msg'] = 'Por Favor inicié sesión para continuar';

	echo json_encode($response);


 ?>
