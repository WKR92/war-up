import { ReactNode } from "react";

export interface User {
  email: string | null;
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
}

export type userAction = {
  type: string;
  payload: User | null;
};

export type championAction =
  | { type: "CHAMPIONS_DOWNLOADED"; payload: Champion[] }
  | {
      type: "CHANGE_CHAMPION_STAT";
      payload: { stat: string; champUser: string };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { champUser: string; arrayName: string; arrayItem: string };
    }
  | {
      type: "ADD_ITEM";
      payload: { champUser: string; arrayName: string; arrayItem: string };
    }
  | {
      type: "CHANGE_MONEY";
      payload: { champUser: string; operation: string, money: number };
    }
    | {
      type: "CHANGE_LIFE";
      payload: { champUser: string; operation: string };
    }
  | {
      type: "ADD_SKILL";
      payload: { champUser: string; skill: string };
    }
  | {
      type: "IMPROVE_SKILL";
      payload: { champUser: string; skill: string };
    }
  | {
      type: "CHAMPION_DELETED";
      payload: { champId: string };
    }
  | {
      type: "CHANGE_IMAGE";
      payload: { champId: string; image: string };
    };

export interface Campaign {
  name: string;
  players: string[];
  id: string;
}

export interface Campaigns {
  campaigns: Campaign[];
}

export interface OldChampion {
  user: string;
  base: Stats;
  add: Stats;
  exp: number;
  inventory: string[];
  name: string;
  img: string;
  money: number;
  abilities: string[];
  skills: any[];
  id: string;
  actualLife: number;
}

export interface Champion {
  user: string;
  base: Stats;
  add: Stats;
  exp: number;
  inventory: string[];
  name: string;
  img: string;
  money: number;
  abilities: string[];
  skills: any[];
  id: string;
  actualLife: number;
  stats: NewStats
}

export interface NewStats {
  WW: number;
  US: number;
  K: number;
  ODP: number;
  ZR: number;
  INT: number;
  SW: number;
  OGL: number;
  A: number;
  ZYW: number;
  S: number;
  WYT: number;
  SZYB: number;
  MAG: number;
  PO: number;
  PP: number;
}

export interface Skills {
  [key: string]: string;
}

export interface ChampTableElement {
  stat: string;
  base?: number;
  development?: number;
  act?: number;
  value?: number;
  fn?: ReactNode;
}

export interface CreateChampFormTableElement {
  stat: string;
  base: JSX.Element;
  development: JSX.Element;
}

export interface Stats {
  ww: number;
  us: number;
  k: number;
  odp: number;
  zr: number;
  int: number;
  sw: number;
  ogl: number;
  a: number;
  zyw: number;
  s: number;
  wyt: number;
  szyb: number;
  mag: number;
  po: number;
  pp: number;
}

export interface CreateChampionFormValues {
  name: string;
  money: number;
  actualLife: number;
  skills: string[];
  abilities: string[];
  inventory: string[];
  id: string;
  img: string;
  exp: number;
  user: string;

  baseWW: number;
  baseUS: number;
  baseK: number;
  baseODP: number;
  baseZR: number;
  baseINT: number;
  baseSW: number;
  baseOGL: number;
  baseA: number;
  baseZYW: number;
  baseS: number;
  baseWYT: number;
  baseSZYB: number;
  baseMAG: number;
  basePO: number;
  basePP: number;

  addWW: number;
  addUS: number;
  addK: number;
  addODP: number;
  addZR: number;
  addINT: number;
  addSW: number;
  addOGL: number;
  addA: number;
  addZYW: number;
  addS: number;
  addWYT: number;
  addSZYB: number;
  addMAG: number;
  addPO: number;
  addPP: number;
}

export type BattleMember = Champion | { name: string; id: string };
