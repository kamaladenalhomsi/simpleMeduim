export const state = () => ({
  post: null
});

export const getters = {
  GET_POST: state => state.post
}

export const mutations = {
  SET_POST(state, post) {
    state.post = post
  }
}
