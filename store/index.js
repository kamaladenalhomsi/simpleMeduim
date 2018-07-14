export const actions = {
   async nuxtServerInit ({ commit }, { req }) {
    if (req.session.token) {
      //console.log("WORK FORM NUXTSErverInit");
      await commit('user/SET_TOKEN', req.session.token)
    }
  }
}