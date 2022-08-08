import React from "react";
import { Group, createStyles, Text, Box } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Champion } from "../../Models/Models";
import * as championActions from "../../redux/actions/champion/championActions";
import { RootState } from "../../redux/store/store";

const useStyles = createStyles(() => ({
  moneyBox: {
    marginRight: '.25rem'
  },
  btn: {
    width: "25px",
    color: "orange",
    textAlign: 'center'
  },
  group: {
    height: '36px',
    gap: "6px",
  },
  btnsGroup: {
    gap: '0px'
  }
}));

type IProps = {
  champ: Champion;
};

const ChampionMoney: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const canUserChangeChamp = user.email === champ.user && user.role === "BG";

  return (
    <Group className={classes.group}>
      <Text>Money:</Text>
      <Text className={classes.moneyBox}>{champ.money}g</Text>
      <Group className={classes.btnsGroup}>
        {canUserChangeChamp && (
          <Text
            className={classes.btn}
            onClick={() =>
              dispatch(championActions.changeMoney(champ.user, "add"))
            }
          >
            +
          </Text>
        )}
        {canUserChangeChamp && (
          <Text
            className={classes.btn}
            onClick={() =>
              dispatch(championActions.changeMoney(champ.user, "sub"))
            }
          >
            -
          </Text>
        )}
      </Group>
    </Group>
  );
};

export default ChampionMoney;
