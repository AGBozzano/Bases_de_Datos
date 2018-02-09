<?php

require ('conector.php');

$con = new ConectorBD('localhost', 'nextu', '12345');
if ($con -> initConexion('calendario_db') == 'OK') {
	for ($i = 1; $i <= 3; $i++) {
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
