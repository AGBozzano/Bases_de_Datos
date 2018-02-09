<?php

  	session_start();
	require('conector.php');

if($_SESSION['isLogin']){
	$con = new ConectorBD('localhost', 'root', '');

	$response['conexion'] = $con -> initConexion('calendario_db');

	if($response['conexion'] == 'OK'){
		
		$resultado = $con -> consultar(['eventos'],['*'],'user_id="'.$_SESSION['user_id'].'"');


		if($resultado -> num_rows != 0){

			$eventos = array();
			while($fila = $resultado -> fetch_assoc()){
			
				$evento = array(
		            'id'=>$fila['id'],
		            'user_id'=>$fila['user_id'],
		            'title'=>$fila['titulo'],
		            'start'=>$fila['fecha_inicio'].' '.$fila['hora_inicio'],
		            'end'=>$fila['fecha_fin'].' '.$fila['hora_fin'],
		            'allday'=>$fila['dia_completo']
		        );
		      	array_push($eventos, $evento);
			}
			$response['eventos'] = $eventos;
			$response['msg'] = 'OK';	
		}	
	}else
		$response['msg'] = 'Problemas con la conexión a la base de datos';
} else
	$response['msg'] = 'Debe iniciar sesión';	

	echo json_encode($response);
	$con -> cerrarConexion();
 ?>
