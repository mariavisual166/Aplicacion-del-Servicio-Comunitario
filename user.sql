select User from mysql.user;

SELECT tipo, COUNT(tipo) AS cant
FROM carreras
GROUP BY tipo;
