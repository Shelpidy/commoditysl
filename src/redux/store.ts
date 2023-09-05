import { combineReducers, createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers";
import thunk from "redux-thunk";

const mainReducer = combineReducers({ rootReducer });

// Create the store with the root reducer
const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;
