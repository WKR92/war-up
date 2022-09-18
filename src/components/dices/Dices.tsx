import * as diceFns from "../../services/diceService";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Group, Modal, Select, createStyles } from "@mantine/core";
import React, { useState } from "react";

import { initializeApp } from "firebase/app";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    maxWidth: "376px",
  },
  diceArea: {
    marginBottom: "1rem",
  },
  diceName: {
    width: "25px",
  },
  diceInput: {
    width: "80px",
  },
  group: {
    gap: "10px",
  },
  dice: {
    width: "30px",
    height: "30px",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid orange",
    color: "orange",
  }
}));

const selectOptions = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
]

const Dices: React.FC = () => {
  const { classes } = useStyles();
  const dices = ["k100", "k20", "k12", "k10", "k8", "k6", "k4", "k2"];
  const [dicesResults, setDicesResults] = useState({
    'k100': [],
    'k20': [],
    'k12': [],
    'k10': [],
    'k8': [],
    'k6': [],
    'k4': [],
    'k2': [],
  });
  const [dicesNum, setDicesNum] = useState({
    'k100': '0',
    'k20': '0',
    'k12': '0',
    'k10': '0',
    'k8': '0',
    'k6': '0',
    'k4': '0',
    'k2': '0',
  });

  const getDicesResults = (fn: Function, numOfDicesToRoll: number, dice: string) => {
    setDicesResults((prevState) => {
      return {
        ...prevState,
        [dice]: Array(numOfDicesToRoll).fill([]).map(() => fn())
      }
    })
  }

  const rollDices = (dice: string) => {
    const key = dice as keyof typeof dicesNum;
    const numOfDicesToRoll = parseInt(dicesNum[key]);

    switch (dice) {
      case "k100":
        getDicesResults(diceFns.rollK100, numOfDicesToRoll, dice);
        break;
      case "k20":
        getDicesResults(diceFns.rollK20, numOfDicesToRoll, dice);
        break;
      case "k12":
        getDicesResults(diceFns.rollK12, numOfDicesToRoll, dice);
        break;
      case "k10":
        getDicesResults(diceFns.rollK10, numOfDicesToRoll, dice);
        break;
      case "k8":
        getDicesResults(diceFns.rollK8, numOfDicesToRoll, dice);
        break;
      case "k6":
        getDicesResults(diceFns.rollK6, numOfDicesToRoll, dice);
        break;
      case "k4":
        getDicesResults(diceFns.rollK4, numOfDicesToRoll, dice);
        break;
      case "k2":
        getDicesResults(diceFns.rollK2, numOfDicesToRoll, dice);
        break;
    }
  };

  const handleChange = (dice: string, value: string | null) => {
    const key = dice as keyof typeof dicesNum;
    setDicesNum(prevState => {
      return {
        ...prevState,
        [key]: value
      }
    })
  };

  return (
    <Box className={classes.container}>
      {dices.map((dice) => (
        <Box className={classes.diceArea} key={dice}>
          <Group>
            <p className={classes.diceName}>{dice}</p>
            <Select
              className={classes.diceInput}
              placeholder="number of dices"
              data={selectOptions}
              value={dicesNum[dice as keyof typeof dicesNum]}
              onChange={(k) => handleChange(dice, k)}
            />
            <Button onClick={() => rollDices(dice)}>Roll</Button>
            <Group className={classes.group}>
              {dicesResults && dicesResults[dice as keyof typeof dicesResults].length > 0
                ? dicesResults[dice as keyof typeof dicesResults].map((result: number) => <div className={classes.dice} key={uuidv4()}>{result}</div>)
                : null}
            </Group>
          </Group>
        </Box>
      ))}
    </Box>
  );
};

export default Dices;
