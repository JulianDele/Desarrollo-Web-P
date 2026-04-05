const nodemailer = require('nodemailer');

// Configuración del transporter con las variables del .env
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // false para puerto 587 (TLS)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Función para enviar el correo de recuperación
const sendResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
        from: `"Soporte" <${process.env.MAIL_FROM}>`,
        to: toEmail,
        subject: 'Recuperación de contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Recuperación de contraseña</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz click en el siguiente botón para continuar:</p>
                <a href="${resetLink}" 
                   style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; display: inline-block;">
                    Restablecer contraseña
                </a>
                <p style="color: #666; margin-top: 20px;">
                    Este enlace expirará en ${process.env.RESET_TOKEN_TTL || '15m'}.
                </p>
                <p style="color: #666;">
                    Si no solicitaste este cambio, ignora este correo.
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail }; 