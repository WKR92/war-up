import { createAction, createReducer } from "@reduxjs/toolkit";
import { userAction, User } from "../../Models/Models";
import * as userActionTypes from "../actions/user/userActionTypes";

type UserReducer = User | Record<string, never>;

const initialState: User | Record<string, never> = {};
export default function userReducer(state = initialState, action: userAction) : UserReducer {
  switch (action.type) {
    case userActionTypes.USER_LOGGED_IN:
      return Object.assign({}, action.payload);
    case userActionTypes.USER_LOGGED_OUT:
      return {};
    default:
      return state;
  }
}
