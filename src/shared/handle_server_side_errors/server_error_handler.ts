import { Response } from 'express'

const ERR_500 = 'error de servidor, nuestra culpa'

export function throw500(res: Response) {
  return res.status(500).json({ message: ERR_500 })
}
