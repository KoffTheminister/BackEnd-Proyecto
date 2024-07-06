//import crypto from 'node:crypto'

export class Actividad{
    static UltimoId = 0
    constructor(
        public descripcion : string, 
        public diaSemana : number, 
        public horaMinutoComienzo : string,
        public horaMinutoFin : string,
        public locacion : string,
        public _id = Actividad.incrementarCodigo()
    ){}
    idsDeReclusos = []

    static incrementarCodigo(){
        Actividad.UltimoId += 1
        return Actividad.UltimoId.toString()
    }

}
