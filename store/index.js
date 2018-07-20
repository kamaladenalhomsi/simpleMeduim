export const actions = {
   async nuxtServerInit ({ commit }, { req }) {
    if (req.session.token) {
      await commit('user/SET_TOKEN', req.session.token);
      await commit('user/SET_NAME', req.session.name);
      await commit('user/SET_USERNAME', req.session.username);
      await commit('user/SET_ID', req.session.myId);
    }
  }
}