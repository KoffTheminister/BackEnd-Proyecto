//librerias y modulos
import 'reflect-metadata'
import  express  from 'express'
import { orm, syncSchema } from './shared/db/orm.js'
import { guardiaRouter } from './guardiaDir/guardia.routes.js'
import { actividadRouter } from './actividadDir/actividad.routes.js'
import { RequestContext } from '@mikro-orm/core'
import { sentenciaRouter } from './sentenciaDir/sentencia.routes.js'

//misc
const app = express()
app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next) //em es el entity manager, una abstraccion que nos permitiria manejar a las entitdades desde un solo punto
})

//manejo de actividades
app.use('/api/actividades',actividadRouter)

//manejo de guardias
app.use('/api/guardias', guardiaRouter)

//manejo de sentencias
app.use('/api/sentencias', sentenciaRouter)

//url invalido
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
  })

await syncSchema()  // solo en etapas de desarrollo  
  
// listen
app.listen(8080, () => {
    console.log('server correctly running at 8080')
})
