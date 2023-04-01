import { Box, Button, Group, Input, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import { Champion } from "../../Models/Models";
import ChampionArray from "./ChampionArray";
import ChampionImage from "./ChampionImage";
import ChampionLife from "./ChampionLife";
import ChampionMoney from "./ChampionMoney";
import ChampionNewStats from "./ChampionNewStats";
import ChampionStats from "./ChampionStats";
import { RootState } from "../../redux/store/store";
import { db } from "../../firabase/sdk";
import { showNotification } from "@mantine/notifications";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// import DeleteChampionModal from "./DeleteChampionModal";






const useStyles = createStyles(() => ({
  expContainer: {
    marginTop: "1rem",
  },
  expInput: {
    width: "140px",
  },
  updateHeroBtn: {
    marginTop: "1rem",
  },
}));

type IProps = {
  champ: Champion;
  setChamp: React.Dispatch<React.SetStateAction<Champion>> | null;
  setUpdate?: React.Dispatch<React.SetStateAction<number>>;
};

const UserChampion: React.FC<IProps> = ({ champ, setChamp, setUpdate }) => {
  const { classes } = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const docRef = doc(db, "Champions", champ.id);
  const [exp, setExp] = useState("");
  // const ruleOfDisplay = user.email === champ.user;
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const updateExp = async () => {
    if (parseInt(exp) > 0) {
      const docRef = doc(db, "Champions", champ.id);
      const data = { exp: champ.exp + parseInt(exp) };
      await updateDoc(docRef, data);
    }
    setExp("");
    return showNotification({
      message: `Exp given to ${champ.name}`,
      autoClose: 5000,
      color: "cyan",
    });
  };

  const deleteChampion = async () => {
    await deleteDoc(docRef);
    if (setChamp) setChamp({} as Champion);
    showNotification({
      message: "Hero deleted",
      autoClose: 5000,
      color: "red",
    });
  };

  return (
    <Box>
      <h3>{champ.name}</h3>
      {(user.email === champ.user || user.role === "MP") && (
        <p>Exp: {champ.exp}</p>
      )}
      {location.pathname !== "/stats" && location.pathname !== "/" ? (
        <ChampionStats champ={champ} />
      ) : (
        <ChampionNewStats champ={champ} setUpdate={setUpdate ?? null} />
      )}
      <ChampionArray champ={champ} arrayName="abilities" />
      <ChampionArray champ={champ} arrayName="skills" />
      <ChampionArray champ={champ} arrayName="inventory" />
      <ChampionImage champ={champ} />
      <ChampionMoney champ={champ} />
      <ChampionLife champ={champ} />
      {user.role === "MP" && (
        <Group className={classes.expContainer}>
          <Input
            placeholder="experience"
            value={exp}
            onChange={(e: any) => setExp(e.target.value)}
            className={classes.expInput}
            type="number"
          />
          <Button
            disabled={
              parseInt(exp) === 0 ||
              exp === "" ||
              exp.toLowerCase().match(/[a-z]/) !== null
            }
            onClick={() => updateExp()}
          >
            Give
          </Button>
        </Group>
      )}
      {/* {ruleOfDisplay && <DeleteChampionModal onConfirm={deleteChampion} />} */}
    </Box>
  );
};

export default UserChampion;
