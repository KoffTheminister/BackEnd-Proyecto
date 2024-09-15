import { Request, Response, NextFunction } from "express"
import { ActividadIlegal } from "./actividadIlegal.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizarInputDeActividadIlegal(req : Request, res : Response, next: NextFunction){
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const actividadesIlegales = await em.find(ActividadIlegal, {})
        res.status(201).json({ message: 'las actividades ilegales:', data: actividadesIlegales})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

/*
async function getSome(req:Request, res:Response){
    try{
        const talleres = await em.find(Taller, { nombre: '%req.params.nombreParcial%' })  //reveer si recibe params o body segun lo que diga gonza
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}
*/

async function getOne(req: Request, res: Response){
    try {
        const cod_act_ilegal =  Number.parseInt(req.params.cod_act_ilegal) //reveer si recibe params o body segun lo que diga gonza
        const laActIlegal = await em.findOneOrFail(ActividadIlegal, { cod_act_ilegal })
        res.status(201).json({ data: laActIlegal, message: 'actividad ilegal encontrada'} )
    } catch (error: any){
        res.status(404).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const laActIlegal = em.create(ActividadIlegal, req.body)
        await em.flush()
        res.status(201).json({message: 'actividad ilegal creada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}



export { getAll, getOne, add }
