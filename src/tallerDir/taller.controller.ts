import { Request, Response, NextFunction } from "express"
import { Taller } from "./taller.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizarInputDeTaller(req : Request, res : Response, next: NextFunction){
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const talleres = await em.find(Taller, {})
        res.status(201).json({ message: 'los talleres:', data: talleres})
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
        const cod_taller =  Number.parseInt(req.params.cod_taller) //reveer si recibe params o body segun lo que diga gonza
        const elTaller = await em.findOneOrFail(Taller, { cod_taller })
        res.status(201).json({ data: elTaller, message: 'taller encontrado'} )
    } catch (error: any){
        res.status(404).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const elTaller = em.create(Taller, req.body)
        await em.flush()
        res.status(201).json({message: 'taller creado'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}



export { getAll, getOne, add }
