import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Taller } from "./taller.entity.js"
import { Recluso } from "../recluso/recluso.entity.js"


const em = orm.em

function sanitizar_input_de_taller(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: req.body.estado
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if (req.body.sanitized_input[key] === undefined) {
            return res.status(400).json({ message: 'al menos un atributo esta faltando'})
        }
    })

    next()
}


function sanitizar_update_de_taller(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        estado: req.body.estado  //solo estos datos pueden ser modificados
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if (req.body.sanitized_input[key] === undefined) {
            delete req.body[key]
        }
    })

    next()
}



async function get_all(req:Request, res:Response){
    try{
        const talleres = await em.find(Taller, {estado: 1}, { orderBy: { dia_de_la_semana: 'asc' } })
        //const talleres = await em.getConnection().execute(`select * from taller tall where tall.estado = 1 order by dia_de_la_semana;`);
        res.status(201).json({ status: 201, data: talleres})
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_taller =  Number.parseInt(req.params.cod_taller)
        const elTaller = await em.findOneOrFail(Taller, { cod_taller })
        res.status(201).json({ data: elTaller, status: 201} )
    } catch (error: any){
        res.status(404).json({ status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const un_taller = await em.findOne(Taller, {dia_de_la_semana: req.body.sanitized_input.dia_de_la_semana, hora_inicio: req.body.sanitized_input.hora_inicio, hora_fin: req.body.sanitized_input.hora_fin})
        /*
        const si_o_no = await em.getConnection().execute(
            `select count(*) as cont 
            from taller ta 
            where ta.dia_de_la_semana = ? and ta.hora_inicio = ? and ta.hora_fin = ?;`, [req.body.sanitizedInput.diaDeLaSemana, req.body.sanitizedInput.horaInicio, req.body.sanitizedInput.horaFin]);
        */
        if(un_taller == null){
            const elTaller = em.create(Taller, req.body.sanitizedInput)
            await em.flush()
            res.status(201).json({status: 201, data: elTaller})
        }else{
            res.status(409).json({status: 409})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const elTallerVerdadero = await em.findOne(Taller, cod_taller[0])
        if (elTallerVerdadero == null) {
            return res.status(404).json({ status: 404})
        }
        const elTaller = em.getReference(Taller, cod_taller[0])
        em.assign(elTaller, req.body)
        await em.flush()
        res.status(201).json({status: 201})
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function inscripcion(req: Request, res: Response) {
    try {
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const elTallerVerdadero = await em.findOne(Taller, cod_taller[0])
        const cod_recluso : any[] = [];
        cod_recluso[0] = Number(req.params.cod_recluso)
        const elReclusoVerdadero = await em.findOne(Recluso, cod_recluso[0])
        if(elReclusoVerdadero != null && elTallerVerdadero != null){
            if(elTallerVerdadero.estado === 1){
                try{
                    elTallerVerdadero.reclusos.add(elReclusoVerdadero)
                    //const inscripcion = await em.getConnection().execute(`insert into taller_reclusos(taller_cod_taller, recluso_cod_recluso) values (?, ?);`, [cod_taller[0], cod_recluso[0]]);
                    await em.flush()
                    res.status(201).json({ status: 201 })
                } catch (error: any){
                    res.status(409).json({ status: 409 })
                }
            } else {
                res.status(410).json({ status: 410})
            }
        }
        if(elReclusoVerdadero === null){
            res.status(404).json({ status: 404 })
        }
        if(elTallerVerdadero === null){
            res.status(404).json({ status: 403 })
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { get_all, get_one, add, update, inscripcion, sanitizar_input_de_taller, sanitizar_update_de_taller }





