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
import BattleForm from "./BattleForm";

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
  showBtn: {
    marginBottom: "1rem",
  },
  enemiesInput: {
    width: "125px",
  },
  dndUl: {
    listStyleType: "none",
    margin: "0",
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
    maxWidth: "376px",
  },
  dndLi: {
    marginBottom: "1rem",
    border: "1px solid orange",
    borderRadius: "5px",
    padding: "5px",
  },
  dndHeroName: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "38px",
  },
  dndGroup: {
    width: "100%",
    justifyContent: "space-between",
    padding: "5px",
    gap: "1px",
  },
  dndBtn: {
    width: "24%",
  },
  submitFormBtn: {
    marginTop: '1rem',
    width: "125px",
  }
}));

const MPDashboard: React.FC = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const championsCollectionRef = collection(db, "Champions");
  const champions = useSelector((state: RootState) => state.champions);
  const [heros, setHeros] = useState([] as Champion[]);
  // const [showSelectPLayers, setShowSelectPlayers] = useState(false);
  // const [selectedPlayers, setSelectedPlayers] = useState([] as Champion[]);
  const [initialFormValues, setInitialFormValues] = useState({});

  const getInitialFormValues = () => {
    const initialValues: { name?: boolean } = {};
    champions.forEach((hero: Champion) => {
      Object.assign(initialValues, { name: true });
      const heroName = hero.name as keyof typeof initialValues;
      initialValues[heroName] = initialValues.name;
      delete initialValues.name;
    });
    const staticValues = { numberOfEnemies: 0 };
    const readyInitValues = Object.assign(staticValues, initialValues);
    setInitialFormValues(readyInitValues);
  };


  const getChampions = () => {
    getDocs(championsCollectionRef).then((snaphot) => {
      // eslint-disable-next-line
      const champs: any[] = [];
      snaphot.docs.forEach((doc) => {
        champs.push({ ...doc.data(), id: doc.id });
      });
      dispatch(championActions.championsDownloaded(champs));
    });
  };

  useEffect(() => {
    if (champions.length === 0) getChampions();
    setHeros(champions);
    getInitialFormValues();
  }, [champions]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = champions;
    const reorderedItem = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem[0]);
    setHeros(items);
  };

  return (
    <Box>
      {Object.keys(initialFormValues).length > 1 ? <BattleForm initialFormValues={initialFormValues} heros={heros} /> : null }
      <Box>
        <h3>Roll dices:</h3>
      </Box>
      <Box>
        <h3>Battle flow:</h3>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="heros">
            {(provided) => (
              <ul
                className={classes.dndUl}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {heros.map((hero: Champion, index: number) => {
                  return (
                    <Draggable
                      key={hero.id}
                      draggableId={hero.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          className={classes.dndLi}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Text className={classes.dndHeroName}>
                            {hero.name}
                          </Text>
                          <Group className={classes.dndGroup}>
                            <Button className={classes.dndBtn}></Button>
                            <Button className={classes.dndBtn}></Button>
                            <Button className={classes.dndBtn}></Button>
                            <Button color="red" className={classes.dndBtn}>
                              <IconSquareMinus size={16} stroke={2} />
                            </Button>
                          </Group>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default MPDashboard;
