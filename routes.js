const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    let tipo = 'ServicioComunitario/';
    //console.log("req.body.tipo", req.body.tipo);
    switch (req.body.tipo) {
      //case 1: tipo = 'ServicioComunitario/'; break;
      case 2: tipo = 'Extension/'; break;
      case 3: tipo = 'Aval/'; break;
    }
    //let tipo = req.body.tipo == 1 ? 'ServicioComunitario/' : 'Extension/';
    cb(null, 'proyectos/' + tipo);
  },
  filename: function (req, file, cb) {
    console.log("el file:", file);
    // Extraemos la extension del archivo
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
   console.log("El body de la 18: ",req.body)
    // En dado que el nombre del archivo tenga un timestamp como el usado aqui, se le quita el viejo stamp
    let nombre = req.body.nombreSolicitud.replace(/-[0-9]{13}/,'');
    // En el nombre del archivo se sustituyen los espacios por _
    cb(null,`${ nombre.replace(/ /g, '_') }-${ Date.now() }.${ext}`);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // aka 1MB * 5
  }
  /*fileFilter: function(req, file, cb) {
    if(req.session.rol == 2 || req.session.rol == 3) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }*/
});


const options = {
  root: __dirname + '/dist/pages/',
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

//rol:
//// 1: Admin
//// 2: Burocratas
//// 3: Facultad

//GET Requests ------------------------------------

app.get('/dashboard', (req, res) => {
  if(req.session.rol == 1) {
    send(res, 'admin/dashboard.html');
  } else if(req.session.rol == 2) {
    send(res, 'burocratas/dashboard.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/dashboard.html');
  } else {
    forbid(res);
  }
});

app.get('/phpmiadministrador', (req, res) => {
  if(true) {
    send(res, '/#');
    //send(res, './phpmyadmin/index.php');
  } else {
    forbid(res);
  }
});

app.get('/enviarSolicitudA', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudA.html');
}));

app.get('/Reporte', (req, res) => {
  if(req.session.rol == 2) {
    send(res, 'burocratas/Reporte.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/Reporte.html');
  } else {
    forbid(res);
  }
});

app.get('/enviarProyecto', asyncMiddleware( async (req, res) => {
  if(true) {
    send(res, 'facultad/enviarProyecto.html');
  } else {
    forbid(res);
  }
}) );

app.post('/enviarSolicicitudA', asyncMiddleware(async (req, res) =>{
  console.log('req.bodya');
  console.log(req.body);
   let data = [
      "req.body.Identificacion",
      "req.body.nombreS",
      "req.body.Solicitante",
      "req.body.lugar",
      "req.body.Cantidad",
      "req.body.FechaP",
      "req.body.Tipo",
      "req.body.Introducion",
    ]
 // await pool.query('INSERT INTO SolicitudDeA VALUES(0,?,?,?,?,?,?,?,?)', data);
   console.log(data);

    res.redirect('/success');

}));
app.get('/enviarProyecto', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/enviarProyecto.html');
  } else {
    forbid(res);
  }
}) );

