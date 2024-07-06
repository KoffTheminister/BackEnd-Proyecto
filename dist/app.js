//librerias y modulos
import express from 'express';
import { ActividadRepository } from './actividadDir/actividad.repository.js';
import { Actividad } from './actividadDir/actividad.entity.js';
import { GuardiaRepository } from './guardiaDir/guardia.repository.js';
import { Guardia } from './guardiaDir/guardia.entity.js';
//import { ReadLine } from 'readline'
//misc
const app = express();
app.use(express.json());
const actividadRepositorio = new ActividadRepository();
const guardiaRepositorio = new GuardiaRepository();
//manejo de actividades
app.get('/api/actividades/:actId', (req, res) => {
    return res.status(201).json(actividadRepositorio.getOne(req.params.actId));
});
app.get('/api/actividades', (req, res) => {
    return res.status(201).json(actividadRepositorio.getAll());
});
app.post('/api/actividades', (req, res) => {
    const { descripcion, diaSemana, horaMinutoComienzo, horaMinutoFin, locacion } = req.body;
    const nuevaActividad = new Actividad(descripcion, diaSemana, horaMinutoComienzo, horaMinutoFin, locacion);
    //falta validacion
    actividadRepositorio.add(nuevaActividad);
    console.log('Se acaba de agregar una nueva actividad con descripcion: ', nuevaActividad.descripcion, ', dia de la semana: ', nuevaActividad.diaSemana, ', hora comienzo: ', nuevaActividad.horaMinutoComienzo, ', hora fin: ', nuevaActividad.horaMinutoFin, 'y transcurre en:', nuevaActividad.locacion);
    res.status(201).send({ message: 'Actividad agregada', data: nuevaActividad });
});
app.put('/api/actividades/:actId', (req, res) => {
    let rta = actividadRepositorio.update(req.body, req.params.actId);
    if (rta === -1) {
        res.status(404).send({ message: 'La actividad elegida no coincide con ninguna registrada.' });
    }
    else {
        return res.status(201).send({ message: 'La actividad elegida fue correctamente modificada y su forma final es:', data: rta });
    }
});
app.delete('/api/actividades/:actId', (req, res) => {
    let rta = actividadRepositorio.deleteOne(req.body.descripcion);
    if (rta === undefined) {
        return res.status(404).send({ message: 'la actividad no fue encontrada.' });
    }
    else {
        return res.status(201).send({ message: 'la actividad no fue encontrada y eliminada.' });
    }
});
//manejo de guardias
app.get('/api/guardias/:legajo', (req, res) => {
    return res.status(201).json(guardiaRepositorio.getOne(req.params.legajo));
});
app.get('/api/guardias', (req, res) => {
    return res.status(201).json(guardiaRepositorio.getAll());
});
app.post('/api/guardias', (req, res) => {
    const { nombre, apellido } = req.body;
    const nuevoGuardia = new Guardia(nombre, apellido);
    //falta validacion
    guardiaRepositorio.add(nuevoGuardia);
    //console.log('Se acaba de agregar una nueva actividad con descripcion: ', nuevaActividad.descripcion ,', dia de la semana: ', nuevaActividad.diaSemana ,', hora comienzo: ', nuevaActividad.horaMinutoComienzo,', hora fin: ', nuevaActividad.horaMinutoFin,'y transcurre en:', nuevaActividad.locacion)
    res.status(201).send({ message: 'Actividad agregada', data: nuevaActividad });
});
app.put('/api/actividades/:descripcion', (req, res) => {
    let rta = actividadRepositorio.update(req.body, req.params.descripcion);
    if (rta === -1) {
        res.status(404).send({ message: 'La actividad elegida no coincide con ninguna registrada.' });
    }
    else {
        return res.status(201).send({ message: 'La actividad elegida fue correctamente modificada y su forma final es:', data: rta });
    }
});
app.delete('/api/actividades/:descripcion', (req, res) => {
    let rta = actividadRepositorio.deleteOne(req.body.descripcion);
    if (rta === undefined) {
        return res.status(404).send({ message: 'la actividad no fue encontrada.' });
    }
    else {
        return res.status(201).send({ message: 'la actividad no fue encontrada y eliminada.' });
    }
});
app.listen(8080, () => {
    console.log('server correctly running at 8080');
});
//# sourceMappingURL=app.js.map