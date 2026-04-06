const nodemailer = require('nodemailer');

function getTransporter() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
    throw new Error('Mail no configurado: faltan MAIL_HOST/MAIL_PORT/MAIL_USER/MAIL_PASS');
  }

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: false, // false para puerto 587 (STARTTLS)
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
}

const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = getTransporter();
  const ttlMinutes = process.env.RESET_TOKEN_TTL_MINUTES || process.env.RESET_TOKEN_TTL || '15';

  const mailOptions = {
    from: `"Soporte" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
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
          Este enlace expirará en ${ttlMinutes} minuto(s).
        </p>
        <p style="color: #666;">
          Si no solicitaste este cambio, ignora este correo.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
