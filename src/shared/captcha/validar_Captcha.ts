import { Request, Response, NextFunction } from 'express';
import { RECAPTCHA_SECRET_KEY } from './configcaptcha.js';

export async function validar_Captcha(req: Request, res: Response, next: NextFunction) {
    try {
        const captchaToken = req.body.captcha;
        if (!captchaToken) {
            return res.status(400).json({ message: 'Captcha token is missing' });
        }

        const params = new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY || '',
            response: captchaToken,
        })

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: params,
        })

        const data = await response.json()

        if(data.success){
            next()
        } else {
            return res.status(400).json({ message: 'Invalid Captcha', errorCodes: data['error-codes'] })
        }
    } catch (error: any) {
        console.error('reCAPTCHA validation error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}



