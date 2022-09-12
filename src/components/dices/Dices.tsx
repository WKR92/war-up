import * as dice from "../../services/diceService";

import { Box, Button, Group, Modal, Select, createStyles } from "@mantine/core";
import React, { useState } from "react";

import { initializeApp } from "firebase/app";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    maxWidth: "376px",
  },
  diceName: {
    width: "25px",
  },
  diceInput: {
    width: "80px",
  },
  group: {
    gap: "5px",
  },
}));

const initialState = [
  { k100: "0" },
  { k20: "0" },
  { k12: "0" },
  { k10: "0" },
  { k8: "0" },
  { k6: "0" },
  { k4: "0" },
  { k2: "0" },
];

const Dices: React.FC = () => {
  const { classes } = useStyles();
  const [numOfDices, setNumOfDices] = useState('1');
  // const [k100, setk100] = useState("1");
  // const [k20, setk20] = useState("1");
  // const [k12, setk12] = useState("1");
  // const [k10, setk10] = useState("1");
  // const [k8, setk8] = useState("1");
  // const [k6, setk6] = useState("1");
  // const [k4, setk4] = useState("1");
  // const [k2, setk2] = useState("1");
  const [dicesResults, setDicesResults] = useState([] as number[]);
  const dices = ["k100", "k20", "k12", "k10", "k8", "k6", "k4", "k2"];

  const rollDices = (k: string) => {
    let diceNum = 0;
    if (numOfDices !== null) diceNum = parseInt(numOfDices);
    switch (k) {
      case "k100":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK100()));
        break;
      case "k20":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK20()));
        break;
      case "k12":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK12()));
        break;
      case "k10":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK10()));
        break;
      case "k8":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK8()));
        break;
      case "k6":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK6()));
        break;
      case "k4":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK4()));
        break;
      case "k2":
        setDicesResults(Array.from(Array(diceNum), () => dice.rollK2()));
        break;
    }
  };

  return (
    <Box className={classes.container}>
      {dices.map((dice) => (
        <Box key={dice}>
          <Group>
            <p className={classes.diceName}>{dice}</p>
            <Select
              className={classes.diceInput}
              placeholder="number of dices"
              data={[
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
              ]}
              value={numOfDices}
              onChange={(k = "1") => {
                if (k !== null) setNumOfDices(k);
                // switch (dice) {
                //   case "k100":
                //     if (k !== null) setk100(k);
                //     break;
                //   case "k20":
                //     if (k !== null) setk20(k);
                //     break;
                //   case "k12":
                //     if (k !== null) setk12(k);
                //     break;
                //   case "k10":
                //     if (k !== null) setk10(k);
                //     break;
                //   case "k8":
                //     if (k !== null) setk8(k);
                //     break;
                //   case "k6":
                //     if (k !== null) setk6(k);
                //     break;
                //   case "k4":
                //     if (k !== null) setk4(k);
                //     break;
                //   case "k2":
                //     if (k !== null) setk2(k);
                //     break;
                // }
              }}
            />
            <Button onClick={() => rollDices(dice)}>Roll</Button>
            <Group className={classes.group}>
              {dicesResults && dicesResults.length > 0
                ? dicesResults.map((result) => <div>{result}</div>)
                : null}
            </Group>
          </Group>
        </Box>
      ))}
    </Box>
  );
};

export default Dices;
