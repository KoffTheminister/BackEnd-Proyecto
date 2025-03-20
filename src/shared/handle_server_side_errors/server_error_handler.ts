import { Response } from 'express'

const ERR_500 = 'error'

export function server_error_handler(res: Response, err: any) {
    if (err.code) {
      switch (err.code) {
        case "ER_DUP_ENTRY":
          // Ocurre cuando el usuario quiere crear un objeto con un atributo duplicado en una tabla marcada como Unique
          res.status(400).json({message: `A studio with that name/site already exists.`})
          break
        case "ER_DATA_TOO_LONG":
          res.status(400).json({message: `Data too long.`})
          break
      }
    }
    else {
      switch (err.name) {
        case "NotFoundError":
          res.status(404).json({message: `Studio not found for ID ${res.locals.id}`})
          break
        default:
          console.error("\n--- ORM ERROR ---")
          console.error(err.message)
          res.status(500).json({message: "Oops! Something went wrong. This is our fault."})
          break
      }
    }
  }

function throw500(res: Response, err: any) {
   res.status(500).json({ message: ERR_500 })
}
