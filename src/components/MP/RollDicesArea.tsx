import React, { useState, useEffect, useRef } from "react";
import { Text, Button, Group, Box, createStyles, Select } from "@mantine/core";
import * as dice from "../../services/diceService";
import { BattleMember } from "../../Models/Models";

const useStyles = createStyles(() => ({
  result: {
    color: "orange",
    fontSize: '18px'
  },
  resultBox: {
    height: "50px",
    width: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryDiceInput: {
    marginBottom: "1rem",
    width: "45%",
  },
  actionRollBtn: {
    marginBottom: "-8px",
    width: "45%",
    height: '35px'
  },
  container: {
    width: "100%",
    maxWidth: "376px",
    justifyContent: "space-around",
    gap: '0'
  },
}));

const RollDicesArea: React.FC = () => {
  const { classes } = useStyles();
  const [result1, setResult1] = useState(null as number | null);
  const [result2, setResult2] = useState(null as number | null);
  const [selectedDice, setSelectedDice] = useState("k10" as string | null);

  const rollSecondaryDice = () => {
    if (selectedDice === "k10") setResult2(dice.rollK10());
    if (selectedDice === "k8") setResult2(dice.rollK8());
    if (selectedDice === "k6") setResult2(dice.rollK6());
    if (selectedDice === "k4") setResult2(dice.rollK4());
  };

  const actionRoll = () => {
    setResult1(dice.rollK100());
    rollSecondaryDice();
  };

  return (
    <Box>
      <h3>Roll dices:</h3>
      <Box>
        <Box>
          <Group className={classes.container}>
            <Select
              label="Secondary dice"
              placeholder="secondary dice"
              data={[
                { value: "k10", label: "k10" },
                { value: "k8", label: "k8" },
                { value: "k6", label: "k6" },
                { value: "k4", label: "k4" },
              ]}
              value={selectedDice}
              onChange={(k) => {
                setSelectedDice(k);
                setResult2(null);
              }}
              className={classes.secondaryDiceInput}
            />
            <Button
              className={classes.actionRollBtn}
              onClick={() => actionRoll()}
            >
              Action Roll
            </Button>
          </Group>
        </Box>
        <Group className={classes.container}>
          <Text>k100:</Text>
          <Text>{selectedDice}:</Text>
        </Group>
        <Group className={classes.container}>
          <Box className={classes.resultBox}>
            <Text className={classes.result}>{result1}</Text>
          </Box>
          <Box className={classes.resultBox}>
            <Text className={classes.result}>{result2}</Text>
          </Box>
        </Group>
      </Box>
    </Box>
  );
};

export default RollDicesArea;
