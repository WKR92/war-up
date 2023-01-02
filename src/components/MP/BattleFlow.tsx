import * as dice from "../../services/diceService";

import { BattleMember, Champion } from "../../Models/Models";
import { Box, Button, Group, Text, createStyles } from "@mantine/core";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IconCircleCheck, IconSquareMinus } from "@tabler/icons";
import React, { useEffect } from "react";

const useStyles = createStyles(() => ({
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
    width: "33%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "38px",
  },
  dndGroup: {
    width: "100%",
    justifyContent: "space-around",
    padding: "5px",
    gap: "0px",
  },
  dndBtn: {
    width: "24%",
  },
  initBtn: {
    width: "100%",
    maxWidth: "376px",
    marginBottom: "1rem",
  },
}));

type IProps = {
  setBattleFormResult: React.Dispatch<React.SetStateAction<BattleMember[]>>;
  battleFormResult: BattleMember[];
};

type InitMember = {
  id: string;
  initiative: number;
};

const BattleFlow: React.FC<IProps> = ({
  battleFormResult,
  setBattleFormResult,
}) => {
  const { classes } = useStyles();

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = battleFormResult;
    const reorderedItem = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem[0]);
    setBattleFormResult(items);
  };

  const deleteMember = (id: string) => {
    const changedMembers = Object.values(battleFormResult).filter(
      (member: BattleMember) => member.id !== id
    );
    setBattleFormResult(changedMembers);
  };

  const changeMemberToDone = (id: string) => {
    const li = document.querySelector(`#li-${id}`) as HTMLLIElement;
    if (li.style.backgroundColor === "grey")
      return (li.style.backgroundColor = "#1a1b1e");
    li.style.backgroundColor = "grey";
  };

  const rollForInitiative = () => {
    const init: InitMember[] = [];
    const members = battleFormResult;
    const enemies = members.filter((member: BattleMember) =>
      member.name.includes("enemy")
    );
    enemies.forEach((enemy) =>
      init.push({ id: enemy.id, initiative: dice.rollForInitiativeForEnemy() })
    );
    const players = members.filter(
      (member: BattleMember) => !member.name.includes("enemy")
    );
    players.forEach((player: any) =>
      init.push({
        id: player.id,
        initiative: Math.round((player.add.zr + player.base.zr)/5) + dice.rollK20(),
      })
    );
    init.sort((a, b) => a.initiative - b.initiative).reverse();
    const order = Object.values(init).map((elem) => elem.id);
    const newOrderOfBattle = battleFormResult.sort(
      (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
    );
    setBattleFormResult([...newOrderOfBattle]);
  };

  return (
    <Box>
      <h3>Battle flow:</h3>
      {Object.keys(battleFormResult).length > 1 ? (
        <Button className={classes.initBtn} onClick={() => rollForInitiative()}>
          Initiative
        </Button>
      ) : null}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="heros">
          {(provided) => (
            <ul
              className={classes.dndUl}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Object.values(battleFormResult).map(
                (member: BattleMember, index: number) => {
                  return (
                    <Draggable
                      key={member.id}
                      draggableId={member.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          className={classes.dndLi}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          id={`li-${member.id}`}
                        >
                          <Group className={classes.dndGroup}>
                            <Text className={classes.dndHeroName}>
                              {member.name}
                            </Text>
                            <Button
                              color="green"
                              onClick={() => changeMemberToDone(member.id)}
                              className={classes.dndBtn}
                            >
                              <IconCircleCheck size={16} stroke={2} />
                            </Button>
                            <Button
                              onClick={() => deleteMember(member.id)}
                              color="red"
                              className={classes.dndBtn}
                            >
                              <IconSquareMinus size={16} stroke={2} />
                            </Button>
                          </Group>
                        </li>
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default BattleFlow;
