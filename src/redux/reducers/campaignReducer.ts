import { createAction, createReducer } from "@reduxjs/toolkit";
import { Campaign } from "../../Models/Models";
import * as campaignActionTypes from "../actions/campaign/campaignActionTypes";

type CampaignReducer = Campaign[] | []

const initialState: Campaign[] | [] = [];
export default function campaignReducer(
  state = initialState,
  action: any
): CampaignReducer {
  switch (action.type) {
    case campaignActionTypes.CAMPAIGNS_DOWNLOADED:
      return action.payload;
    case campaignActionTypes.ADD_CAMPAIGN:
      return Object.assign({}, action.payload);
    case campaignActionTypes.DELETE_CAMPAIGN:
      return Object.assign({}, action.payload);
    default:
      return state;
  }
}
