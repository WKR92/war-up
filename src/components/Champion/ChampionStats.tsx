import * as championActions from "../../redux/actions/champion/championActions";

import { Box, Button, Group, Modal, createStyles } from "@mantine/core";
import { ChampTableElement, Champion, Stats } from "../../Models/Models";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store/store";
import { Table } from "@mantine/core";
import { db } from "../../firabase/sdk";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles(() => ({
  container: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
  },
  statsBox: {
    width: "25px",
    height: "25px",
    border: "1px solid black",
  },
  table: {
    width: "100%",
    margin: "auto",
  },
  tableSpan: {
    minWidth: "20px",
    display: "inline-block",
    margin: "auto",
  },
  modalContentContainer: {
    width: "max-content",
    margin: "auto",
  },
  showBtn: {
    marginBottom: ".5rem",
    width: "140px",
  },
}));

type IProps = {
  champ: Champion;
};

const ChampionStats: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const [elements, setElements] = useState([] as ChampTableElement[]);
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [showStats, setShowStats] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [attribute, setAttribute] = useState("");
  const canUserChangeChamp =
    user.email === champ.user && user.role === "BG" && champ.exp >= 100;

  const rows = elements.map((element) => (
    <tr key={element.stat}>
      <td>{element.stat}</td>
      <td>{element.base}</td>
      <td>{element.development}</td>
      <td>{element.act}</td>
      <td>{canUserChangeChamp && element.fn}</td>
    </tr>
  ));

  const checkIfNaN = (calc: number | typeof NaN) => {
    return !isNaN(calc) ? calc : 0;
  };

  const createElement = (atr: string) => {
    return {
      stat: atr.toUpperCase(),
      development: champ.add[atr as keyof Stats],
      base: champ.base[atr as keyof Stats],
      act:
        atr === "s" || atr === "wyt"
          ? Math.floor(
              checkIfNaN(
                champ.base[atr as keyof Stats] + champ.add[atr as keyof Stats]
              )
            )
          : atr === "pp" ||
            atr === "po" ||
            atr === "mag" ||
            atr === "szyb" ||
            atr === "zyw" ||
            atr === "a"
          ? checkIfNaN(
              champ.base[atr as keyof Stats] + champ.add[atr as keyof Stats]
            )
          : checkIfNaN(
              Math.round(
                (champ.base[atr as keyof Stats] +
                  champ.add[atr as keyof Stats]) /
                  5
              )
            ),
      fn: (
        <Button onClick={() => openModal(atr)} size="xs">
          +
        </Button>
      ),
    };
  };

  useEffect(() => {
    const attributes = Object.keys(champ.base);
    const elements: ChampTableElement[] = [];
    attributes.forEach((atr) => elements.push(createElement(atr)));
    const order = [
      "ww",
      "us",
      "k",
      "odp",
      "zr",
      "int",
      "sw",
      "ogl",
      "a",
      "zyw",
      "s",
      "wyt",
      "szyb",
      "mag",
      "po",
      "pp",
    ];
    elements.sort(
      (a, b) =>
        order.indexOf(a.stat.toLowerCase()) -
        order.indexOf(b.stat.toLowerCase())
    );
    setElements(elements);
  }, [champ]);

  const openModal = (atr: string) => {
    if (champ.exp < 100) return;
    setAttribute(atr);
    setShowModal(true);
  };

  const updateAttrInDb = async () => {
    const docRef = doc(db, "Champions", champ.id);
    const element = Object.values(elements).filter(
      (elem: ChampTableElement) => elem.stat === attribute.toUpperCase()
    );
    console.log("element", element);
    const statsIncreasedBy5 = [
      "WW",
      "US",
      "K",
      "ODP",
      "ZR",
      "INT",
      "SW",
      "OGL",
    ];
    let changedAttr = element[0].development;
    console.log("before", changedAttr);
    if (statsIncreasedBy5.includes(attribute.toUpperCase()))
      changedAttr = changedAttr + 5;
    if (!statsIncreasedBy5.includes(attribute.toUpperCase()))
      changedAttr = changedAttr + 1;
    console.log("after", changedAttr);
    const attrPath = `add.${attribute}`;
    const data = { [attrPath]: changedAttr };
    await updateDoc(docRef, data);
    const exp = { exp: champ.exp - 100 };
    await updateDoc(docRef, exp);
  };

  const dispatchAction = () => {
    dispatch(championActions.changeChampionStat(attribute, champ.user));
    const statsIncreasedBy5 = [
      "WW",
      "US",
      "K",
      "ODP",
      "ZR",
      "INT",
      "SW",
      "OGL",
    ];
    let amount = 0;
    if (statsIncreasedBy5.includes(attribute.toUpperCase())) amount = 5;
    if (!statsIncreasedBy5.includes(attribute.toUpperCase())) amount = 1;
    showNotification({
      message: `${attribute.toUpperCase()} + ${amount}`,
      autoClose: 5000,
      color: "cyan",
    });
    setShowModal(false);
  };

  return (
    <Box className={showStats ? classes.container : undefined}>
      <Button
        className={classes.showBtn}
        onClick={() => setShowStats(!showStats)}
      >
        {showStats ? "Close Stats" : "Show stats"}
      </Button>
      {showStats && (
        <Table highlightOnHover className={classes.table}>
          <thead>
            <tr>
              <th>Stats</th>
              <th>Base</th>
              <th>Add</th>
              <th>Act</th>
              {canUserChangeChamp && <th>Buy</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}

      <Modal
        centered
        withCloseButton={false}
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Are you sure? It's irreversible and will cost you 100exp!"
      >
        <Group align="center" className={classes.modalContentContainer}>
          <Button
            onClick={() => {
              dispatchAction();
              updateAttrInDb();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
            }}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default ChampionStats;
