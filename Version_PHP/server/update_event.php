<?php
	session_start();
  	require('conector.php');

    $datos = array(
	    'fecha_inicio' => $_POST['start_date'],
	    'hora_inicio' => $_POST['start_hour'],
	    'fecha_fin' => $_POST['end_date'],
	    'hora_fin' => $_POST['end_hour']
	);

	if ($_SESSION['isLogin']) {

	    $con = new ConectorBD('localhost','root','');
		$response['conexion'] = $con -> initConexion('calendario_db');

	  	if ($response['conexion'] == 'OK') {

	      	if($con -> actualizarRegistro('eventos', $datos, 'id="'.$_POST['id'].'"')){

	          	$response['msg'] = "OK";

	        }else 
	          	$response['msg'] = "Hubo un error y los datos no se han actualizado";
	   	} else
			$response['msg'] = 'Problemas con la conexión a la base de datos';
	}else
		$response['msg'] = 'Debe iniciar sesión';


    $con->cerrarConexion();
  	echo json_encode($response);

 ?>
