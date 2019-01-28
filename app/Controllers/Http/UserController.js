'use strict'

const User = use('App/Models/User')

class UserController {
  // usando a desestruturação para pegar o request, response ou poderiamos usar O ctx
  async store ({ request }) {
    // pega somente os campos que estamos interessados
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)

    // sempre vai retorno um JSON, pois no momento da criacao do Adonis definismos
    /// only WEBAPI, logo todo retorno será um JSON!
    return user
  }
}

module.exports = UserController
