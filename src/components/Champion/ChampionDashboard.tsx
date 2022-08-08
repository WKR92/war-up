import React, { useEffect, useState } from "react";
import { Box, createStyles } from "@mantine/core";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firabase/sdk";
import * as championActions from "../../redux/actions/champion/championActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import UserChampion from "./UserChampion";
import { Champion } from "../../Models/Models";
import CreateChampionForm from "./CreateChampionForm";
import { setStore } from "../../services/storageService";

const useStyles = createStyles(() => ({
  title: {
    margin: '10px 0'
  }
}));

export default function ChampionDashboard() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const championsCollectionRef = collection(db, "Champions");
  const champions = useSelector((state: RootState) => state.champions);
  const user = useSelector((state: RootState) => state.user);
  const [champ, setChamp] = useState({} as Champion);

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
    const userChamp = champions.filter(
      (champ: Champion) => champ.user === user.email
    );
    if (userChamp.length > 0) {
      setChamp(userChamp[0]);
      setStore("CHAMP", JSON.stringify(userChamp[0]));
    }
  }, [champions]);

  return (
    <Box>
      <h2 className={classes.title}>Hero dashboard</h2>
      {Object.keys(champ).length > 0 ? (
        <UserChampion champ={champ} setChamp={setChamp} />
      ) : (
        <CreateChampionForm getChampions={getChampions} />
      )}
    </Box>
  );
}
