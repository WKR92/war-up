import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  Input,
  Button,
  Group,
  Box,
  createStyles,
  Modal,
  Checkbox,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Champion, BattleMember } from "../../Models/Models";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { showNotification } from "@mantine/notifications";
import * as championActions from "../../redux/actions/champion/championActions";
import { db } from "../../firabase/sdk";
import { collection, getDocs } from "firebase/firestore";
import BattleFlow from "./BattleFlow";
import RollDicesArea from "./RollDicesArea";

import BattleForm from "./BattleForm";

const useStyles = createStyles(() => ({
  title: {
    margin: "10px, 0",
  },
  container: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
  },
  containerBeforeOpened: {
    marginBottom: "1rem",
  },
  checkbox: {
    marginBottom: ".5rem",
  },
  showBtn: {
    marginBottom: "1rem",
  },
  enemiesInput: {
    width: "125px",
  },
  submitFormBtn: {
    marginTop: "1rem",
    width: "125px",
  },
}));

const MPDashboard: React.FC = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const championsCollectionRef = collection(db, "Champions");
  const champions = useSelector((state: RootState) => state.champions);
  const [heros, setHeros] = useState([] as Champion[]);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [battleFormResult, setBattleFormResult] = useState(
    [] as BattleMember[]
  );

  const getInitialFormValues = () => {
    const initialValues: { name?: boolean } = {};
    champions.forEach((hero: Champion) => {
      Object.assign(initialValues, { name: true });
      const heroName = hero.name as keyof typeof initialValues;
      initialValues[heroName] = initialValues.name;
      delete initialValues.name;
    });
    const staticValues = { numberOfEnemies: 0 };
    const readyInitValues = Object.assign(staticValues, initialValues);
    setInitialFormValues(readyInitValues);
  };

  const getChampions = () => {
    getDocs(championsCollectionRef).then((snaphot) => {
      // eslint-disable-next-line
      const champs: any[] = [];
      snaphot.docs.forEach((doc) => {
        champs.push({ ...doc.data(), id: doc.id });
      });
      dispatch(championActions.championsDownloaded(champs));
    });
  };

  useEffect(() => {
    if (champions.length === 0) getChampions();
    setHeros(champions);
    getInitialFormValues();
  }, [champions]);

  return (
    <Box>
      {Object.keys(initialFormValues).length > 1 ? (
        <BattleForm
          setBattleFormResult={setBattleFormResult}
          initialFormValues={initialFormValues}
          heros={heros}
        />
      ) : null}
      <RollDicesArea />
      <BattleFlow
        battleFormResult={battleFormResult}
        setBattleFormResult={setBattleFormResult}
      />
    </Box>
  );
};

export default MPDashboard;
