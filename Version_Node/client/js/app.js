
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
        let eventId = evento._id;
        $.post('/events/delete/'+eventId, {id: eventId}, (response) => {
              if(response == "logout" ){
                this.sessionError()
              }else{
            
                $('.calendario').fullCalendar('removeEvents', eventId);    
                alert(response);
              }
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
                if(start_hour != "" && end_hour!= ""){
                    start = start + 'T' + start_hour
                    end = end + 'T' + end_hour
                }else{
                    end_hour='12:00:00'
                    end = end + 'T' + end_hour
                }

            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                };
                
                $.post(url, ev, (response) => {
                    if(response!="logout"){
                        var newEvent = {
                            _id:response,
                            title: title,
                            start: start,
                            end: end
                        }
                        console.log(response);
                      
                        $('.calendario').fullCalendar('renderEvent', newEvent)
                        alert("Evento guardado.")
                        
                      
                    }
                })
                
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
                $('.delete').find('img').attr('src', "../img/trash-open.png");
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
                        
                    }
                }
            })
    }

    actualizarEvento(evento) {

      if(evento.end === null){ 
        var start = moment(evento.start).format('YYYY-MM-DD'),
            url = '/events/update/'+evento._id+'&'+start+'&'+start 
      }else{
        var start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'), 
            end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'), 
            url = '/events/update/'+evento._id+'&'+start+'&'+end 
      }

        var  data = { 
              id: evento._id, 
              start: start, 
              end: end 
        }
        $.post(url, data, (response) => { 
            if(response == "logout" ){
                this.sessionError() 
            }else{
                console.log(response)
                alert(response) 
            }
        })
    }
}

    const Manager = new EventManager();


$(document).ready(function(){
    verificarExistenciaDeUsuarios();
})

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