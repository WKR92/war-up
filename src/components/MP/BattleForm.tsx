import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  Input,
  Button,
  Group,
  Box,
  createStyles,
  Modal,
  Checkbox,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Champion } from "../../Models/Models";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { showNotification } from "@mantine/notifications";
import * as championActions from "../../redux/actions/champion/championActions";
import { db } from "../../firabase/sdk";
import { collection, getDocs } from "firebase/firestore";
import { useForm } from "@mantine/form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IconSquareMinus } from "@tabler/icons";

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
    width: "125px",
  },
  showBtn: {
    marginBottom: "1rem",
  },
  enemiesInput: {
    width: "125px",
  },
}));

type IProps = {
  initialFormValues: Record<string, never>;
  heros: Champion[];
};

const BattleForm: React.FC<IProps> = ({ initialFormValues, heros }) => {
  const { classes } = useStyles();
  const [showSelectPLayers, setShowSelectPlayers] = useState(false);

  const form = useForm({
    initialValues: initialFormValues,
  });

  useEffect(()=>{
    console.log('initialFormValues', initialFormValues)
  }, [])

  return (
    <Box>
      <h2 className={classes.title}>War time!</h2>
      <form>
        <Box
          className={
            showSelectPLayers
              ? classes.container
              : classes.containerBeforeOpened
          }
        >
          <Button
            className={showSelectPLayers ? classes.showBtn : undefined}
            onClick={() => setShowSelectPlayers(!showSelectPLayers)}
          >
            Select players
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
        <TextInput
          className={classes.enemiesInput}
          label="Enemies number"
          type="number"
          {...form.getInputProps("numberOfEnemies")}
        />
        <Button color="green" className={classes.submitFormBtn}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default BattleForm;
