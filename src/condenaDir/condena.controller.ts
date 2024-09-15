import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Condena } from "./condena.entity.js"

const em = orm.em
em.getRepository(Condena)

async function getAll(req:Request, res:Response){
    try{
        const condenas = await em.find(Condena, {})
        res.status(201).json({ message: 'las condenas:', data: condenas})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}


async function getOne(req: Request, res: Response){
    try {
        const cod_guardia =  Number.parseInt(req.params.cod_guardia) 
        const elGuardia = await em.findOneOrFail(Guardia, { cod_guardia })
        res.status(201).json({ data: elGuardia } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        let year = today.getFullYear();
        let finalDate = `${year}-${month}-${day}`
        let auc = await em.getConnection().execute(`insert into condena (cod_recluso_cod_recluso, fecha_ini, fecha_fin_estimada, fecha_fin_real) values (?, ?, ?, ?);`, [req.body.cod_recluso, finalDate, null, null]);
        await em.flush()
        console.log(req.body)
        Object.keys(req.body).forEach(async (key) => {
            if(key === "cod_recluso"){

            }else{
                let auc = await em.getConnection().execute(`insert into condena_sentencias (condena_cod_recluso_cod_recluso, condena_fecha_ini, sentencia_cod_sentencia) values (?, ?, ?);`, [req.body.cod_recluso, finalDate, req.body[key]]);
                await em.flush()
            }
        })
        // await em.flush()
        res.status(201).json({message: 'condena creada' })
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

/*
async function update(req: Request, res: Response) {
    try{
        const cod_guardia: any[] = [];
        cod_guardia[0] = Number(req.params.cod_guardia)
        const elGuardiaVerdadero = await em.findOne(Guardia, cod_guardia[0])
        if (elGuardiaVerdadero === null) {
            res.status(404).json({ message: 'La guardia buscada no coincide con ninguno de los registrados'})
        }
        const guardiaParaActualizar = em.getReference(Guardia, cod_guardia[0])
        em.assign(guardiaParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Guardia cambiado' })
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}
*/

export { getAll, add } // update, getSome, getOne, }
