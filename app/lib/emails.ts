import { DelegationType } from "~/models/delegation.server"
import { UserType } from "~/models/user.server"

export const createUserEmail = (user: UserType) => {
  return `
    <p>Prezado(a) ${user.name}</p>
    <p>Seja bem-vindo(a) ao FAMUN 2024!</p>

    <p>Seu cadastro no sistema de inscrições foi realizado com sucesso!</p>

    <p>Para que sua INSCRIÇÃO na conferência seja concluída, você deve completar os seguintes passos:</p>

    <ol>
      <li>
        Se você é o Chefe de Delegação ou o Professor Orientador, você deve criar uma delegação de sua Escola/Universidade. Após criar a delegação, utilize o link criado ou o código da delegação para convidar os demais delegados a entrar na delegação. 
      </li>

      <li>
        Se você é um(a) delegado(a) de uma delegação já criada,  utilize o link criado ou o código da delegação para entrar na delegação. 
        <ul>
          <li>
            Instruções: para usar o link, basta clicar e entrar na delegação; para usar o código, faça o login no sistema de inscrições, vá até o menu “Entrar na delegação” e insira o código.
          </li>
        </ul>
      </li>

      <li>
        <b>Se você já entrou em uma delegação, realize o pagamento das taxas de inscrição conforme indicado no sistema. ATENÇÃO: Sua inscrição apenas será confirmada após a confirmação do pagamento.</b>
      </li>
    </ol>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, entre em contato por email: famun@facamp.com.br <br/> Este é um e-mail automático. Por favor, não responda.</p>

    <p>Atenciosamente, </p>

    <p>Equipe Organizadora do FAMUN 2024</p>
  `
}

export const manualCreateUserEmail = (creatorName: string, delegationSchool: string, user: UserType, password: string, url: string) => {
  return `
    <p>Prezado(a) ${user.name}</p>
    <p>Seja bem-vindo(a) ao FAMUN 2024!</p>
    
    <p>A sua inscrição para a FAMUN 2024 foi registrada com sucesso!</p>

    <p>Sua conta foi criada pelo(a) ${creatorName} e você está participando junto com o(a) ${delegationSchool}. </p>

    <p>Para acessar o sistema de inscrição acesse o link: ${url}/login e use a senha: ${password}</p>

    <p>É recomendado que você atualize a sua senha através do link: ${url}/password/request.</p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, entre em contato por email: famun@facamp.com.br <br/> Este é um e-mail automático. Por favor, não responda.</p>

    <p>Atenciosamente, </p>

    <p>Equipe Organizadora do FAMUN 2024</p>
  `
}

export const createDelegationEmail = (delegation: DelegationType, user: UserType) => {
  return `
    <p>Prezado(a) ${user.name}, </p>

    <p>Sua delegação no sistema de inscrição do FAMUN 2024 foi criada com sucesso!</p>

    <p>Detalhes da Delegação: </p>

    <p>Nome: ${delegation.school} <br/>
    Data de Criação: ${delegation.createdAt?.toLocaleDateString("pt-BR")} </p>

    <p>Como chefe de delegação, você deve convidar outros participantes para entrar em sua delegação. Para facilitar este processo, fornecemos duas opções: </p>

    <p>Convite dos Participantes <br/> 
    Utilize o link a seguir para convidar participantes: <br/> ${delegation.inviteLink} </p>
    <p>
      Ou compartilhe com os participantes o Código de Delegação: ${delegation.code}.
      Para usar o código, faça o login no sistema de inscrições, vá até o menu “Entrar na delegação” e insira o código. 
    </p>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, entre em contato por email: famun@facamp.com.br <br/> Este é um e-mail automático. Por favor, não responda.</p>

    <p>Atenciosamente, </p>

    <p>Equipe Organizadora do FAMUN 2024</p>
  `
}

export const paymentCompletedEmail = (user: UserType, paidUsers: UserType[], receiptUrl: string, date: string) => {
  return `
    <p>Prezado(a) ${user.name}, </p>

    <p>O pagamento de sua inscrição no FAMUN 2024 foi processado com sucesso!</p>

    <p>Detalhes do Pagamento</p>

    <p>Recibo: ${receiptUrl} <br/>
    Data do pagamento: ${date} </p>

    <p>O pagamento foi realizado para a inscrição destes participantes:</p>
    <ol>  
  ${paidUsers.map((item, index) => (
    `<li> ${item.name} </li>`
  ))}
    </ol>

    <h2>Suporte </h2>

    <p>Em caso de dúvidas, entre em contato por email: famun@facamp.com.br <br/> Este é um e-mail automático. Por favor, não responda.</p>

    <p>Atenciosamente, </p>

    <p>Equipe Organizadora do FAMUN 2024</p>
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

    <p>Em caso de dúvidas, entre em contato por email: famun@facamp.com.br <br/> Este é um e-mail automático. Por favor, não responda.</p>

    <p>Atenciosamente, </p>

    <p>Equipe Organizadora do FAMUN 2024</p>
  `
}