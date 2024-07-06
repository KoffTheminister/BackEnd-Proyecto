function sanitizeActInput(req, res, next) {
}
Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
    }
});
next();
export {};
//# sourceMappingURL=actividad.controller.js.map