import request from "supertest";
import { Recluso } from "./recluso.entity.js";

const url_base = "http://localhost:8080"

describe("crud de recluso", () => {
    
    let token: string
    
    beforeAll(async () => {
        const res = await request(url_base).post("/administradores/logIn").send({ cod_administrador: 8, contrasenia: "123r"})
        token = res.body.token
    });

    it("no deberia crear un recluso porque el recluso ingresado tiene una condena activa", async () => {

        let nuevo_recluso = {
            nombre: "Juan",
            apellido: "Bodoque",
            dni: 311,
            fecha_nac: "2004-06-10"
        }

        const mock_condena_activa = jest.fn().mockReturnValue(true);
        jest.spyOn(Recluso.prototype, "tiene_condena_activa").mockImplementation(mock_condena_activa);

        const response = await request(url_base).post('/reclusos').send(nuevo_recluso).set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(409);

        jest.restoreAllMocks();
    })
})

