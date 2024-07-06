import { Request, Response, NextFunction } from "express"
import { ActividadRepository } from "./actividad.repository.js"
import { Actividad } from "./actividad.entity.js"

const actividadRepositorio = new ActividadRepository 


 
function sanitizarInputDeActividad(req: Request, res: Response, next: NextFunction){
    req.body.inputSanitizado = {
        descripcion: req.body.descripcion,
        diaSemana: req.body.diaSemana,
        horaMinutoComienzo: req.body.horaMinutoComienzo,
        horaMinutoFin: req.body.horaMinutoFin,
        locacion: req.body.locacion
    }

    Object.keys(req.body.inputSanitizado).forEach((key) => {
        if(req.body.inputSanitizado[key] === undefined){
            delete req.body.inputSanitizado[key]
        }
    })
    next()
}

async function getAll(req:Request, res:Response){
    res.json({ data: await actividadRepositorio.getAll() })
}

async function getOne(req: Request, res: Response){
    const idAct = req.params.legajo
    const actividad = await actividadRepositorio.getOne(idAct)
    if (actividad !== undefined){
        return res.json({data: actividad})
    }else{
        return res.status(404).send({message: 'Actividad no encontrada.'})
    }
}

async function add(req: Request, res: Response){
    const { descripcion, diaSemana, horaMinutoComienzo, horaMinutoFin, locacion } = req.body
    const aInput = new Actividad(
        descripcion, 
        diaSemana, 
        horaMinutoComienzo, 
        horaMinutoFin, 
        locacion
    )
    
        const nuevaActividad = await actividadRepositorio.add(aInput)
        res.status(201).send({message: 'Actividad agregada', data: nuevaActividad})
}

async function update(req: Request, res: Response){
    let rta = await actividadRepositorio.update(req.body, req.params.actId)
    if (rta === undefined){
        res.status(404).send({message: 'La actividad elegida no coincide con ninguna de las disponibles.'})
    }else{
        return res.status(201).send({message: 'La actividad elegida fue correctamente modificada y quedo como:', data: rta})
    }
}

async function deleteOne(req: Request, res: Response) {
    let rta = await actividadRepositorio.deleteOne(req.body.actId)
    return res.status(201).send({message: rta})
}


export { sanitizarInputDeActividad, getAll, getOne, add, update, deleteOne }
