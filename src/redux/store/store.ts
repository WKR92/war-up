import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import campaignReducer from "../reducers/campaignReducer";
import championsReducer from "../reducers/championsReducer";

const rootReducer = combineReducers({
  user: userReducer,
  campaigns: campaignReducer,
  champions: championsReducer,
});
export const store = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof rootReducer>;