app.get('/getAvancesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM avances WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero,refAvance FROM documentos WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromProjectI', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero,refProyecto FROM documentos WHERE refAvance=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getParticipantesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM participantes WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getProyectoCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM carreras WHERE id=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getAsesoriaCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM asesorias WHERE idA=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getInvestigacionCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM actualizacion WHERE id=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getUsers', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    let data = await pool.query('SELECT * FROM usuarios');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
////////////////////////Reportes//////////////////////////////////////////////

app.get('/getCarrerasCantTipos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM carreras WHERE email=? GROUP BY tipo',[req.session.user]);
      //data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM carreras GROUP BY tipo');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getCarrerasCantStatus', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM carreras WHERE email=? GROUP BY status',[req.session.user]);
      //data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM carreras GROUP BY status');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
///////////////////////////////////////////////////////////////////////////////

app.get('/getProyectosDDC', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM carreras');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getAsesorias', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM asesorias WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM asesorias');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getInvestigacion', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM actualizacion WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM actualizacion');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/login', (req, res) => {
  if(req.session.isPopulated) {
    res.redirect('/dashboard');
  } else {
    send(res, 'login.html');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

app.get('/proyectos/:tipo/:nombre', (req, res) => {
  console.log(req.params);
  res.sendFile(`${req.params.tipo}/${req.params.nombre}`, {root: __dirname + '/proyectos/'});
})

app.get('/register', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    send(res, 'admin/register.html');
  } else {
    forbid(res);
  }
}) );

app.get('/success', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3, 2)) {
    if(req.session.rol == 3){
      send(res, 'facultad/success.html');
    }else if(req.session.rol == 3) {
      send(res, 'burocratas/success.html');
    }
  } else {
    forbid(res);
  }
}) );
////////////////////////correcciones////////////////////////////////////////////

app.get('/enviarProyectoCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarProyectoCorregido.html');
  } else {
    forbid(res);
  }
}) );

app.get('/enviarInvestigacionCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarActualizacionCorregido.html');
  } else {
    forbid(res);
  }
}) );

app.get('/enviarAsesoriaCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarSolicitudACorregido.html');
  } else {
    forbid(res);
  }
}) );

// POST Requests ---------------------------------


app.post('/actualizarDocs', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await upload.any()(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.files[0].fieldname[9]);
        for(let i = 0; i < req.files.length; i++) {
          //obtiene el numero de archivo
          let nArchivo = req.files[i].fieldname[9];
          let ruta = req.files[i].path;
          let data = [
            ruta,
            req.body.refProyecto,
            nArchivo,
          ]
          await pool.query('UPDATE documentos SET ruta=?, fechaSubida=NOW() WHERE refProyecto=? && tipo=2 && numero=?', data);
          await pool.query('UPDATE carreras SET status=1 WHERE id=?',[req.body.refProyecto]);
          console.log(req.body.refProyecto);
        }
        res.redirect('/success');

      }
    });


  } else {
    forbid(res);
  }
}))

