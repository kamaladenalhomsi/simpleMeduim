export const state = () => ({
  posts: null
});

export const getters = {
  GET_POSTS: state => state.posts
}

export const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  DELETE_POST(state, index) {
    state.posts.splice(index, 1);
  }
}

export const actions = {
  
}