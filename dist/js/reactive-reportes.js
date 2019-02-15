$(document).ready(function () {

  $('.fecha').text((new Date().toLocaleString()));

  let data2 = [];
  let data3 = [];
  let user;

  //////////////////////////////////////////////////////////////////////////////
  let tabla2 = $('#dataTableCarrerasCantTipos').DataTable({
    ajax: '/getCarrerasCantTipos',
    columns: [
      { data: 'tipo' },
      { data: 'cant' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.tipo) {
        case 1: data.tipo = 'Carrera'; break;
        case 2: data.tipo = 'Diplomado'; break;
        case 3: data.tipo = 'Programa Academico'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.tipo) {
        case 'Carrera': $('td:eq(0)', row).html('Carrera'); break;
        case 'Diplomado': $('td:eq(0)', row).html('Diplomado'); break;
        case 'Programa Academico': $('td:eq(0)', row).html('Programa Academico'); break;
      }
    },
  });

  tabla2.on('xhr', function () {
    data2 = tabla2.ajax.json().data;
  });

  let tabla3 = $('#dataTableCarrerasCantStatus').DataTable({
    ajax: '/getCarrerasCantStatus',
    columns: [
      { data: 'status' },
      { data: 'cant' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.status) {
        case 0: data.status = 'esperando correccion'; break;
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'rechazado por D.D.Curricular'; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado por consejo'; break;
        case 6: data.status = 'aprobado'; break;
        case 7: data.status = 'finalizado'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.status) {
        case 'esperando correccion': $('td:eq(0)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(0)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(0)', row).html('para revisar'); break;
        case 'rechazado por D.D.Curricular': $('td:eq(0)', row).html('rechazado por D.D.Curricular'); break;
        case 'validado': $('td:eq(0)', row).html('validado'); break;
        case 'rechazado por consejo': $('td:eq(0)', row).html('rechazado por consejo'); break;
        case 'aprobado': $('td:eq(0)', row).html('aprobado'); break;
        case 'finalizado': $('td:eq(0)', row).html('finalizado'); break;
      }
    },
  });

  tabla3.on('xhr', function () {
    data3 = tabla3.ajax.json().data;
  });

});
