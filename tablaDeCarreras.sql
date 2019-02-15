CREATE TABLE usuarios(
  email     VARCHAR(35) NOT NULL PRIMARY KEY,
  pass      VARCHAR(40) NOT NULL,
  rol       TINYINT UNSIGNED NOT NULL,
-- 1: Admin
-- 2: curriculum
-- 3: Facultad
  facultad  VARCHAR(15)
);

CREATE TABLE carreras(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  fechaSolicitud          DATE NOT NULL,
  nombreSolicitud         VARCHAR(100) NOT NULL,
  solicitud               TINYINT UNSIGNED NOT NULL,
  -- 1: Creacion
  -- 2: Redise;o
  tipo                    TINYINT UNSIGNED NOT NULL,
  -- 1: Pregrado
  -- 2: Postgrado
  -- 3: Diplomado
  apellidoSolicitante     VARCHAR(30) NOT NULL,
  nombreSolicitante       VARCHAR(30) NOT NULL,
  disenno                 VARCHAR(100) NOT NULL,
  coordinador             VARCHAR(60) NOT NULL,
  introduccion            VARCHAR(300) NOT NULL,
  participantes           VARCHAR(300) NOT NULL,
  descripcion             VARCHAR(300) NOT NULL,
  status                  TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: rechazado por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  nota                    VARCHAR(200),

  PRIMARY KEY(id),
  INDEX fk_carreras_email_idx (email DESC),
    CONSTRAINT fk_carreras_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE asesorias(
  idA                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  fechaSolicitudA 	      DATE NOT NULL,
  titulo                   VARCHAR(100) NOT NULL,
  tipo                     TINYINT UNSIGNED NOT NULL,
  -- 1: Curso
  -- 2: Taller
  -- 3: Formacion
  apellidoSolicitanteA     VARCHAR(30) NOT NULL,
  nombreSolicitanteA       VARCHAR(30) NOT NULL,
  cantidadParticipantes    TINYINT UNSIGNED NOT NULL,
  lugar                    VARCHAR(300) NOT NULL,
  fechaCapacitacion        DATE NOT NULL,
  introduccion             VARCHAR(300) NOT NULL,
  status                   TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: rechazado por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  nota                    VARCHAR(200),
  PRIMARY KEY(idA),
  INDEX fk_asesoria_email_idx (email DESC),
    CONSTRAINT fk_asesoria_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE actualizacion(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombreSolicitud         VARCHAR(100) NOT NULL,
  email                   VARCHAR(35) NOT NULL,
  fechaSolicitud   	      DATE NOT NULL,
  Solicitud               TINYINT UNSIGNED NOT NULL,
  -- 1: Creacion
  -- 2: Rediseño
  tipo                     TINYINT UNSIGNED NOT NULL,
  -- 1: Carrera
  -- 2: Diplomado
  -- 3: Programa Academico
  apellidoSolicitante     VARCHAR(30) NOT NULL,
  nombreSolicitante       VARCHAR(30) NOT NULL,
  introduccion             VARCHAR(500) NOT NULL,
  status                   TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: rechazado por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  nota                    VARCHAR(200),
  PRIMARY KEY(id),
  INDEX fk_actualizacion_email_idx (email DESC),
    CONSTRAINT fk_actualizacion_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE documentos(
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  refProyecto           INT UNSIGNED DEFAULT NULL,
  refAvance             INT UNSIGNED DEFAULT NULL,
  ruta                  VARCHAR(380) NOT NULL,
  nombreDoc             VARCHAR(350) NOT NULL,
  fechaSubida           DATE NOT NULL,
  tipo                  TINYINT UNSIGNED NOT NULL,
-- 1: inicio,
-- 2: actualizados,
-- 3: aval,
-- 4: avances,
-- 5: final
  numero                TINYINT UNSIGNED NOT NULL,
-- Para, en dado caso, saber cual es el archivo que se corrige

  PRIMARY KEY(id),
  INDEX fk_documentos_refProyecto_idx (refProyecto DESC),
  CONSTRAINT fk_documentos_refProyecto
    FOREIGN KEY (refProyecto)
    REFERENCES carreras (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  INDEX fk_documentos_refActualizacion_idx (refAvance DESC),
  CONSTRAINT fk_documentos_refActualizacion
    FOREIGN KEY (refAvance)
    REFERENCES actualizacion (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
