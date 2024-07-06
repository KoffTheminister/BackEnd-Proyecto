import { GuardiaRepository } from "./guardia.repository.js";
import { Guardia } from "./guardia.entity.js";
const guardiaRepositorio = new GuardiaRepository;
function sanitizeGuardiaInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        legajo: req.body.legajo
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function getAll(req, res) {
    res.json({ data: guardiaRepositorio.getAll() });
}
function getOne(req, res) {
    const legajo = req.params.legajo;
    const guardia = guardiaRepositorio.getOne(legajo);
    if (!guardia) {
        return res.status(404).send({ message: 'Guardia no encontrado.' });
    }
    else {
        res.json({ data: guardia });
    }
}
function add(req, res) {
    const { nombre, apellido } = req.body;
    const nuevoGuardia = new Guardia(nombre, apellido);
    //falta validacion
    guardiaRepositorio.add(nuevoGuardia);
    //console.log('Se acaba de agregar una nueva actividad con descripcion: ', nuevaActividad.descripcion ,', dia de la semana: ', nuevaActividad.diaSemana ,', hora comienzo: ', nuevaActividad.horaMinutoComienzo,', hora fin: ', nuevaActividad.horaMinutoFin,'y transcurre en:', nuevaActividad.locacion)
    res.status(201).send({ message: 'Actividad agregada', data: nuevoGuardia });
}
function update(req, res) {
    let rta = guardiaRepositorio.update(req.body, req.params.actId);
    if (rta === -1) {
        res.status(404).send({ message: 'El guardia elegido no coincide con ninguno registrado.' });
    }
    else {
        return res.status(201).send({ message: 'El guardia elegido fue correctamente modificado y su forma final es:', data: rta });
    }
}
function deleteOne(req, res) {
    let rta = guardiaRepositorio.deleteOne(req.body.actId);
    if (rta === undefined) {
        return res.status(404).send({ message: 'El guardia no fue encontrado.' });
    }
    else {
        return res.status(201).send({ message: 'El guardia fue encontrado y eliminado.' });
    }
}
export { sanitizeGuardiaInput, getAll, getOne, add, update, deleteOne };
//# sourceMappingURL=guardia.controller.js.map