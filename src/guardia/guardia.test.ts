import request from "supertest";
import { Guardia } from "./guardia.entity.js";

const url_base = "http://localhost:8080"

describe("crud de guardia", () => {
    
    let token: string
    
    beforeAll(async () => {
        const res = await request(url_base).post("/administradores/logIn").send({ cod_administrador: 8, contrasenia: "123r"})
        token = res.body.token
    });

    it("no deberia crear un guardia, porque el guardia ingresado se encuentra con contrato activo", async () => {

        let nuevo_guardia = {
            nombre: "Juan",
            apellido: "Bodoque",
            dni: 424242
        }

        const mock_activo = jest.fn().mockReturnValue(true);
        jest.spyOn(Guardia.prototype, "esta_activo").mockImplementation(mock_activo);

        const response = await request(url_base).post('/guardias').send(nuevo_guardia).set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(409);

        jest.restoreAllMocks();
    })
})

