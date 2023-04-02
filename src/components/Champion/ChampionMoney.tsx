import * as championActions from "../../redux/actions/champion/championActions";

import {
  Box,
  Button,
  Group,
  Input,
  Modal,
  Text,
  createStyles,
} from "@mantine/core";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { Champion } from "../../Models/Models";
import { RootState } from "../../redux/store/store";
import { db } from "../../firabase/sdk";

const useStyles = createStyles(() => ({
  moneyBox: {
    marginRight: ".25rem",
  },
  btn: {
    width: "25px",
    color: "orange",
    textAlign: "center",
    cursor: "pointer",
  },
  group: {
    height: "36px",
    gap: "6px",
  },
  btnsGroup: {
    gap: "0px",
  },
  modalContentContainer: {
    width: "max-content",
  },
  moneyInput: {
    marginBottom: "1rem",
  },
}));

type IProps = {
  champ: Champion;
};

const ChampionMoney: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const canUserChangeChamp = user.email === champ.user && user.role === "BG";
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState("");
  const [money, setMoney] = useState(0);

  const updateMoneyInDb = async (operation: string) => {
    const docRef = doc(db, "Champions", champ.id);
    const data = {
      money:
        operation === "add"
          ? champ.money + money
          : champ.money - money <= 0
          ? 0
          : champ.money - money,
    };
    await updateDoc(docRef, data);
  };

  const updateMoney = () => {
    if (money > 0) {
      updateMoneyInDb(operation);
      dispatch(championActions.changeMoney(champ.user, operation, money));
    }
    closeModal();
  };

  const openModal = (op: "add" | "sub") => {
    setOperation(op);
    setShowModal(true);
  };

  const closeModal = () => {
    setOperation("");
    setMoney(0);
    setShowModal(false);
  };

  return (
    <Group className={classes.group}>
      <Text>Money:</Text>
      <Text className={classes.moneyBox}>{champ.money}g</Text>
      <Group className={classes.btnsGroup}>
        {canUserChangeChamp && (
          <Text className={classes.btn} onClick={() => openModal("add")}>
            +
          </Text>
        )}
        {canUserChangeChamp && (
          <Text className={classes.btn} onClick={() => openModal("sub")}>
            -
          </Text>
        )}
      </Group>
      <Modal
        centered
        withCloseButton={false}
        opened={showModal}
        onClose={closeModal}
        title={`How much money do you wan to ${
          operation === "add" ? "add" : "subtract"
        }`}
      >
        <Box className={classes.modalContentContainer}>
          <Input.Wrapper label="Input label" className={classes.moneyInput}>
            <Input
              placeholder=""
              type="number"
              value={money === 0 ? '' : money}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMoney(parseInt(event.currentTarget.value))
              }
            />
          </Input.Wrapper>
          <Group>
            <Button onClick={updateMoney}>
              {operation === "add" ? "Add" : "Subtract"}
            </Button>
            <Button onClick={closeModal}>No</Button>
          </Group>
        </Box>
      </Modal>
    </Group>
  );
};

export default ChampionMoney;
