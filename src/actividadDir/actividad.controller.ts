import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizarInputDeActividad(req : Request, res : Response, next: NextFunction){
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
}
async function getAll(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, {})
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getSome(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, { nombre: '%req.params.nombreParcial%' })
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad })
        res.status(201).json({ data: laActividad, message: 'actividad encontrada.'} )
    } catch (error: any){
        res.status(404).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const cant_habilitados = await em.getConnection().execute(`select count(*) from condena con
                                                            inner join recluso rec on con.cod_recluso_cod_recluso = rec.cod_recluso
                                                            inner join estadia est on est.cod_recluso_cod_recluso = rec.cod_recluso and est.fecha_fin is null
                                                            where abs(DATEDIFF(rec.fecha_nac, curdate())) > (?/365) and con.fecha_fin_real is null and est.cod_celda_cod_sector_cod_sector = ? and est.fecha_fin is null;`, [req.body.edad_minima, req.body.cod_sector_cod_sector]);
        // const laActividad = em.create(Actividad, req.body)
        // await em.flush()
        res.status(201).json({message: 'actividad creada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_actividad : any[] = [];
        cod_actividad[0] = Number(req.params.cod_actividad)
        const actividadParaBorrar = em.getReference(Actividad, cod_actividad[0])
        await em.removeAndFlush(actividadParaBorrar)
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_actividad : any[] = [];
        cod_actividad[0] = Number(req.params.cod_actividad)
        const laActividadVerdadera = await em.findOne(Actividad, cod_actividad[0])
        if (laActividadVerdadera == null) {
            res.status(400).json({ message: 'La actividad buscada no coincide con ninguna de las registradas'})
        }
        const laActividad = em.getReference(Actividad, cod_actividad[0])
        em.assign(laActividad, req.body)
        await em.flush()
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

export { getAll, getOne, add, update, deleteOne, getSome, sanitizarInputDeActividad }
