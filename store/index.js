export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    console.log(req.session);
    if (req.session && req.session.token) {
      commit('user/SET_TOKEN', req.session.token)
    }
  }
}