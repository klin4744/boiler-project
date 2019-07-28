import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

const initialState = {};
const reducer = (state = initialState, action) => {
   switch (action.type) {
      default:
         return { ...state };
   }
};
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
