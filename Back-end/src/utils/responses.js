module.exports = {

   success: (res, data = {}, message = "OK") =>
    res.status(200).json({
        success: true,
        message,
        ...data,   
        data
    }),
    created: (res, data = {}, message = "Creado correctamente") =>
        res.status(201).json({
            success: true,
            message,
            data
        }),
    badRequest: (res, message = "Solicitud inválida") =>
        res.status(400).json({
            success: false,
            error: message
        }),
    unauthorized: (res, message = "No autenticado") =>
        res.status(401).json({
            success: false,
            error: message
        }),
    forbidden: (res, message = "Sin permisos") =>
        res.status(403).json({
            success: false,
            error: message
        }),
    serverError: (res, message = "Error del servidor") =>
        res.status(500).json({
            success: false,
            error: message
        })
};