import React, { useMemo, useEffect, useState } from "react";
import { Box, Button, Group, TextInput, Input, createStyles } from "@mantine/core";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firabase/sdk";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Champion } from "../../Models/Models";
import ChampionArray from "./ChampionArray";
import ChampionMoney from "./ChampionMoney";
import ChampionStats from "./ChampionStats";
import { getStore } from "../../services/storageService";
import isEqual from "lodash.isequal";
import { showNotification } from "@mantine/notifications";
import DeleteChampionModal from "./DeleteChampionModal";
import ChampionImage from "./ChampionImage";

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
};

const UserChampion: React.FC<IProps> = ({ champ, setChamp }) => {
  const { classes } = useStyles();
  const champions = useSelector((state: RootState) => state.champions);
  const user = useSelector((state: RootState) => state.user);
  const docRef = doc(db, "Champions", champ.id);
  const [champFromStore, setChampFromStore] = useState({} as Champion);
  const [exp, setExp] = useState('');
  const ruleOfDisplay = user.email === champ.user;
  const champBeforeChange = useMemo(
    () => champions.filter((champ: Champion) => champ.user === user.email)[0],
    []
  );

  const updateChampion = async () => {
    await setDoc(docRef, champFromStore);
    showNotification({
      message: "Hero changes saved",
      autoClose: 5000,
      color: "cyan",
    });
  };

  const updateExp = async () => {
    if (parseInt(exp) > 0) {
      const docRef = doc(db, "Champions", champ.id);
      const data = { exp: parseInt(exp) };
      await updateDoc(docRef, data);
    }
    setExp('');
    return showNotification({
      message: `Exp given to ${champ.name}`,
      autoClose: 5000,
      color: "cyan",
    });
  };

  // const setChampionUpdate = async () => {
  //   const champFromStore = JSON.parse(getStore("CHAMP") || "");
  //   if (!isEqual(champBeforeChange, champFromStore)) {
  //     showNotification({
  //       message: "Hero changes saved",
  //       autoClose: 5000,
  //       color: "cyan",
  //     });
  //     await updateChampion(champFromStore);
  //   }
  // };

  // useEffect(() => {
  //   const storedChamp = JSON.parse(getStore("CHAMP") || "");
  //   if (!isEqual(champBeforeChange, storedChamp)) {
  //     setChampFromStore(storedChamp);
  //   }
  // }, [champ]);

  // useEffect(() => {
  //   window.addEventListener("beforeunload", setChampionUpdate);
  //   return () => {
  //     setChampionUpdate();
  //     window.removeEventListener("beforeunload", setChampionUpdate);
  //   };
  // }, []);

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
      <p>Exp: {champ.exp}</p>
      <ChampionStats champ={champ} />
      <ChampionArray champ={champ} arrayName="abilities" />
      <ChampionArray champ={champ} arrayName="skills" />
      <ChampionArray champ={champ} arrayName="inventory" />
      <ChampionImage champ={champ} />
      <ChampionMoney champ={champ} />
      {user.role === "MP" && (
        <Group className={classes.expContainer}>
          <Input
            placeholder="experience"
            value={exp}
            onChange={(e: any) => setExp(e.target.value)}
            className={classes.expInput}
          />
          <button onClick={()=>console.log(exp)}>qwe</button>
          <Button disabled={parseInt(exp) === 0 || exp === undefined || exp === null} onClick={() => updateExp()}>
            Give
          </Button>
        </Group>
      )}

      {ruleOfDisplay && (
        <Button
          className={classes.updateHeroBtn}
          disabled={Object.keys(champFromStore).length > 0}
          onClick={() => updateChampion()}
        >
          Update Hero
        </Button>
      )}
      {ruleOfDisplay && <DeleteChampionModal onConfirm={deleteChampion} />}
    </Box>
  );
};

export default UserChampion;
