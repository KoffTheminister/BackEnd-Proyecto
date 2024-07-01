export class Guardia {
    static UltimoLegajo = 0

    constructor(
        nombre: string,
        apellido: string,
        legajo: number
    ){}

    static incrementarCodigo(){
        this.legajo = 1
    }
}
