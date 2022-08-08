import * as championActions from "../../redux/actions/champion/championActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Champion, ChampTableElement, Stats } from "../../Models/Models";
import { Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Button, Box, createStyles, Modal, Group } from "@mantine/core";
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
    width: '140px'
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
  const [attribiute, setAttribiute] = useState("");
  const canUserChangeChamp = user.email === champ.user && user.role === "BG" && champ.exp >= 100;

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
        atr === "S" || atr === "WYT"
          ? parseFloat(
              (
                checkIfNaN(
                  champ.base[atr as keyof Stats] + champ.add[atr as keyof Stats]
                ) / 10
              ).toFixed(0)
            )
          : checkIfNaN(
              champ.base[atr as keyof Stats] + champ.add[atr as keyof Stats]
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
    setAttribiute(atr);
    setShowModal(true);
  };

  const dispatchAction = () => {
    dispatch(championActions.changeChampionStat(attribiute, champ.user));
    showNotification({
      message: `${attribiute.toUpperCase()} + 1`,
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
              <th>Val</th>
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