app.post('/agregarParticipantes', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    let fechaNac = req.body.fechaNac.split('/');
    let data = [
      //id -> 0
      req.body.nombre,
      req.body.apellido,
      req.body.cedula,
      req.body.lugar,
      req.body.genero,
      `${fechaNac[2]}-${fechaNac[1]}-${fechaNac[0]}`,
      req.body.tipoParticipante,
      req.body.refProyecto,
    ]
    await pool.query('INSERT INTO participantes VALUES(0,?,?,?,?,?,?,?,?)', data);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/descoUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE proyectos SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/carreraUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE carreras SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/asesoriasUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE asesorias SET nota=?, status=? WHERE idA=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/investigacionUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE actualizacion SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/carreraCorregir', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    let proyData = [
      //req.session.user, // email
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipo,
      /* ^ asunto-------------------------
      /* 1: Creacion
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.apellidoSolicitante,
      req.body.nombreSolicitante,
      req.body.disenno,
      req.body.coordinador,
      req.body.introduccion,
      req.body.participantes,
      req.body.descripcion,
      1,
      req.body.id,
      req.session.user,
    ]

    await pool.query('UPDATE carreras SET nombreSolicitud=?, solicitud=?, tipo=?, apellidoSolicitante=?, nombreSolicitante=?, disenno=?, coordinador=?, introduccion=?, participantes=?, descripcion=?, status=? WHERE id=? AND email=?', proyData);

    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/asesoriaCorregir', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    let proyData = [
      req.body.titulo,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa Academico
      /* ------------------------------*/
      req.body.apellidoSolicitanteA,
      req.body.nombreSolicitanteA,
      req.body.cantidadParticipantes,
      req.body.lugar,
      req.body.fechaCapacitacion,
      req.body.introduccion,
      1,
      req.body.id,
      req.session.user, // email
    ]

    await pool.query('UPDATE asesorias SET titulo=?, tipo=?, apellidoSolicitanteA=?, nombreSolicitanteA=?, cantidadParticipantes=?, lugar=?, fechaCapacitacion=?, introduccion=?, status=? WHERE idA=? AND email=?', proyData);

    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/investigacionCorregir', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    let proyData = [
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipo,
      /* ^ asunto-------------------------
      /* 1: Creacion
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.apellidoSolicitanteA,
      req.body.nombreSolicitanteA,
      req.body.introduccion,
      1,
      req.body.id,
      req.session.user,
    ]

    await pool.query('UPDATE actualizacion SET nombreSolicitud=?, solicitud=?, tipo=?, apellidoSolicitante=?, nombreSolicitante=?, introduccion=?, status=? WHERE id=? AND email=?', proyData);

    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/editUser', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    if(req.body.pass == undefined) {
      await pool.query('UPDATE usuarios SET email=?, rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.rol, req.body.facultad, req.body.email]);
    } else {
      await pool.query('UPDATE usuarios SET email=?, pass=SHA(?), rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.pass, req.body.rol, req.body.facultad, req.body.email]);
    }
    res.json({data: 'ok'});
  } else {
    forbid(res);
  }
}) );

app.post('/finalizarProyecto', asyncMiddleware(async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await pool.query('UPDATE proyectos SET status=7 WHERE id=?', [req.body.fP]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/login', asyncMiddleware( async(req, res) => {
  let user = await verificarUser(req);
  if(user) { //valid user
    req.session.user = user.email;
    req.session.rol = user.rol;
    if(user.rol == 3) req.session.facultad = user.facultad;
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/register', asyncMiddleware( async (req, res) => {
  let user = req.body;
  if (await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO usuarios VALUES (?,SHA(?),?,?)', [user.email, user.pass, user.rol, user.facultad]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/enviarSolicitudA', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudA.html');
}))

app.get('/enviarActualizacion', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarActualizacion.html');
}))

app.post('/subirAval', asyncMiddleware(async (req, res) =>{
  if (await isValidSessionAndRol(req, 2)) {

    await upload.any()(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si el archivo es mayor a 5MB.');
      } else {
        console.log(req.body);
        console.log(req.files);
        let dataDoc = [
          //id
          req.body.refProyecto,
          //refAvance
          req.files[0].path,
          req.files[0].filename,
          //fechaSubida
          //tipo -> Aval -> 3
          //numero -> 1
        ];
        await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,NOW(),3,1)', dataDoc);
        res.redirect('/success');
      }
    });

  } else {
    forbid(res);
  }
}) );

app.post('/subirAvance', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await upload.array('inputFile',10)(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.body);
        let numerosAvance = await pool.query('SELECT numero FROM avances WHERE refProyecto=?', [req.body.refProyecto]);
        let lastAvance = Math.max.apply(Math, numerosAvance.map(x => x.numero));
        lastAvance < 0 ? lastAvance = 0 : '';
        let avanceData = [
          // id
          req.body.refProyecto,
          lastAvance + 1,
          `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,
          req.body.notaAvance,
        ]
        let qryRes = await pool.query('INSERT INTO avances VALUES(0,?,?,?,?)', avanceData);
        await pool.query('UPDATE proyectos SET avances=avances+1 WHERE id=?', [req.body.refProyecto]);

        for(let i = 0; i < req.files.length; i++) {
          let docData = [
            // id
            req.body.refProyecto,
            qryRes.insertId,
            req.files[i].path,
            req.files[i].filename,
            // Fecha subida
            // tipo -> 4: avances
            i+1 // numero
          ]
          await pool.query('INSERT INTO documentos VALUES(0,?,?,?,?,NOW(),4,?)', docData);
        }
        res.redirect('/success');
      }
    });


  } else {
    forbid(res);
  }
}))

app.post('/uploadProject', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      req.session.user, // email
      req.body.nombreS,
      "",
      req.session.user,
      "",
      req.body.Carrera,
      req.body.Decripcion,
      req.body.tipo,
      "",
      "",
      `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,//fecha inicio
      `${req.body.anoFin}-${req.body.mesFin}-${req.body.diaFin}`,//fechafin
      req.body.objGeneral,
      req.body.objsEspecificos,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Servicio Comunitario
      /* 2: Extension
      /* ------------------------------*/
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: devuelto
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
      //nota
      //avances -> 0
    ]
    let qryRes = await pool.query('INSERT INTO proyectos VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,0)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        //refAvance: NULL
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );
app.post('/uploadSolicitudActualizacion', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log("/uploadSolicitudActualizacion")
  console.log(req.body);
  //console.log("El user, asumo yo: ",req.session)
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let asesoData = [
      req.session.user,
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ Solicitud-------------------------
      /* 1: Creacion
      /* 2: Rediseño
      /* ------------------------------*/
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa Academico
      /* ------------------------------*/

      req.body.apellidoSolicitanteA,
      req.body.nombreSolicitanteA,
      req.body.introduccion,
      1



    ]
    let fecha= (new Date()).toISOString().split('T')[0]
    let qryRes = await pool.query('INSERT INTO actualizacion VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,NULL)', asesoData);
    // (`INSERT INTO actualizacion (nombreSolicitud, email, fechaSolicitud, Solicitud, tipo, apellidoSolicitante, nombreSolicitante, introduccion, status, nota) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10)`,  [req.body.nombreSolicitud, req.session.user, fecha, req.body.Solicitud, req.body.tipo, req.body.apellidoSolicitanteA, req.body.nombreSolicitanteA, req.body.introduccion, 1, null]);
    console.log("El pakage a enviar: ", asesoData)
    console.log("El qryRes: ", qryRes)
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        //refAvance: NULL
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,NULL,?,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,NULL,?,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );


