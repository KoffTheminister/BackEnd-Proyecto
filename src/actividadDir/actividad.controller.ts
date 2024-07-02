import { Request, Response, NextFunction } from "express"

function sanitizeActInput(req: Request, res: Response, next: NextFunction){

    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}