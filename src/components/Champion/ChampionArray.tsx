import { ReactNode, useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Group,
  Box,
  createStyles,
  Modal,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import * as championActions from "../../redux/actions/champion/championActions";
import { Champion } from "../../Models/Models";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons";

const useStyles = createStyles(() => ({
  container: {
    border: '1px solid orange',
    borderRadius: '5px',
    marginBottom: '1rem',
    padding: '1rem'
  },
  arrayItem: {
    maxWidth: '80%'
  },
  deleteIcon: {
    width: "20px",
    height: "20px",
    "&:hover": { cursor: "pointer" },
  },
  modalContentContainer: {
    width: "max-content",
    margin: "auto",
  },
  showBtn: {
    marginBottom: '.5rem',
    width: '140px'
  },
  textInput: {
    width: "150px",
  },
}));

interface IProps {
  champ: Champion;
  arrayName: string;
}

const ChampionArray: React.FC<IProps> = ({ champ, arrayName }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [showArray, setShowArray] = useState(false);
  const [arrayItem, setArrayItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [skill, setSkill] = useState("");
  const [improve, setImprove] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const array = champ[arrayName as keyof typeof champ] as string[];
  const expRule = parseFloat(champ.exp) < 100
  const addItemRule =
    arrayName === "inventory"
      ? user.email === champ.user && user.role === "BG"
      : user.email === champ.user && user.role === "BG" && parseFloat(champ.exp) >= 100;

  const dispatchAction = () => {
    switch (arrayName) {
      case "abilities": {
        const abilities = champ.abilities;
        if (abilities.includes(arrayItem)) {
          showNotification({
            message: "You have such ability already",
            autoClose: 5000,
            color: "red",
          });
          return setShowModal(false);
        }
        dispatch(championActions.addItem(champ.user, arrayName, arrayItem));
        showNotification({
          message: "Skill added",
          autoClose: 5000,
          color: "cyan",
        });
        break;
      }
      case "skills": {
        const skills = Object.keys(champ.skills);
        if (improve) {
          if (champ.skills[skill as keyof typeof skills] === 30) {
            showNotification({
              message: "You can't exceed 30 bonus",
              autoClose: 5000,
              color: "red",
            });
            setImprove(false);
            return setShowModal(false);
          }
          if (!skills.includes(skill)) {
            showNotification({
              message: "You can't improve skill you don't have",
              autoClose: 5000,
              color: "red",
            });
            console.log(skills[skill as keyof typeof skills]);

            setImprove(false);
            return setShowModal(false);
          }
          dispatch(championActions.improveSkill(champ.user, skill));
          showNotification({
            message: `${skill} improved by 10`,
            autoClose: 5000,
            color: "cyan",
          });
          setImprove(false);
        } else {
          if (skills.includes(arrayItem)) {
            showNotification({
              message: "You have such skill already",
              autoClose: 5000,
              color: "red",
            });
            return setShowModal(false);
          }
          dispatch(championActions.addSkill(champ.user, arrayItem));
          showNotification({
            message: "Skill added",
            autoClose: 5000,
            color: "cyan",
          });
        }
        setShowModal(false);
        break;
      }
      case "inventory": {
        dispatch(championActions.addItem(champ.user, arrayName, arrayItem));
        showNotification({
          message: "Item added",
          autoClose: 5000,
          color: "cyan",
        });
        break;
      }
    }

    setArrayItem("");
    setSkill("");
    setShowModal(false);
  };

  const verification = (toggleImprove = false) => {
    if (toggleImprove === false && arrayItem === "") return;
    if (toggleImprove === true && skill === "") return;
    if (arrayName !== "inventory" && expRule)
      return showNotification({
        message: "You don't have enough exp",
        autoClose: 5000,
        color: "red",
      });

    console.log("verification called");

    switch (arrayName) {
      case "abilities": {
        if (expRule) return;
        setShowModal(true);
        break;
      }
      case "skills": {
        if (expRule) {
          if (improve) setImprove(false);
          return;
        }
        if (toggleImprove) setImprove(true);
        setShowModal(true);
        break;
      }
      case "inventory": {
        dispatchAction();
        break;
      }
    }
  };

  return (
    <Box className={showArray ? classes.container : undefined}>
      <Button className={classes.showBtn} onClick={() => setShowArray(!showArray)}>
        {!showArray ? "Show" : "Close"} {arrayName}
      </Button>
      {showArray && (
        <Box>
          <ul>
            {arrayName === "skills" &&
              Object.keys(array).map((key: string) => (
                <li key={uuidv4()}>
                  <Text>{key}</Text>
                  <Text>
                    Bonus: {array[key as keyof typeof array] as ReactNode}
                  </Text>
                </li>
              ))}
            {arrayName !== "skills" &&
              array.map((item: string) => (
                <li key={uuidv4()}>
                  <Group>
                    <Text className={classes.arrayItem}>{item}</Text>{" "}
                    {addItemRule && (
                      <IconTrash
                        size={16}
                        stroke={2}
                        onClick={() => {
                          dispatch(
                            championActions.removeItem(
                              champ.user,
                              arrayName as keyof Champion,
                              item
                            )
                          );
                          showNotification({
                            message: "Item deleted",
                            autoClose: 5000,
                            color: "red",
                          });
                        }}
                      />
                    )}
                  </Group>
                </li>
              ))}
          </ul>

          {addItemRule && (
            <Box>
              <p>Add to {arrayName}:</p>
              <Group>
                <TextInput
                  className={classes.textInput}
                  placeholder={
                    arrayName === "inventory"
                      ? "new item"
                      : arrayName === "skills"
                      ? "new skill"
                      : "new ability"
                  }
                  value={arrayItem}
                  onChange={(event) => setArrayItem(event.currentTarget.value)}
                />
                <Button onClick={() => verification()}>Add</Button>
              </Group>
            </Box>
          )}
          {(addItemRule && arrayName === 'skills') && (
            <Box>
              <p>Improve skill:</p>
              <Group>
                <TextInput
                  className={classes.textInput}
                  placeholder="skill name"
                  value={skill}
                  onChange={(event) => setSkill(event.currentTarget.value)}
                />
                <Button
                  onClick={() => {
                    setImprove(true);
                    verification(true);
                  }}
                >
                  Imp
                </Button>
              </Group>
            </Box>
          )}
        </Box>
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

export default ChampionArray;
