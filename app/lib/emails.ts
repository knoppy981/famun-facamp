import { DelegationType } from "~/models/delegation.server"
import { UserType } from "~/models/user.server"

export const createUserEmail = (user: UserType) => {
  return `
    <h1 style="color: #183567;">Famun 2024</h1>

    <p>Obrigado ${user.name}, por se inscrever na FAMUN!</p>

    <p>Sua inscrição foi registrada com sucesso! </p>

    <p>Para continuar com a sua inscrição entre na delegação da sua Escola / Universidade, para facilitar este processo, fornecemos duas opções: </p>

    <p>Utilizar um link ou o código da delegação os quais sua Escola / Universidade te enviaram</p>

    <h2>Instruções </h2>
    <p>Para usar o link: Acesse o link e entre na delegação </p>
    <p>Para usar o código: Na seção 'Entrar na Delegação' dentro do sistema, a qual aparece após a criação da conta, insira o código</p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, acesse nossa Central de Ajuda ou entre em contato pelo suporte. <br/> Este é um e-mail automático. Por favor, não responda. </p>

    <p>Atenciosamente, </p>
    <p>Equipe do Sistema Famun</p>
  `
}

export const manualCreateUserEmail = (creatorName: string, delegationSchool: string, user: UserType, password: string, url: string) => {
  return `
    <h1 style="color: #183567;">Famun 2024</h1>

    <h2>Olá ${user.name} </h2>
    
    <p>a sua inscrição para a FAMUN 2024 foi registrada com sucesso!</p>

    <p>Sua conta foi criada pelo(a) ${creatorName} e você está participando junto com o(a) ${delegationSchool}. </p>

    <p>Para acessar o sistema de inscrição acesse o link: ${url}/login e use a senha: ${password}</p>

    <p>É recomendado que você atualize a sua senha através do link: ${url}/password/request.</p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, acesse nossa Central de Ajuda ou entre em contato pelo suporte. <br/> Este é um e-mail automático. Por favor, não responda. </p>

    <p>Atenciosamente, </p>
    <p>Equipe do Sistema Famun</p>
  `
}

export const createDelegationEmail = (delegation: DelegationType, user: UserType) => {
  return `
    <h1 style="color: #183567;">Famun 2024</h1>

    <p>Prezado(a) ${user.name}, </p>

    <p>Sua delegação no sistema foi criada com sucesso. </p>

    <p>Detalhes da Delegação: </p>

    <p>Nome: ${delegation.school} <br/>
    Data de Criação: ${delegation.createdAt?.toLocaleDateString("pt-BR")} </p>

    <p>Como líder desta delegação, você pode convidar outros participantes para se juntarem a você. Para facilitar este processo, fornecemos duas opções: </p>

    <h2>Convite dos Participantes <h2/>
    <p>Utilize o link a seguir para convidar participantes: <br/> ${delegation.inviteLink} </p>
    <p>Ou compartilhe o Código de Delegação: ${delegation.code} </p>

    <h2>Instruções </h2>
    <p>Para usar o link: Encaminhe o link aos participantes desejados. </p>
    <p>Para usar o código: Informe aos participantes para inserir o código na seção 'Entrar na Delegação' no sistema que aparece após a criar a conta.</p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, acesse nossa Central de Ajuda ou entre em contato pelo suporte. <br/> Este é um e-mail automático. Por favor, não responda. </p>

    <p>Atenciosamente, </p>
    <p>Equipe do Sistema Famun</p>
  `
}

export const paymentCompletedEmail = (user: UserType, paidUsers: UserType[], receiptUrl: string, date: string) => {
  return `
    <h1 style="color: #183567;">Famun 2024</h1>

    <p>Prezado(a) ${user.name}, </p>

    <p>Sua pagamento foi processado no sistema com sucesso. </p>

    <p>Detalhes do Pagamento: </p>

    <p>Recibo: ${receiptUrl} <br/>
    Data do pagamento: ${date} </p>

    <p>O pagamento foi realizado para a inscrição destes participantes:</p>
    <ol>  
  ${paidUsers.map((item, index) => (
    `<li> ${item.name} </li>`
  ))}
    </ol>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, acesse nossa Central de Ajuda ou entre em contato pelo suporte. <br/> Este é um e-mail automático. Por favor, não responda. </p>

    <p>Atenciosamente, </p>
    <p>Equipe do Sistema Famun</p>
  `
}

export const requestPasswordReset = (user: UserType, code: string) => {
  return `
    <h1 style="color: #183567;">Famun 2024</h1>

    <h2>Olá, ${user.name}.</h2>

    <p>Insira este código para concluir a redefinição </p>

    <h2>${code}</h2>

    <p>Se você não solicitou este código, recomendamos que altere sua senha do sistema de inscrição FAMUN.</p>

    <p>Ná pagina de login > Esqueceu a senha > Altere a senha</p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, acesse nossa Central de Ajuda ou entre em contato pelo suporte. <br/> Este é um e-mail automático. Por favor, não responda. </p>

    <p>Atenciosamente, </p>
    <p>Equipe do Sistema Famun</p>
  `
}