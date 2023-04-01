import * as championActions from "../../redux/actions/champion/championActions";

import { Box, Button, Group, Text, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { Champion } from "../../Models/Models";
import { RootState } from "../../redux/store/store";
import UserChampion from "../Champion/UserChampion";
import { db } from "../../firabase/sdk";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    maxWidth: "376px",
  },
  title: {
    margin: "10px 0",
  },
  showHeroBtn: {
    width: "100%",
    marginBottom: "1rem",
  },
  heroContainer: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",

  },
}));

const Team: React.FC = () => {
  const championsCollectionRef = collection(db, "Champions");
  const { classes } = useStyles();
  const champions = useSelector((state: RootState) => state.champions);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [team, setTeam] = useState([] as Champion[]);
  const [openHero, setOpenHero] = useState({
    id: "",
    opened: false,
  });

  const getChampions = () => {
    getDocs(championsCollectionRef).then((snapshot) => {
      const champs: unknown[] = [];
      snapshot.docs.forEach((doc) => {
        champs.push({ ...doc.data(), id: doc.id });
      });
      dispatch(championActions.championsDownloaded(champs as Champion[]));
    });
  };

  const toggleHero = (id: string) => {
    setOpenHero({ id, opened: true });
    if (openHero.opened === true && openHero.id === id)
      return setOpenHero({ id: "", opened: false });
  };

  useEffect(() => {
    if (champions.length === 0) getChampions();
    const newTeam = champions.filter(
      (champ: Champion) => champ.user !== user.email
    );
    newTeam.sort((a: Champion, b: Champion) => a.name.localeCompare(b.name));
    setTeam(newTeam);
  }, [champions]);

  return (
    <Box className={classes.container}>
      <h2 className={classes.title}>Team</h2>
      {team.length > 0 ? (
        team.map((hero) => (
          <Box
            className={
              openHero.id === hero.id && openHero.opened
                ? classes.heroContainer
                : undefined
            }
            key={hero.name}
          >
            <Button
              className={classes.showHeroBtn}
              onClick={() => toggleHero(hero.id)}
            >
              {openHero.id === hero.id
                ? `Close ${hero.name}`
                : `Show ${hero.name}`}
            </Button>
            {openHero.id === hero.id && openHero.opened && (
              <UserChampion champ={hero} setChamp={null} />
            )}
          </Box>
        ))
      ) : (
        <Text>No members found</Text>
      )}
    </Box>
  );
};

export default Team;
