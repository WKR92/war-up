import { Box, Button, Group, Modal, createStyles } from "@mantine/core";
import { ChampTableElement, Champion, NewStats } from "../../Models/Models";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { RootState } from "../../redux/store/store";
import { Table } from "@mantine/core";
import { db } from "../../firabase/sdk";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";

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
  setUpdate: React.Dispatch<React.SetStateAction<number>> | null;
};

const ChampionNewStats: React.FC<IProps> = ({ champ, setUpdate }) => {
  const { classes } = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const [elements, setElements] = useState([] as ChampTableElement[]);
  const [showStats, setShowStats] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [prize, setPrize] = useState(0);
  const canUserChangeChamp = true;
  // user.email === champ.user && user.role === "BG";

  const rows = elements.map((element) => (
    <tr key={element.stat}>
      <td>{element.stat}</td>
      <td>{element.value}</td>
      {canUserChangeChamp ? <td>{element.fn}</td> : null}
    </tr>
  ));

  const checkCalculatedStats = (
    atr: string,
    value: number,
    correspondingAtrValue: number
  ) => {
    if (correspondingAtrValue > 11 && correspondingAtrValue < 16)
      return value + 1;
    if (correspondingAtrValue > 15) return value + 1;
    if (correspondingAtrValue < 12) return value;
  };

  const getCalculatedAtrCorrespondingAtr = (atr: string) => {
    if (atr === "S") return "K";
    if (atr === "WYT") return "ODP";
    return atr;
  };

  const createElement = (atr: string) => {
    const nonApplicable = ["A", "SZYB", "PO", "WYT", "S"];
    return {
      stat: atr,
      value:
        atr !== "S" && atr !== "WYT"
          ? champ.stats[atr as keyof NewStats]
          : checkCalculatedStats(
              atr,
              champ.stats[atr as keyof NewStats],
              champ.stats[
                getCalculatedAtrCorrespondingAtr(atr) as keyof NewStats
              ]
            ),
      fn: nonApplicable.includes(atr) ? null : (
        <Button onClick={() => openModal(atr)} size="xs">
          +
        </Button>
      ),
    };
  };

  useEffect(() => {
    const attributes = Object.keys(champ.stats);
    const elements: ChampTableElement[] = [];
    attributes.forEach((atr) => elements.push(createElement(atr)));
    const order = [
      "WW",
      "US",
      "K",
      "ODP",
      "ZR",
      "INT",
      "SW",
      "OGL",
      "A",
      "ZYW",
      "S",
      "WYT",
      "SZYB",
      "MAG",
      "PO",
      "PP",
    ];
    elements.sort((a, b) => order.indexOf(a.stat) - order.indexOf(b.stat));
    setElements(elements);
  }, [champ]);

  const openModal = (atr: string) => {
    setAttribute(atr);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal && elements.length) setThePrizeForStat(attribute);
  }, [showModal]);

  const setThePrizeForStat = (stat: string) => {
    const element = Object.values(elements).filter(
      (elem: ChampTableElement) => elem.stat === stat
    );
    const value = element[0].value;
    let prize = 0;
    if (value && value <= 9) prize = 100;
    if (value && value > 9 && value <= 12) prize = 200;
    if (value && value > 12 && value <= 15) prize = 300;
    if (value && value >= 16) prize = 400;
    if (stat === "ZYW") prize = 150;
    if (stat === "PP") prize = 600;
    const fixed = ["MAG"];
    if (fixed.includes(stat)) prize = 300;
    setPrize(prize);
  };

  const updateAttrInDb = async () => {
    const docRef = doc(db, "Champions", champ.id);
    const element = Object.values(elements).filter(
      (elem: ChampTableElement) => elem.stat === attribute
    );
    const changedAttr = element[0].value;
    const attrPath = `stats.${attribute}`;
    const data = { [attrPath]: changedAttr ? changedAttr + 1 : changedAttr };
    await updateDoc(docRef, data);
    const exp = { exp: champ.exp - prize };
    await updateDoc(docRef, exp);
    console.log(setUpdate);
    showNotification({
      message: `${attribute} upgraded`,
      autoClose: 5000,
      color: "green",
    });
    setShowModal(false);
    if (setUpdate) setUpdate((prev) => prev + 1);
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
              <th>Value</th>
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
        title={`Are you sure? It's irreversible and will cost you ${prize} exp!`}
      >
        <Group align="center" className={classes.modalContentContainer}>
          <Button onClick={updateAttrInDb} disabled={champ.exp < prize}>
            {champ.exp < prize ? "No exp" : "Yes"}
          </Button>
          <Button onClick={() => setShowModal(false)}>No</Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default ChampionNewStats;
