'use strict'

class SessionController {
  // via desestruturação, vamos pegar as 3 variveis
  async store ({ request, response, auth }) {
    // cria e seta o valor das variaveis do request
    const { email, password } = request.all()

    // gera o token
    const token = await auth.attempt(email, password)

    return token
  }
}

module.exports = SessionController
