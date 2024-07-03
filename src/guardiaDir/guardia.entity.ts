export class Guardia {
    static UltimoLegajo = 0

    constructor(
        nombre: string,
        apellido: string
    ){}
    legajo = Guardia.incrementarCodigo()

    static incrementarCodigo(){
        Guardia.UltimoLegajo += 1
        return Guardia.UltimoLegajo.toString()
    }
}
