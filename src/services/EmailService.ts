import "reflect-metadata";
import nodemailer from 'nodemailer';
import { singleton } from 'tsyringe';
import { logger } from '../lib/logger.js';
import { config } from '../lib/config.js';

@singleton()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly APP_URL = config.appUrl;

  private readonly styles = `
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  private readonly headerStyle = `
    font-size: 24px;
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 20px;
  `;

  private readonly footerStyle = `
    font-size: 14px;
    color: #6b7280;
    margin-top: 40px;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  `;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  private async sendEmail(mailOptions: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
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

  async sendRegistrationRequestEmail(userEmail: string, userName: string) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: 'Solicitação de Registro Recebida 💌',
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Olá, ${userName}! ✨</h1>
          <p>Recebi sua solicitação para fazer parte da nossa jornada inteligente!</p>
          <p>Sou a <strong>Aimee</strong>, e estou muito ansiosa para te ajudar a organizar sua vida financeira, casa e agenda de um jeito leve e proativo.</p>
          <p>Agora, sua solicitação foi encaminhada para aprovação do administrador do sistema. Assim que tudo for revisado, eu te envio outro e-mail com as boas-vindas oficiais.</p>
          <p>Seja paciente, logo logo estaremos conversando!</p>
          <div style="${this.footerStyle}">
            Com carinho,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendApprovalEmail(userEmail: string, userName: string) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: 'Boas-vindas à Aimee! 🚀',
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Seja bem-vindo(a), ${userName}! 🎉</h1>
          <p>Tenho uma ótima notícia: sua solicitação foi <strong>aprovada</strong> pela nossa equipe!</p>
          <p>Agora você já pode acessar todo o potencial da Aimee para gerir seu mundo.</p>
          <div style="margin: 30px 0;">
            <a href="${this.APP_URL}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Começar agora</a>
          </div>
          <p>Espero por você no chat!</p>
          <div style="${this.footerStyle}">
            Com carinho,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendRejectionEmail(userEmail: string, userName: string) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: 'Sobre sua solicitação de acesso 📋',
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Olá, ${userName}</h1>
          <p>Analisamos sua solicitação e, no momento, ela não pôde ser aprovada.</p>
          <p>Geralmente isso acontece quando os dados estão incompletos ou não conseguimos verificar a identidade.</p>
          <p>Mas não se preocupe! Você pode tentar novamente a qualquer momento, garantindo que todas as informações estejam corretas e reais.</p>
          <div style="margin: 30px 0;">
            <a href="${this.APP_URL}" style="color: #4f46e5; font-weight: 600;">Tentar registro novamente</a>
          </div>
          <div style="${this.footerStyle}">
            Atenciosamente,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendSupportEmail(userEmail: string, message: string) {
    const adminEmail = config.email.adminEmail || 'felipeteixeirams@gmail.com';
    const mailOptions = {
      from: `"Aimee Support" <${config.email.user}>`,
      to: adminEmail,
      subject: `🚨 ALERTA DE SISTEMA: Mensagem de Suporte de ${userEmail}`,
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Nova Mensagem de Suporte 🆘</h1>
          <p>O sistema detectou um problema de dependência crítica ou um usuário solicitou suporte através do fluxo de indisponibilidade.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; font-weight: 600; color: #374151;">Mensagem:</p>
            <p style="margin: 10px 0 0 0; font-size: 16px;">"${message}"</p>
          </div>
          <p><strong>Usuário:</strong> ${userEmail}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <div style="${this.footerStyle}">
            Este e-mail foi gerado automaticamente pelo núcleo de resiliência da Aimee.
          </div>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendBlockedEmail(userEmail: string, userName: string, days: number) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: 'Status da sua conta 🔒',
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Olá, ${userName}</h1>
          <p>Sentimos informar, mas sua solicitação de registro foi recusada e seu acesso foi temporariamente suspenso.</p>
          <p>Você poderá tentar uma nova solicitação em <strong>${days} dias</strong>.</p>
          <p>Agradecemos a compreensão.</p>
          <div style="${this.footerStyle}">
            Atenciosamente,<br>
            <strong>Aimee - Equipe de Segurança</strong>
          </div>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }
}
