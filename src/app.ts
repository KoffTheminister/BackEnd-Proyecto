//librerias y modulos
import express from 'express'
import { guardiaRouter } from './guardiaDir/guardia.routes.js'
import { actividadRouter } from './actividadDir/actividad.routes.js'

//misc
const app = express()
app.use(express.json())


//manejo de actividades
app.use('/api/actividades',actividadRouter)

//manejo de guardias
app.use('/api/guardias', guardiaRouter)

//url invalido
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
  })
  
//el listen
app.listen(8080, () => {
    console.log('server correctly running at 8080')
})
