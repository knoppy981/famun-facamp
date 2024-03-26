import nodeMailer from "nodemailer"

export const sendEmail = async ({
  to,
  subject,
  html,
} : {
  [key: string]: string
}) => {
  const transporter = nodeMailer.createTransport({
    service: "Outlook365",
    host: 'smtp.office365.com',
    port: 587,
    secure: true,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: 'famun@facamp.com.br',
      pass: process.env.EMAIL_PASSWORD,
    }
  })

  const info = await transporter.sendMail({
    from: 'Equipe FAMUN <famun@facamp.com.br>',
    to,
    subject,
    html,
  })

  // console.log('Email sent with id: ' + info.messageId)

  return info
}