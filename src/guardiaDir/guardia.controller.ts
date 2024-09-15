import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Guardia } from "./guardia.entity.js"

const em = orm.em
em.getRepository(Guardia)

function sanitizarInputDeGuardia(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fechaIniContrato: req.body.fechaIniContrato,
        fechaFinContrato: req.body.fechaFinContrato,
        contrasenia: req.body.contrasenia
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const guardias = await em.find(Guardia, {})
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

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_guardia: any[] = [];
        cod_guardia[0] = Number(req.params.cod_guardia)
        const guardiaVerdadero = await em.findOne(Guardia, cod_guardia[0])
        if (guardiaVerdadero === null){
            return res.status(500).json({message: 'guardia no encontrado'})
        }
        const guardiaParaBorrar = await em.getReference(Guardia, cod_guardia[0])
        await em.removeAndFlush(guardiaParaBorrar)
        res.status(200).json({ message: 'guardia eliminado' })
    } catch (error: any) {
        res.status(500).json({ message : error.message })
    }
}

export { getAll, getSome, getOne, add, update, deleteOne, sanitizarInputDeGuardia }
