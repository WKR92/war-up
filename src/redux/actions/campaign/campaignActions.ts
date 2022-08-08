import { CAMPAIGNS_DOWNLOADED, ADD_CAMPAIGN, DELETE_CAMPAIGN } from './campaignActionTypes';
import { Campaign } from '../../../Models/Models';

export const campaignsDownloaded = (campaigns: Campaign[]) => {
  return {
    type: CAMPAIGNS_DOWNLOADED,
    payload: campaigns
  }
}

export const addCampaign = (campaign: Campaign) => {
  return {
    type: ADD_CAMPAIGN,
    payload: campaign
  }
}

export const deleteCampaign = (campaign: Campaign) => {
  return {
    type: DELETE_CAMPAIGN,
    payload: campaign
  }
}