app.post('/uploadProjectDDC', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      req.session.user, // email
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipo,
      /* ^ asunto-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.apellidoSolicitante,
      req.body.nombreSolicitante,
      req.body.disenno,
      req.body.coordinador,
      req.body.introduccion,
      req.body.participantes,
      req.body.descripcion,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: devuelto
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
    ]
    let qryRes = await pool.query('INSERT INTO carreras VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,?,?,NULL)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        //refAvance: NULL
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );

app.post('/uploadSolicicitudAsesoria', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let asesoData = [
      req.session.user, // email
      req.body.titulo,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa Academico
      /* ------------------------------*/
      req.body.apellidoSolicitanteA,
      req.body.nombreSolicitanteA,
      req.body.cantidadParticipantes,
      req.body.lugar,
      req.body.fechaCapacitacion,
      req.body.introduccion,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: rechazado por devuelto
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
    ]
    let qryRes = await pool.query('INSERT INTO asesorias VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,NULL)', asesoData);

    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );

// Else

app.get('*', function(req, res) {
  forbid(res);
})

function forbid(res) {
  res.status(403).sendFile('Forbid.html', options);
}

function send(res, file) {
  res.sendFile(file, options);
}

// Verifica que el usuario y la clave coincidan
async function verificarUser(req) {
  console.log('verificarUser');
  console.log(req.body.email);
  let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND pass = SHA(?)', [req.body.email,req.body.pass]);
  return resp.length ? resp[0] : false;
}

async function verificarAutoridad(req, id) {

  let resp = await pool.query('SELECT id,email FROM carreras WHERE id=? AND email=?', [id,req.session.user]);
  return resp.length ? true : false;
}

// Verifica que el usuario y rol concuerden con la bd
// y que sea el rol que se requiere (parametro rol)
async function isValidSessionAndRol(req, rol) {
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return req.session.rol == rol;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function isValidSessionAndRol(req, rol1, rol2) {
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return (req.session.rol == rol1 || req.session.rol == rol2);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = app;
