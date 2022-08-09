import {
  CHAMPIONS_DOWNLOADED,
  CHANGE_CHAMPION_STAT,
  REMOVE_ITEM,
  ADD_ITEM,
  CHANGE_MONEY,
  ADD_SKILL,
  IMPROVE_SKILL,
  CHAMPION_DELETED,
  CHANGE_IMAGE
} from "./championsActionTypes";
import { Champion } from "../../../Models/Models";

export const championsDownloaded = (champions: Champion[]) => {
  return {
    type: CHAMPIONS_DOWNLOADED,
    payload: champions,
  };
};

export const championDeleted = (champId: string) => {
  return {
    type: CHAMPION_DELETED,
    payload: champId
  };
};

export const changeChampionStat = (stat: string, champUser: string) => {
  return {
    type: CHANGE_CHAMPION_STAT,
    payload: { stat, champUser },
  };
};

export const removeItem = (
  champUser: string,
  arrayName: string,
  arrayItem: string
) => {
  return {
    type: REMOVE_ITEM,
    payload: { champUser, arrayName, arrayItem },
  };
};

export const addItem = (
  champUser: string,
  arrayName: string,
  arrayItem: string
) => {
  return {
    type: ADD_ITEM,
    payload: { champUser, arrayName, arrayItem },
  };
};

export const changeMoney = (champUser: string, operation: string) => {
  return {
    type: CHANGE_MONEY,
    payload: { champUser, operation },
  };
};

export const addSkill = (champUser: string, skill: string) => {
  return {
    type: ADD_SKILL,
    payload: { champUser, skill },
  };
};

export const improveSkill = (champUser: string, skill: string) => {
  return {
    type: IMPROVE_SKILL,
    payload: { champUser, skill },
  };
};

export const changeImage = (champId: string, image: string) => {
  return {
    type: CHANGE_IMAGE,
    payload: { champId, image },
  };
};
