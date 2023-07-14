require('dotenv').config();
const express = require('express');
const connection = require('../config/config');
const app = express();

module.exports.buscar_todo = app.get('/', (request, response) => {  
    const sql = `
    SELECT 
        id_donacion, fecha, monto
    FROM Donaciones 
    `;
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            response.status(200).send(results);
        } else {
            response.status(204).send('Sin resultado');
        }
    })               
});

module.exports.buscar = app.get('/:id', (request, response) => {
    const id_donacion = request.params.id;
    const sql = `
      SELECT
          id_donacion,
          fecha,
          monto
      FROM Donaciones
      WHERE id_donacion = ?
    `;
    connection.query(sql, id_donacion, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        response.status(200).send(results[0]);
      } else {
        response.status(204).send('Sin resultado');
      }
    });
  });

  module.exports.agregar = app.post('/', (request, response) => {
    const {
      id_donacion,
      fecha,
      monto
    } = request.body;
  
    const sql = `
      INSERT INTO Donaciones (      
          id_donacion,
          fecha,
          monto)
      VALUES (?, ?, ?)
    `;
  
    const values = [
      id_donacion,
      fecha,
      monto
    ];
  
    connection.query(sql, values, (error, results) => {
      if (error) throw error;
      response.status(200).send(`Categoria registrado correctamente con id ${results.insertId}`);
    });
  });

module.exports.actualizar = app.patch('/', (req, res) => {
    const { id_donacion,fecha,monto } = req.body;
    const sql = `
    UPDATE Donaciones 
    SET 
        fecha = ?, 
        monto = ?
    WHERE id_donacion = ?`;
    const values = [fecha,monto, id_donacion];

    connection.query(sql, values, (error, results) => {
        if (error) throw error;
        res.send(`Donacion con id ${id_donacion} actualizado correctamente`);
    });
});

module.exports.eliminar = app.delete('/:id', (request, response) => {
    const id_donacion = request.params.id;
  
    const sql = "DELETE FROM Donaciones WHERE id_donacion = ?";
    connection.query(sql, id_donacion, (error, results) => {
      if (error) throw error;
      if (results.affectedRows > 0) {
        response.status(200).send(`Donacion con id ${id_donacion} eliminado correctamente`);
      } else {
        response.status(404).send(`Donacion con id ${id_donacion} no encontrado`);
      }
    });
  });