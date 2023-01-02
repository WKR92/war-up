import * as championsActionTypes from "../actions/champion/championsActionTypes";





















import { Champion, championAction } from "../../Models/Models";

type ChampionsReducer = Champion[];

const initialState: ChampionsReducer = [];
export default function championsReducer(
  state = initialState,
  action: championAction
): ChampionsReducer {
  switch (action.type) {
    case championsActionTypes.CHAMPIONS_DOWNLOADED:
      return action.payload;
    case championsActionTypes.CHANGE_CHAMPION_STAT: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      if (newState[index].exp < 100) return [...newState];

      const add = newState[index].add;
      const atr = action.payload.stat as keyof typeof add;
      const statsIncreasedBy5 = ['WW', 'US', 'K', 'ODP', 'ZR', 'INT', 'SW', 'OGL'];
      console.log(action.payload.stat)
      if (statsIncreasedBy5.includes(action.payload.stat.toUpperCase())) add[atr] = add[atr] + 5;
      if (!statsIncreasedBy5.includes(action.payload.stat.toUpperCase())) add[atr] = add[atr] + 1;
      newState[index].exp = newState[index].exp - 100;
      return [...newState];
    }
    case championsActionTypes.REMOVE_ITEM: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      const array = newState[index][
        action.payload.arrayName as keyof typeof championToChange[0]
      ] as string[];
      const indexOfItemToRemove = array.indexOf(action.payload.arrayItem);
      array.splice(indexOfItemToRemove, 1);

      return [...newState];
    }
    case championsActionTypes.ADD_ITEM: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      const array = newState[index][
        action.payload.arrayName as keyof typeof championToChange[0]
      ] as string[];
      array.push(action.payload.arrayItem);

      if (action.payload.arrayName !== "inventory")
        newState[index].exp = newState[index].exp - 100;

      return [...newState];
    }
    case championsActionTypes.CHANGE_MONEY: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      if (action.payload.operation === "add")
        newState[index].money = parseInt(newState[index].money.toString()) + 1;
      if (action.payload.operation === "sub") {
        if (newState[index].money === 0) return [...newState];
        newState[index].money = newState[index].money - 1;
      }
      return [...newState];
    }
    case championsActionTypes.CHANGE_LIFE: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      if (action.payload.operation === "add")
        newState[index].actualLife = parseInt(newState[index].actualLife.toString()) + 1;
      if (action.payload.operation === "sub") {
        if (newState[index].actualLife === 0) return [...newState];
        newState[index].actualLife = newState[index].actualLife - 1;
      }
      return [...newState];
    }
    case championsActionTypes.ADD_SKILL: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      const newSkill = { skill: 0 };
      const skills = newState[index].skills;
      const listOfSkills = Object.keys(skills);
      if (listOfSkills.includes(action.payload.skill)) return [...newState];

      newState[index].skills = Object.assign(newState[index].skills, newSkill);
      const newSkillName = action.payload.skill as keyof typeof skills;
      skills[newSkillName as keyof typeof skills] =
        newState[index].skills["skill" as keyof typeof skills];
      delete newState[index].skills["skill" as keyof typeof skills];
      newState[index].exp = newState[index].exp - 100;
      return [...newState];
    }
    case championsActionTypes.IMPROVE_SKILL: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.user === action.payload.champUser
      );
      const index = newState.indexOf(championToChange[0]);
      const skills = newState[index].skills;
      const listOfSkills = Object.keys(skills);
      if (!listOfSkills.includes(action.payload.skill)) return [...newState];

      const skill = action.payload.skill as keyof typeof skills;
      if (skills[skill] === 30) return [...newState];

      skills[skill] = skills[skill] + 10;
      newState[index].exp = newState[index].exp - 100;
      return [...newState];
    }
    case championsActionTypes.CHAMPION_DELETED: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => champion.id === action.payload.champId
      );
      const index = newState.indexOf(championToChange[0]);
      newState.splice(index, 1);
      return [...newState];
    }
    case championsActionTypes.CHANGE_IMAGE: {
      const newState: Champion[] = JSON.parse(JSON.stringify(state));
      const championToChange = newState.filter(
        (champion: Champion) => { 
          console.log('champion.id', champion.id)
          console.log('action.payload.champId', action.payload.champId)
          return champion.id === action.payload.champId}
      );
      const index = newState.indexOf(championToChange[0]);
      newState[index].img = action.payload.image;
      return [...newState];
    }
    default:
      return state;
  }
}
