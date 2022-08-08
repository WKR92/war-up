import React, { useMemo, useEffect} from "react";
import { Box } from "@mantine/core";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firabase/sdk";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Champion } from "../../Models/Models";
import ChampionArray from "./ChampionArray";
import ChampionMoney from "./ChampionMoney";
import ChampionStats from "./ChampionStats";
import { getStore } from "../../services/storageService";
import isEqual from "lodash/isequal";
import { showNotification } from "@mantine/notifications";
import DeleteChampionModal from "./DeleteChampionModal";
import ChampionImage from "./ChampionImage";

type IProps = {
  champ: Champion;
  setChamp: React.Dispatch<React.SetStateAction<Champion>> | null;
};

const UserChampion: React.FC<IProps> = ({ champ, setChamp }) => {
  const champions = useSelector((state: RootState) => state.champions);
  const user = useSelector((state: RootState) => state.user);
  const docRef = doc(db, "Champions", champ.id);
  const champBeforeChange = useMemo(
    () => champions.filter((champ: Champion) => champ.user === user.email)[0],
    []
  );

  const updateChampion = async (updates: Champion) => {
    await setDoc(docRef, updates);
  };

  const setChampionUpdate = async () => {
    const champFromStore = JSON.parse(getStore("CHAMP") || "");
    if (!isEqual(champBeforeChange, champFromStore)) {
      showNotification({
        message: "Hero changes saved",
        autoClose: 5000,
        color: "cyan",
      });
      await updateChampion(champFromStore);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", setChampionUpdate);
    return () => {
      setChampionUpdate();
      window.removeEventListener("beforeunload", setChampionUpdate);
    };
  }, []);

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
      {user.email === champ.user && (
        <DeleteChampionModal onConfirm={deleteChampion} />
      )}
    </Box>
  );
};

export default UserChampion;
