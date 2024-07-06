import { Request, Response, NextFunction } from "express"
import { GuardiaRepository } from "./guardia.repository.js"
import { Guardia } from "./guardia.entity.js"

const guardiaRepositorio = new GuardiaRepository 


 
function sanitizeGuardiaInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        legajo: req.body.legajo
    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function getAll(req:Request, res:Response){
    res.json({ data: await guardiaRepositorio.getAll() })
}

async function getOne(req: Request, res: Response){
    const legajo = req.params.legajo
    const guardia = await guardiaRepositorio.getOne(legajo)
    if (!guardia){
        return res.status(404).send({message: 'Guardia no encontrado.'})
    }else{
        res.json({data: guardia})
    }
}

async function add(req: Request, res: Response){
    const { nombre, apellido } = req.body
    const gInput = new Guardia(
        nombre, 
        apellido
    )
    //falta validacion
    const nuevoGuardia = await guardiaRepositorio.add(gInput)
    //console.log('Se acaba de agregar una nueva actividad con descripcion: ', nuevaActividad.descripcion ,', dia de la semana: ', nuevaActividad.diaSemana ,', hora comienzo: ', nuevaActividad.horaMinutoComienzo,', hora fin: ', nuevaActividad.horaMinutoFin,'y transcurre en:', nuevaActividad.locacion)
    res.status(201).send({message: 'Actividad agregada', data: nuevoGuardia})
}

async function update(req: Request, res: Response){
    let rta = await guardiaRepositorio.update(req.body, req.params.actId)
    if (rta === undefined){
        res.status(404).send({message: 'El guardia elegido no coincide con ninguno registrado.'})
    }else{
        return res.status(201).send({message: 'El guardia elegido fue correctamente modificado y su forma final es:', data: rta})
    }
}

async function deleteOne(req: Request, res: Response) {
    let rta = await guardiaRepositorio.deleteOne(req.body.actId)
    return res.status(201).send({message: rta})
}


export { sanitizeGuardiaInput, getAll, getOne, add, update, deleteOne }
