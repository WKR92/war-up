import * as championActions from "../../redux/actions/champion/championActions";

import { Box, LoadingOverlay, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { Champion } from "../../Models/Models";
import CreateChampionForm from "./CreateChampionForm";
import { RootState } from "../../redux/store/store";
import UserChampion from "./UserChampion";
import { db } from "../../firabase/sdk";

const useStyles = createStyles(() => ({
  title: {
    margin: "10px 0",
  },
  container: {
    width: "100%",
    maxWidth: "376px",
  },
}));

const ChampionDashboard: React.FC = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const championsCollectionRef = collection(db, "Champions");
  const champions = useSelector((state: RootState) => state.champions);
  const user = useSelector((state: RootState) => state.user);
  const [champ, setChamp] = useState({} as Champion);
  const [update, setUpdate] = useState(1);

  const getChampions = () => {
    getDocs(championsCollectionRef).then((snapshot) => {
      const champs: unknown[] = [];
      snapshot.docs.forEach((doc) => {
        champs.push({ ...doc.data(), id: doc.id });
      });
      dispatch(championActions.championsDownloaded(champs as Champion[]));
    });
  };

  useEffect(() => {
    if (champions.length > 0) getChampions();
    const userChamp = champions.filter(
      (champ: Champion) => champ.user === user.email
    );
    if (userChamp.length > 0) {
      setChamp(userChamp[0]);
    }
  }, [update]);

  useEffect(() => {
    if (!champions.length) getChampions();
    const userChamp = champions.filter(
      (champ: Champion) => champ.user === user.email
    );
    if (userChamp.length > 0) {
      setChamp(userChamp[0]);
    }
  }, [champions]);

  return (
    <Box className={classes.container}>
      <h2 className={classes.title}>Hero dashboard</h2>
      {Object.keys(champ).length > 0 ? (
        <UserChampion champ={champ} setChamp={setChamp} setUpdate={setUpdate} />
      ) : (
        // <CreateChampionForm getChampions={getChampions} />
        <LoadingOverlay visible={!Object.keys(champ).length} overlayBlur={2} />
      )}
    </Box>
  );
};

export default ChampionDashboard;
