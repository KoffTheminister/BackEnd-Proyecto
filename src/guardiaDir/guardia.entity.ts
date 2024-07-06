import { ObjectId } from "mongodb"

export class Guardia {
    static UltimoLegajo = 0

    constructor(
        public nombre: string,
        public apellido: string,
        public _id = Guardia.incrementarCodigo()
    ){}
    
    static incrementarCodigo(){
        Guardia.UltimoLegajo += 1
        return Guardia.UltimoLegajo.toString()
    }
}
