import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  //   another: anotherReducer,
  // add more reducers as needed
});

export default rootReducer;
