import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Taller } from "./taller.entity.js"
import { Recluso } from "../reclusoDir/recluso.entity.js"


const em = orm.em

function sanitizarInputDeTaller(req : Request, res : Response, next: NextFunction){
    let flag:Boolean = false

    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        diaDeLaSemana: req.body.dia_de_la_semana,
        horaInicio: req.body.hora_inicio,
        horaFin: req.body.hora_fin,
        estado: req.body.estado
    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body[key]
            flag = true
        }
    })

    if (["POST"].includes(req.method) && flag === true){
        return res.status(400).json({ message: "se necesitan todos los atributos" })
    }
    next()
}
//asdasd
async function getAll(req:Request, res:Response){
    try{
        const talleres = await em.getConnection().execute(`select * from taller tall where tall.estado = 1 order by dia_de_la_semana;`);
        res.status(201).json({ status: 201, data: talleres})
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_taller =  Number.parseInt(req.params.cod_taller)
        const elTaller = await em.findOneOrFail(Taller, { cod_taller }, {populate: ['reclusos']})
        res.status(201).json({ data: elTaller, status: 201} )
    } catch (error: any){
        res.status(404).json({ status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        console.log(req.body.sanitizedInput)
        const si_o_no = await em.getConnection().execute(
            `select count(*) as cont 
            from taller ta 
            where ta.dia_de_la_semana = ? and ta.hora_inicio = ? and ta.hora_fin = ?;`, [req.body.sanitizedInput.diaDeLaSemana, req.body.sanitizedInput.horaInicio, req.body.sanitizedInput.horaFin]);
        if(si_o_no[0].cont === 0){
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
            res.status(404).json({ status: 404})
        }
        const si_o_no = await em.getConnection().execute(
            `select count(*) as cont 
            from taller ta 
            where ta.nombre = ? and ta.dia_de_la_semana = ? and ta.hora_inicio = ? and ta.hora_fin = ?;`, [req.body.nombre, req.body.diaDeLaSemana, req.body.horaInicio, req.body.horaFin]);
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
        if(elReclusoVerdadero !== null && elTallerVerdadero !== null){
            if(elTallerVerdadero.estado === 1){
                try{
                    const inscripcion = await em.getConnection().execute(`insert into taller_reclusos(taller_cod_taller, recluso_cod_recluso) values (?, ?);`, [cod_taller[0], cod_recluso[0]]);
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

export { getAll, getOne, add, update, inscripcion, sanitizarInputDeTaller }





