'use strict'

// Crypoto
const crypto = require('crypto')
// user
const User = use('App/Models/User')
// email
const Mail = use('Mail')
//
const moment = require('moment')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      // para 1 campo somente podemos utilizar o INPUT
      const email = request.input('email')
      // pego o usuario no banco com o email informado
      const user = await User.findByOrFail('email', email)

      // para gerar um token vamos usar a Crypto que já vem na versao 10+ do Node
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'], // tempalte
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        }, // variaveis
        message => {
          message
            .to(user.email)
            .from('jose@jose.com', 'Jose')
            .subject('Recuperação de Senha')
        }
      )

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: 'Algo não deu certo, este email existe ?',
          detail: error.message
        }
      })
    }
  }

  async update ({ request, response }) {
    try {
      // pega as variaves do corpo da requisicao
      const { token, password } = request.all()
      // procura o usuario
      const user = await User.findByOrFail('token', token)
      // verifica se o token não esta exipirado
      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      // se o token esta expriado retornamos msg de erro
      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Token Expirado',
            detail: 'Token Expirado'
          }
        })
      }

      // altera o usuario para nao ter mais token
      user.token = null
      user.token_created_at = null
      // seta a nova senha
      user.password = password

      // salva o usuario no banco
      await user.save()

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: 'Algo não deu certo',
          detail: error.message
        }
      })
    }
  }
}

module.exports = ForgotPasswordController
