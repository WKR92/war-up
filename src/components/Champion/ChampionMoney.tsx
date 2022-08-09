import React from "react";
import { Group, createStyles, Text, Box } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Champion } from "../../Models/Models";
import * as championActions from "../../redux/actions/champion/championActions";
import { RootState } from "../../redux/store/store";
import { doc, updateDoc } from "firebase/firestore";
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

const ChampionMoney: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const canUserChangeChamp = user.email === champ.user && user.role === "BG";

  const updateMoneyInDb = async (operation: string) => {
    const docRef = doc(db, "Champions", champ.id);
    const data = {
      money:
        operation === "add"
          ? parseInt(champ.money.toString()) + 1
          : parseInt(champ.money.toString()) === 0
          ? 0
          : champ.money - 1,
    };
    await updateDoc(docRef, data);
  };

  return (
    <Group className={classes.group}>
      <Text>Money:</Text>
      <Text className={classes.moneyBox}>{champ.money}g</Text>
      <Group className={classes.btnsGroup}>
        {canUserChangeChamp && (
          <Text
            className={classes.btn}
            onClick={() => {
              updateMoneyInDb("add");
              dispatch(championActions.changeMoney(champ.user, "add"));
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
              dispatch(championActions.changeMoney(champ.user, "sub"));
            }}
          >
            -
          </Text>
        )}
      </Group>
    </Group>
  );
};

export default ChampionMoney;
