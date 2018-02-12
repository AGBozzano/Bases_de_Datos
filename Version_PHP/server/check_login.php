<?php

	require_once('conector.php');


	$pass = $_POST['password'];
	$response['conexion'] = 'Sin conexión';


	if (($email = filter_var($_POST['username'], FILTER_VALIDATE_EMAIL)) && !empty($pass)) {

		$con = new ConectorBD('localhost', 'root', '');
		$response['conexion'] = $con -> initConexion('calendario_db');

		if ($response['conexion'] == 'OK') {

			$resultado = $con -> consultar(['Usuarios'], ['*'], 'email="' . $email . '"');

			if ($resultado -> num_rows != 0) {

				$fila = $resultado -> fetch_assoc();

				if (password_verify($pass, $fila['clave'])) {

					session_start();
					$_SESSION['isLogin'] = true;
		            $_SESSION['user_id'] = $fila['id'];
		          	$_SESSION['username'] = $fila['email'];
					$response['msg'] = 'OK';

				}else
					$response['msg'] = 'Contraseña incorrecta';
			}else
				$response['msg'] = 'El usuario no existe ';
		}else
			$response['msg'] = 'Problemas con la conexión a la base de datos';
		$con -> cerrarConexion();
	}else
		$response['msg'] = 'Datos incorrectos';


	echo json_encode($response);

 ?>