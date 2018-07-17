export const state = () => ({
  token: null,
  name: null,
  username: null,
  id: null
})

export const getters = {
  GET_TOKEN: state => state.token,
  GET_NAME: state => state.name,
  GET_USERNAME: state => state.username,
  GET_ID: state => state.id
}

export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_NAME (state, name) {
    state.name = name
  },
  SET_USERNAME (state, username) {
    state.username = username 
  },
  SET_ID (state, id) {
    state.id = id
  }
}
