
class EventManager {
    
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }


    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
          if(response == "logout" ){
            this.sessionError()
          }else{
            this.inicializarCalendario(response)
          }
        })
    }

    eliminarEvento(evento) {
        let eventId = evento.id
        $.post('/events/delete/'+eventId, {id: eventId}, (response) => {
            alert(response)
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = '',
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }
                
                $.post(url, ev, (response) => {
                    alert(response);
                })
                $('.calendario').fullCalendar('renderEvent', ev)
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '2018-02-01',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        this.eliminarEvento(event)
                        $('.calendario').fullCalendar('removeEvents', event.id);
                    }
                }
            })
    }

    actualizarEvento(evento) {

      if(evento.end === null){ //Verificar si el evento es de dia completo
        var start = moment(evento.start).format('YYYY-MM-DD'), //Enviar la información del día en formato año-mes-dia
            url = '/events/update/'+evento._id+'&'+start+'&'+start //enviar como parámetros el identificador del evento + lafecha de inicio + la fecha de inicio ya que no se pueden enviar parámetros vacíos
      }else{
        var start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'), //Enviar la información del día en formato año-mes-dia Hora-minuto-segundos
            end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'), //Enviar la información del día en formato año-mes-dia Hora-minuto-segundos
            url = '/events/update/'+evento._id+'&'+start+'&'+end //enviar como parámetros el identificador del evento + lafecha de inicio + la fecha de finalización del evento
      }

        var  data = { //Crear objero data
              id: evento._id, //asignar e idenificador del evento obtenido
              start: start, //obtener la fecha inicial
              end: end //obtener la fecha final
        }
        $.post(url, data, (response) => { //Enviar la consulta AJAX
            if(response == "logout" ){//Verificar que la respuesta no sea logout (Usuario no ha iniciado sesion)
                this.sessionError() //Ejecutar función de error de sesión
            }else{
                alert(response) //Mostrar mensaje recibido
            }
        })
    }
}

    const Manager = new EventManager();


   

function verificarExistenciaDeUsuarios(){
    $.ajax({
        url: '/users/verificar_user',
        method: 'GET',
        data: {},
        success: function(res) {
            mensaje = "";
            for (var i=0; i<res.length; i++) {
                mensaje += '<small>Usuario: '+res[i].email+' - Clave: '+res[i].password+'</small><br>'; 
            }
            $('#mensajeUsuarios').html(mensaje);
        }
    })
}
function mostrarMensaje(msj){
    $('#mensajeSesion').html(msj);
}

function validarUser(){
    
    var email = $('#user');
    var pass = $('#pass');
    $('.loginButton').on('click', function(event) {


        if (email.val() != "" && pass.val() != "") {
                
            $.post('/users/login',{user: email.val(), pass: pass.val()}, function(response) {

                if (response == "Validado") {
                    window.location.href = "http://localhost:8082/main.html";
                    console.log();
                }
            })
        } else {
            alert("Complete todos los campos");
        }
    })
}

function cerrarSesion(){
  console.log("llegue a este punto")
  var url = "/users/logout", //url a consultar
      data = ""; //Enviar variable data sin información
  $.post(url, data, (response) => {
    if(response == "logout"){
      window.location.href="http://localhost:8082/index.html" //url a redireccionar
    }else{
      alert("Error inesperado al cerrar sesión") //Mensaje de error
    }
  })
}