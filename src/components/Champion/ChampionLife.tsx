import * as championActions from "../../redux/actions/champion/championActions";

import { Group, Text, createStyles } from "@mantine/core";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { Champion } from "../../Models/Models";
import React from "react";
import { RootState } from "../../redux/store/store";
import { db } from "../../firabase/sdk";

const useStyles = createStyles(() => ({
  moneyBox: {
    marginRight: ".25rem",
  },
  btn: {
    width: "25px",
    color: "orange",
    textAlign: "center",
    cursor: "pointer",
  },
  group: {
    height: "36px",
    gap: "6px",
  },
  btnsGroup: {
    gap: "0px",
  },
}));

type IProps = {
  champ: Champion;
};

const ChampionLife: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const canUserChangeChamp = user.email === champ.user && user.role === "BG";

  const updateMoneyInDb = async (operation: string) => {
    const docRef = doc(db, "Champions", champ.id);
    const data = {
      actualLife:
        operation === "add"
          ? parseInt(champ.actualLife.toString()) + 1
          : parseInt(champ.actualLife.toString()) === 0
          ? 0
          : champ.actualLife - 1,
    };
    await updateDoc(docRef, data);
  };

  return (
    <Group className={classes.group}>
      <Text>Actual life:</Text>
      <Text className={classes.moneyBox}>{champ.actualLife}</Text>
      <Group className={classes.btnsGroup}>
        {canUserChangeChamp && (
          <Text
            className={classes.btn}
            onClick={() => {
              updateMoneyInDb("add");
              dispatch(championActions.changeLife(champ.user, "add"));
            }}
          >
            +
          </Text>
        )}
        {canUserChangeChamp && (
          <Text
            className={classes.btn}
            onClick={() => {
              updateMoneyInDb("sub");
              dispatch(championActions.changeLife(champ.user, "sub"));
            }}
          >
            -
          </Text>
        )}
      </Group>
    </Group>
  );
};

export default ChampionLife;
