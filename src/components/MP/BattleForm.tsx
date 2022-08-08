import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Box,
  createStyles,
  Checkbox,
  Group,
} from "@mantine/core";
import { Champion, BattleMember } from "../../Models/Models";
import { useForm } from "@mantine/form";
import { v4 as uuidv4 } from "uuid";

const useStyles = createStyles(() => ({
  title: {
    margin: "10px, 0",
  },
  container: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
  },
  containerBeforeOpened: {
    marginBottom: "1rem",
  },
  checkbox: {
    marginBottom: ".5rem",
  },
  submitFormBtn: {
    marginTop: "1rem",
    width: "45%",
    marginBottom: "-8px",
    height: "35px",
  },
  showBtn: {
    marginBottom: "1rem",
    width: "100%",
  },
  showBtnBeforeOpen: {
    width: "100%",
  },
  enemiesInput: {
    width: "45%",
  },
  box: {
    width: "100%",
    maxWidth: "376px",
    justifyContent: "space-around",
  },
  submitGroup: {
    gap: "0",
    justifyContent: "space-around",
  },
}));

type IProps = {
  initialFormValues: Record<string, never>;
  heros: Champion[];
  setBattleFormResult: React.Dispatch<React.SetStateAction<BattleMember[]>>;
};

const BattleForm: React.FC<IProps> = ({
  initialFormValues,
  heros,
  setBattleFormResult,
}) => {
  const { classes } = useStyles();
  const [showSelectPLayers, setShowSelectPlayers] = useState(false);
  const [numOfSelectedPlayers, setNumOfSelectedPlayers] = useState(0);

  const form = useForm({
    initialValues: initialFormValues,
  });

  const handleSubmit = (e: React.SyntheticEvent, form: any) => {
    e.preventDefault();
    const values = form.values;
    const formResult: BattleMember[] = [];
    const enemies = values.numberOfEnemies;
    let i = 0;
    while (i < enemies) {
      formResult.push({ name: `enemy${i + 1}`, id: uuidv4() });
      i++;
    }
    delete values.numberOfEnemies;
    const players = values;
    const selectedPlayers = Object.keys(players).filter((key) => players[key]);
    selectedPlayers.forEach((name) =>
      heros.map((hero: Champion) => {
        if (hero.name === name) formResult.push(hero);
      })
    );
    values.numberOfEnemies = enemies;
    setBattleFormResult(formResult);
  };

  useEffect(() => {
    const players = form.values;
    const selectedPlayers = Object.keys(players).filter((key) => players[key]);
    setNumOfSelectedPlayers(selectedPlayers.length);
  }, [form.values]);

  return (
    <Box className={classes.box}>
      <h2 className={classes.title}>War time!</h2>
      <form onSubmit={(e: React.SyntheticEvent) => handleSubmit(e, form)}>
        <Box
          className={
            showSelectPLayers
              ? classes.container
              : classes.containerBeforeOpened
          }
        >
          <Button
            className={
              showSelectPLayers ? classes.showBtn : classes.showBtnBeforeOpen
            }
            onClick={() => setShowSelectPlayers(!showSelectPLayers)}
          >
            Select players ({numOfSelectedPlayers})
          </Button>
          {showSelectPLayers &&
            heros.length > 0 &&
            heros.map((hero: any) => (
              <Checkbox
                key={hero.name}
                className={classes.checkbox}
                label={hero.name}
                {...form.getInputProps(hero.name, { type: "checkbox" })}
              />
            ))}
        </Box>
        <Group className={classes.submitGroup}>
          <TextInput
            className={classes.enemiesInput}
            label="Number of enemies"
            type="number"
            {...form.getInputProps("numberOfEnemies")}
          />
          <Button type="submit" color="green" className={classes.submitFormBtn}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default BattleForm;
