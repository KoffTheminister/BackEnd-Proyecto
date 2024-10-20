import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Guardia } from "./guardia.entity.js"

const em = orm.em
em.getRepository(Guardia)

async function getAll(req:Request, res:Response){
    try{
        const guardias = await em.getConnection().execute(`select * from guardia guar where guar.fecha_fin_contrato is null;`);
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
        const si_o_no = await em.getConnection().execute(`select * from guardia gua where gua.dni = ?;`, [req.body.dni]);
        if(si_o_no.length === 0){
            const elGuardia = await em.create(Guardia, req.body) 
            await em.flush()
            res.status(201).json({message: 'guardia creado', data: elGuardia})
        } else {
            if(si_o_no[0].fecha_fin_contrato === null){
                res.status(409).json({ message: 'guardia ya creado anteriormente y en vigencia.' })
            } else {
                const today = new Date();
                const day = today.getDate();
                const month = today.getMonth() + 1;
                let year = today.getFullYear();
                let finalDate = `${year}-${month}-${day}`
                let modif1 = await em.getConnection().execute(`update guardia set fecha_ini_contrato = ? where dni = ?;`, [finalDate, req.body.dni]);
                let modif2 = await em.getConnection().execute(`update guardia set fecha_fin_contrato = null where dni = ?;`, [req.body.dni]);
                let modif3 = await em.getConnection().execute(`update turno set fecha_fin = ? where cod_guardia_cod_guardia = ?;`, [finalDate, si_o_no[0].cod_guardia]);
                res.status(202).json({ message: 'contrato renovado.' })
            } 
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function finalizarContrato(req: Request, res: Response){
    try{
        const cod_guardia =  Number.parseInt(req.params.cod_guardia) 
        const elGuardia = await em.findOneOrFail(Guardia, { cod_guardia })
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        let year = today.getFullYear();
        let finalDate = `${year}-${month}-${day}`
        const modif = await em.getConnection().execute(`update guardia set fecha_fin_contrato = ? where cod_guardia = ?;`, [finalDate, cod_guardia]);
        await em.flush()
        res.status(201).json({message: 'contrato finalizado'})
    } catch (error: any) {
        res.status(404).json({message : error.message})
    }
}

export { getAll, getSome, getOne, add, finalizarContrato}
