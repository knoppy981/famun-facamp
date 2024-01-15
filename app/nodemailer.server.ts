import nodeMailer from "nodemailer"

export const sendEmail = async ({
  to,
  subject,
  html,
} : {
  [key: string]: string
}) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'andre.knopp8@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    }
  })

  const info = await transporter.sendMail({
    from: 'Equipe FAMUN <andre.knopp8@gmail.com>',
    to,
    subject,
    html,
  })

  console.log('Email sent with id: ' + info.messageId)

  return info
}