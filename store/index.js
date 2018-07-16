export const actions = {
   async nuxtServerInit ({ commit }, { req }) {
    if (req.session.token) {
      await commit('user/SET_TOKEN', req.session.token)
    }
  }
}