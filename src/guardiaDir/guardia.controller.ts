import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Guardia } from "./guardia.entity.js"

const em = orm.em
em.getRepository(Guardia)

async function getAll(req:Request, res:Response){
    try{
        const guardias = await em.getConnection().execute(`select * from guardia guar where gua.fecha_fin_contrato is null;`);
        res.status(201).json({ message: 'los guardias:', data: guardias})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function getSome(req : Request, res : Response){
    try{
        const guardias = await em.find(Guardia, { nombre: '%req.params.nombreParcial%'})
        res.status(201).json({ data: guardias })
    } catch (error: any) {
        res.status(404).json({ message: error.message})
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
        const si_o_no = await em.getConnection().execute(`select count(*) as cont from guardia gua where gua.dni = ?;`, [req.body.dni]);
        console.log(si_o_no[0].cont)
        if(si_o_no[0].cont === 0){
            const elGuardia = await em.create(Guardia, req.body) 
            await em.flush()
            res.status(201).json({message: 'guardia creado', data: elGuardia})
        }else{
            console.log('aca')
            res.status(409).json({message: 'guardia ya creado'})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

export { getAll, getSome, getOne, add }
console.log('ga')