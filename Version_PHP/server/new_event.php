<?php
  	
  session_start();
	require('conector.php');

  if($_SESSION['isLogin']){

  	  $datos = array(
        'user_id' => $_SESSION['user_id'],
    	  'titulo' => $_POST['titulo'],
    	  'fecha_inicio' => $_POST['start_date'],
        'hora_inicio' => $_POST['start_hour'],
        'fecha_fin' => $_POST['end_date'],
        'hora_fin' => $_POST['end_hour'],
        'dia_completo' => $_POST['allDay']);

      $con = new ConectorBD('localhost','root','');

  	  $response['conexion'] = $con -> initConexion('calendario_db');

    	if ($response['conexion'] == 'OK') {
      	if($con -> insertData('eventos', $datos)){

          //Busco del ultimo evento recien creado, el id para poder pasarlo al calendario para que pueda ser altualizado correctamente....
          $BuscarId = $con -> ejecutarQuery('SELECT MAX(id) AS id FROM eventos;');

          $UltimoEvent = $BuscarId -> fetch_assoc();
            $response['ultimo_id'] = $UltimoEvent['id'];
          
          
          $response['msg'] = "OK";
  	    }else 
  	      $response['msg'] = "Se ha producido un error al guardar el evento";
  	    
    	}else
        $response['msg'] = "Problemas con la conexión a la base de datos";  
  } else
    $response['msg'] = 'Debe iniciar sesión';
      


  $con->cerrarConexion();
  echo json_encode($response);


 ?>
