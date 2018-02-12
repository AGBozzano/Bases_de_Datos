<?php

require ('conector.php');

$con = new ConectorBD('localhost', 'root', '');
if ($con -> initConexion('calendario_db') == 'OK') {
	for ($i = 1; $i <= 3; $i++) {

		//Creo 3 Usuario a la vez ... USUARIO 1 - USUARIO 2 - USUARIO 3
		//Todos con contraseñas encriptadas y distintas 
		$datos['nombre'] = "Usuario " . $i;
		$datos['email'] = "usuario" . $i . "@gmail.com";
		$datos['clave'] = password_hash("usuario" . $i, PASSWORD_DEFAULT);
		$datos['nacimiento'] = date('Y-m-d');
		
		if ($con -> insertData('usuarios', $datos))
			echo "Se ha creado correctamente el usuario " . $i . "<br/>";
		else
			echo "Se ha producido un error en la creación del usuario" . $i . "<br/>";
	}
	$con -> cerrarConexion();
} else
	echo "Error en la conexión";

 ?>
