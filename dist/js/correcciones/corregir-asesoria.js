$(document).ready(function(){
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1);

  $('#myForm').addClass('isloading');
  $.ajax({
    method: 'get',
    url: '/getAsesoriaCorregir?id=' + id,
  }).done(function (res) {
    $('#myForm').removeClass('isloading');
      let datos = res.data[0];
      alert("Por favor, corrija los datos y re-envielos ID:"+id);
      $("#id").val(id);
      $("#tipo").val(datos.tipo);
      $("#titulo").val(datos.titulo);
      $("#Introduccion").val(datos.introduccion);
      $("#apellidoSolicitanteA").val(datos.apellidoSolicitanteA);
      $("#nombreSolicitanteA").val(datos.nombreSolicitanteA);
      $("#Cantidad").val(datos.cantidadParticipantes);
      $("#lugar").val(datos.lugar);
      $("#FechaCapacitacion").val(datos.fechaCapacitacion);
  });
});
