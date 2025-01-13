import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sector } from "./sector.entity.js"
import { get_sentencias_especificas } from "../sentencia/sentencia.controller.js"
import { Sentencia } from "../sentencia/sentencia.entity.js"

const em = orm.em
em.getRepository(Sector)

async function get_all(req:Request, res:Response){
    try{
        const sectores = await em.find(Sector, {})
        res.status(201).json({ status: 201, data: sectores})
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function get_sector(cod_sector: number) {
    const el_sector = await em.findOne(Sector, { cod_sector })
    return el_sector
}

async function get_one(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const elSector = await em.findOneOrFail(Sector, { cod_sector })
        res.status(201).json({ status: 201, data: elSector } )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function get_sectores_con_sentencia(la_sentencia: Sentencia){
    let sectores_con_sentencia: any[] = []
    const sectores = await em.find(Sector, 
        {}, 
        //{populate: ['celdas', 'sentencias']} tiraba error
    )
    let i = 0
    let bool = true
    sectores.forEach(un_sector => {
        console.log('holi')
        if(un_sector.sentencias.contains(la_sentencia)){
            sectores_con_sentencia.push(un_sector)
        }
    })
    return sectores_con_sentencia

}

async function get_celdas(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector })
        res.status(201).json({ status: 201, data: el_sector.celdas} )
    } catch (error: any){
        res.status(404).json({status: 404 })
    }
}

async function agregar_sentencia_a_sector(req : Request, res : Response){
    try{
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOne(Sector, 
            { cod_sector }, 
            //populate: ['sentencias']} tiraba error
        )
        if(el_sector != null){
            const las_sentencias = await get_sentencias_especificas(req.body.sentencias)
            const sentencias_agregadas = el_sector.agregar_sentencias(las_sentencias)
            res.status(201).json({ status: 201, data: sentencias_agregadas})
        }
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}


export { get_all, get_one, get_celdas, agregar_sentencia_a_sector, get_sectores_con_sentencia, get_sector}
