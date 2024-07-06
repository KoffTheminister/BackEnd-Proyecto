export class Guardia {
    constructor(nombre, apellido) {
        this.legajo = Guardia.incrementarCodigo();
    }
    static incrementarCodigo() {
        Guardia.UltimoLegajo += 1;
        return Guardia.UltimoLegajo.toString();
    }
}
Guardia.UltimoLegajo = 0;
//# sourceMappingURL=guardia.entity.js.map