export default function({ context, store, redirect }) {
  if(store.getters['user/GET_TOKEN'] === null) {
    return redirect('/signUp');
  }
}