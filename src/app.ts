//librerias y modulos
import 'reflect-metadata'
import express from 'express'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { guardiaRouter } from './guardiaDir/guardia.routes.js'
import { actividadRouter } from './actividadDir/actividad.routes.js'
import { sentenciaRouter } from './sentenciaDir/sentencia.routes.js'
//import { celdaRouter } from './celdaDir/celda.routes.js'
import { sectorRouter } from './sectorDir/sector.routes.js'
import { administradorRouter } from './administradorDir/administrador.routes.js'
import { condenaRouter } from './condenaDir/condena.routes.js'
//import { estadiaRouter } from './estadiaDir/estadia.routes.js'
import { reclusoRouter } from './reclusoDir/recluso.routes.js'
import { tallerRouter } from './tallerDir/taller.routes.js'
//import { turnoRouter } from './turnoDir/turno.routes.js'
//import { actividadIlegalRouter } from './actividadIlegalDir/actividadIlegal.routes.js'
//import { turnoRouter } from './tallerDir/taller.routes.js'



//misc
const app = express()
app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

//manejo de actividades
app.use('/actividades', actividadRouter)

//manejo de guardias
app.use('/guardias', guardiaRouter)

//manejo de sentencias
app.use('/sentencias', sentenciaRouter)

//manejo de sectores
app.use('/sectores', sectorRouter)

//manejo de administradores
app.use('/administradores', administradorRouter)

//manejo de reclusos
app.use('/reclusos', reclusoRouter)

//manejo de condenas
app.use('/condenas', condenaRouter)

//manejo de condenas
app.use('/talleres', tallerRouter)

//manejo de sectores
app.use('/sectores', sectorRouter)

/*
//manejo de celdas
app.use('/celda', celdaRouter)

//manejo de estadias
app.use('/estadias', estadiaRouter)
*/

// url invalido
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()  // solo en etapas de desarrollo  
  
// listen
app.listen(8080, () => {
    console.log('server correctly running at 8080')
})


