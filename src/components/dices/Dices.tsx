import React, { useState } from "react";
import { Button, Box, createStyles, Modal, Group, Select } from "@mantine/core";
import * as dice from "../../services/diceService";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    maxWidth: "376px",
  },
}));

const Dices: React.FC = () => {
  const { classes } = useStyles();
  const [numOfDices, setNumOfDices] = useState("1" as string | null);
  const dices = ["k100", "k20", "k12", "k10", "k8", "k6", "k4", "k2"];

  const rollDices = () => {
    let diceNUm = 0;
    if (numOfDices !== null) diceNUm = parseInt(numOfDices);
    const arr = Array(diceNUm);
    arr.forEach(elem => elem.push(dice.rollK100()));
    console.log(arr);
  };

  return (
    <Box className={classes.container}>
      {dices.map((dice) => (
        <Box key={dice}>
          <Group>
            <p>{dice}</p>
            <Select
              placeholder="number of dices"
              data={[
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
              onChange={(k = '1') => {
                setNumOfDices(k);
              }}
            />
            <Button onClick={rollDices}>Roll</Button>
          </Group>
        </Box>
      ))}
    </Box>
  );
};

export default Dices;
