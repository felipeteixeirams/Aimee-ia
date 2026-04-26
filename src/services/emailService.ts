import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from '../lib/logger.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { 
      messageId: info.messageId, 
      recipient: mailOptions.to,
      subject: mailOptions.subject
    });
    return info;
  } catch (error: any) {
    logger.error('Failed to send email', { 
      error: error.message, 
      recipient: mailOptions.to,
      subject: mailOptions.subject
    });
    throw error;
  }
}

const APP_URL = process.env.APP_URL || 'https://aimee.vercel.app';

const styles = `
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const headerStyle = `
  font-size: 24px;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 20px;
`;

const footerStyle = `
  font-size: 14px;
  color: #6b7280;
  margin-top: 40px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
`;

export async function sendRegistrationRequestEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: '"Aimee" <' + process.env.SMTP_USER + '>',
    to: userEmail,
    subject: 'Solicitação de Registro Recebida 💌',
    html: `
      <div style="${styles}">
        <h1 style="${headerStyle}">Olá, ${userName}! ✨</h1>
        <p>Recebi sua solicitação para fazer parte da nossa jornada inteligente!</p>
        <p>Sou a <strong>Aimee</strong>, e estou muito ansiosa para te ajudar a organizar sua vida financeira, casa e agenda de um jeito leve e proativo.</p>
        <p>Agora, sua solicitação foi encaminhada para aprovação do administrador do sistema. Assim que tudo for revisado, eu te envio outro e-mail com as boas-vindas oficiais.</p>
        <p>Seja paciente, logo logo estaremos conversando!</p>
        <div style="${footerStyle}">
          Com carinho,<br>
          <strong>Aimee - Seu Agente Pessoal</strong>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
}

export async function sendApprovalEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: '"Aimee" <' + process.env.SMTP_USER + '>',
    to: userEmail,
    subject: 'Boas-vindas à Aimee! 🚀',
    html: `
      <div style="${styles}">
        <h1 style="${headerStyle}">Seja bem-vindo(a), ${userName}! 🎉</h1>
        <p>Tenho uma ótima notícia: sua solicitação foi <strong>aprovada</strong> pela nossa equipe!</p>
        <p>Agora você já pode acessar todo o potencial da Aimee para gerir seu mundo.</p>
        <div style="margin: 30px 0;">
          <a href="${APP_URL}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Começar agora</a>
        </div>
        <p>Espero por você no chat!</p>
        <div style="${footerStyle}">
          Com carinho,<br>
          <strong>Aimee - Seu Agente Pessoal</strong>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
}

export async function sendRejectionEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: '"Aimee" <' + process.env.SMTP_USER + '>',
    to: userEmail,
    subject: 'Sobre sua solicitação de acesso 📋',
    html: `
      <div style="${styles}">
        <h1 style="${headerStyle}">Olá, ${userName}</h1>
        <p>Analisamos sua solicitação e, no momento, ela não pôde ser aprovada.</p>
        <p>Geralmente isso acontece quando os dados estão incompletos ou não conseguimos verificar a identidade.</p>
        <p>Mas não se preocupe! Você pode tentar novamente a qualquer momento, garantindo que todas as informações estejam corretas e reais.</p>
        <div style="margin: 30px 0;">
          <a href="${APP_URL}" style="color: #4f46e5; font-weight: 600;">Tentar registro novamente</a>
        </div>
        <div style="${footerStyle}">
          Atenciosamente,<br>
          <strong>Aimee - Seu Agente Pessoal</strong>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
}

export async function sendBlockedEmail(userEmail: string, userName: string, days: number) {
  const mailOptions = {
    from: '"Aimee" <' + process.env.SMTP_USER + '>',
    to: userEmail,
    subject: 'Status da sua conta 🔒',
    html: `
      <div style="${styles}">
        <h1 style="${headerStyle}">Olá, ${userName}</h1>
        <p>Sentimos informar, mas sua solicitação de registro foi recusada e seu acesso foi temporariamente suspenso.</p>
        <p>Você poderá tentar uma nova solicitação em <strong>${days} dias</strong>.</p>
        <p>Agradecemos a compreensão.</p>
        <div style="${footerStyle}">
          Atenciosamente,<br>
          <strong>Aimee - Equipe de Segurança</strong>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
}
