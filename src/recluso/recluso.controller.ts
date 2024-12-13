import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Recluso } from "./recluso.entity.js"
import { Condena } from "../condena/condena.entity.js"

const em = orm.em
em.getRepository(Recluso)

function sanitizar_input_de_recluso(req: Request, res: Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fecha_nac: req.body.fecha_nac
    }
    Object.keys(req.body.sanitized_input).forEach((key) => {
        if(req.body.sanitized_input[key] === undefined){
            delete req.body.sanitized_input[key]
            return res.status(409).json({message: `el atributo ${key} esta faltando`})
        }
    })
    const fecha_nac = new Date(req.body.sanitized_input.fecha_nac);
    const today = new Date()
    let años = today.getFullYear() - fecha_nac.getFullYear();
    if(años < 16){
        return res.status(409).json({ message: 'el recluso ingresado tiene menos de 16 años por lo que no puede ingresar.'})
    }

    if(req.body.sanitized_input.nombre.length > 255){
        return res.status(409).json({ message: 'el nombre ingresado sobre pasa la cantidad de caracteres permitidos'})
    }

    if(req.body.sanitized_input.apellido.length > 255){
        return res.status(409).json({ message: 'el apellido ingresado sobre pasa la cantidad de caracteres permitidos'})
    }

    if(req.body.sanitized_input.dni > 100000000){ //modificar esto a 130000000 en unos 20 años
        return res.status(409).json({ message: 'el dni ingresado sobre pasa los valores posibles'})
    }
    next()
}

async function get_all(req:Request, res:Response){
    try{
        const reclusos = await em.find(Recluso, {})
        res.status(201).json({ status: 201, data: reclusos})
    } catch (error: any) {
        res.status(404).json({ status: 404 })
    }
}

async function get_one(req: Request, res: Response){
    try {
        const dni = Number.parseInt(req.body.dni)
        const rec = em.findOne(Recluso, {dni: dni})
        //const rec = await em.getConnection().execute(`select * from recluso rec where rec.dni = ?;`, [req.params.dni]);
        if(rec !== null){
            res.status(201).json({ status: 201, data: rec } )
        }else{
            res.status(404).json({ status: 404 })
        }
    } catch (error: any){
        res.status(500).json({ status: 500, message: error.message})
    }
}

async function add(req: Request, res: Response){
    try{
        const dni = Number.parseInt(req.body.dni)
        const rec = await em.findOne(Recluso, {dni: dni})
        //const rec = await em.getConnection().execute(`select * from recluso rec where rec.dni = ?;`, [req.body.dni]);
        if(rec === null){
            const el_recluso = await em.create(Recluso, req.body)
            await em.flush()
            res.status(201).json({ status: 201, data: el_recluso.cod_recluso })
        }else{
            /*
            const condena_si_o_no = await em.getConnection().execute(`select count(*) cont 
                                                                    from condena c
                                                                    inner join recluso r on c.cod_recluso_cod_recluso = r.cod_recluso
                                                                    where dni = ? and c.fecha_fin_real is null;`, [req.body.dni]);
            */
            //const condena = rec.get_condena_activa()
            /*
            if(condena == null){
                res.status(201).json({  status: 202, data: rec.cod_recluso})
            } else {
                res.status(201).json({  status: 203, data: rec.cod_recluso})
            }
            */
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function buscar_recluso(cod_recluso: number){
    const recluso = em.findOne(Recluso, {cod_recluso: cod_recluso})
    //const rec = await em.getConnection().execute(`select * from recluso rec where rec.dni = ?;`, [req.params.dni]);
    return recluso

}

export { get_all, get_one, add, sanitizar_input_de_recluso, buscar_recluso }
