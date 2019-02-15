$(document).ready(function(){
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1);

  $('#myForm').addClass('isloading');
  $.ajax({
    method: 'get',
    url: '/getProyectoCorregir?id=' + id,
  }).done(function (res) {
    $('#myForm').removeClass('isloading');
      let datos = res.data[0];
      alert("Por favor, corrija los datos y re-envielos ID:"+id);
      $("#id").val(id);
      $("#solicitud").val(datos.solicitud);
      $("#tipo").val(datos.tipo);
      $("#nombreSolicitud").val(datos.nombreSolicitud);
      $("#introduccion").val(datos.introduccion);
      $("#apellidoSolicitante").val(datos.apellidoSolicitante);
      $("#nombreSolicitante").val(datos.nombreSolicitante);
      $("#coordinador").val(datos.coordinador);
      $("#disenno").val(datos.disenno);
      $("#participantes").val(datos.participantes);
      $("#descripcion").val(datos.descripcion);
  });
});
