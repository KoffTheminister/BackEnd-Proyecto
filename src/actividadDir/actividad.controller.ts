import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em
//em.getRepository(Actividad)

async function getAll(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, {}, { populate: ['reclusos', 'miGuardia']})
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad) //
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad }, { populate: ['reclusos', 'miGuardia']})
        res.status(201).json({ data: laActividad, message: 'actividad encontrada.'} )
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const laActividad = em.create(Actividad, req.body)
        await em.flush()  //ejecuta todas las operaciones previamente establecidas (modificaciones, creaciones, etc)
        res.status(201).json({message: 'actividad creada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_actividad = Number.parseInt(req.params.cod_actividad)
        const actividadParaCambiar = em.getReference(Actividad, cod_actividad) // genera un registro del tipo Actividad pero solo con el id
        await em.removeAndFlush(actividadParaCambiar)
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_actividad = Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOne(Actividad, { cod_actividad })
        if (laActividad == null) {
            res.status(400).json({ message: 'La actividad buscada no coincide con ninguna de las registradas'})
        }
        em.assign(laActividad,)
        await em.flush()
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

export { getAll, getOne, add, update, deleteOne }
