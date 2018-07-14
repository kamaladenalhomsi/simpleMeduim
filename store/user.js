export const state = () => ({
  token: null
})

export const getters = {
  GET_TOKEN: state => state.token
}

export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  }
}
