import { Router } from "express";
import { verify, verify_special } from "./verify.controller.js"

export const verify_router = Router()

verify_router.get('/', verify)
verify_router.get('/especial', verify_special)


