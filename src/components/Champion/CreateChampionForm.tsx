import React, { useEffect, useState, useRef } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  createStyles,
  Input,
  Table,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { IconTrash } from "@tabler/icons";
import {
  Champion,
  CreateChampFormTableElement,
  CreateChampionFormValues,
} from "../../Models/Models";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { showNotification } from "@mantine/notifications";
import { useForm, UseFormReturnType } from "@mantine/form";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firabase/sdk";

const useStyles = createStyles(() => ({
  outerContainer: {
    width: "90vw",
    margin: "auto",
  },
  table: {
    width: "100%",
  },
  submitBtn: {
    width: "100%",
    marginTop: "20px",
    marginBottom: "20px",
  },
  deleteIcon: {
    width: "20px",
    height: "20px",
    "&:hover": { cursor: "pointer" },
  },
}));

type IProps = {
  getChampions: () => void;
};

const CreateChampionForm: React.FC<IProps> = ({ getChampions }) => {
  const user = useSelector((state: RootState) => state.user);
  const { classes } = useStyles();
  const [elements, setElements] = useState([] as CreateChampFormTableElement[]);
  const [inventory, setInventory] = useState([] as string[]);
  const [abilities, setAbilities] = useState([] as string[]);
  const [skills, setSkills] = useState([] as string[]);
  const [item, setItem] = useState("");
  const [ability, setAbility] = useState("");
  const [skill, setSkill] = useState("");
  const skillInputRef = useRef() as React.RefObject<HTMLInputElement>;
  const itemInputRef = useRef() as React.RefObject<HTMLInputElement>;
  const abilityInputRef = useRef() as React.RefObject<HTMLInputElement>;
  const championsCollectionRef = collection(db, "Champions");

  const form = useForm<CreateChampionFormValues>({
    initialValues: {
      name: "",
      money: 13,
      skills: [],
      abilities: [],
      inventory: [],
      id: "",
      img: "",
      exp: 0,
      user: "",

      baseWW: 0,
      baseUS: 0,
      baseK: 0,
      baseODP: 0,
      baseZR: 0,
      baseINT: 0,
      baseSW: 0,
      baseOGL: 0,
      baseA: 0,
      baseZYW: 0,
      baseS: 0,
      baseWYT: 0,
      baseSZYB: 0,
      baseMAG: 0,
      basePO: 0,
      basePP: 0,

      addWW: 0,
      addUS: 0,
      addK: 0,
      addODP: 0,
      addZR: 0,
      addINT: 0,
      addSW: 0,
      addOGL: 0,
      addA: 0,
      addZYW: 0,
      addS: 0,
      addWYT: 0,
      addSZYB: 0,
      addMAG: 0,
      addPO: 0,
      addPP: 0,
    },
  });

  const prepareNotigication = (array: string) => {
    return showNotification({
      message: `${array} array can not be empty`,
      autoClose: 5000,
      color: "red",
    });
  };

  const saveChampionToFireStore = async (newChampion: Champion) => {
    if (newChampion) await addDoc(championsCollectionRef, newChampion);
    getChampions();
    return showNotification({
      message: `Champion created!`,
      autoClose: 5000,
      color: "cyan",
    });
  };

  const createChampion = (
    e: React.FormEvent,
    formValues: UseFormReturnType<CreateChampionFormValues>
  ) => {
    e.preventDefault();
    if (abilities.length === 0) {
      if (abilityInputRef.current !== null) abilityInputRef.current.focus();
      return prepareNotigication("abilities");
    }
    if (skills.length === 0) {
      if (skillInputRef.current !== null) skillInputRef.current.focus();
      return prepareNotigication("skills");
    }
    if (inventory.length === 0) {
      if (itemInputRef.current !== null) itemInputRef.current.focus();
      return prepareNotigication("inventory");
    }

    const values = formValues.values;
    const formatedSkills = skills.reduce((accumulator: any, value: string) => {
      return { ...accumulator, [value]: 0 };
    }, {});
    const newChampion: Champion = {
      name: values.name,
      money: values.money,
      skills: formatedSkills,
      abilities,
      inventory,
      base: {
        ww: values.baseWW,
        us: values.baseUS,
        k: values.baseK,
        odp: values.baseODP,
        zr: values.baseZR,
        int: values.baseINT,
        sw: values.baseSW,
        ogl: values.baseOGL,
        a: values.baseA,
        zyw: values.baseZYW,
        s: values.baseS,
        wyt: values.baseWYT,
        szyb: values.baseSZYB,
        mag: values.baseMAG,
        po: values.basePO,
        pp: values.basePP,
      },
      add: {
        ww: values.addWW,
        us: values.addUS,
        k: values.addK,
        odp: values.addODP,
        zr: values.addZR,
        int: values.addINT,
        sw: values.addSW,
        ogl: values.addOGL,
        a: values.addA,
        zyw: values.addZYW,
        s: values.addS,
        wyt: values.addWYT,
        szyb: values.addSZYB,
        mag: values.addMAG,
        po: values.addPO,
        pp: values.addPP,
      },
      id: "",
      img: values.img,
      exp: 0,
      user: user?.email ?? "",
    };

    saveChampionToFireStore(newChampion);
  };

  const rows = elements.map((element) => (
    <tr key={element.stat}>
      <td>{element.stat}</td>
      <td>{element.base}</td>
      <td>{element.development}</td>
    </tr>
  ));

  const createElement = (atr: string) => {
    return {
      stat: atr.toUpperCase(),
      development: (
        <Input
          type="number"
          required
          {...form.getInputProps(`add${atr.toUpperCase()}`)}
        />
      ),
      base: (
        <Input
          type="number"
          required
          {...form.getInputProps(`base${atr.toUpperCase()}`)}
        />
      ),
    };
  };

  useEffect(() => {
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
    const elements: CreateChampFormTableElement[] = [];
    order.forEach((atr) => elements.push(createElement(atr)));
    elements.sort(
      (a, b) =>
        order.indexOf(a.stat.toLowerCase()) -
        order.indexOf(b.stat.toLowerCase())
    );
    setElements(elements);
  }, [form.values]);

  const deleteElem = (elem: string, array: string) => {
    switch (array) {
      case "inventory":
        setInventory((current) => current.filter((item) => item !== elem));
        break;
      case "abilities":
        setAbilities((current) =>
          current.filter((ability) => ability !== elem)
        );
        break;
      case "skills":
        setSkills((current) => current.filter((skill) => skill !== elem));
        break;
    }
  };

  return (
    <Box className={classes.outerContainer}>
      <h2>Create Champion</h2>
      <form onSubmit={(e) => createChampion(e, form)}>
        <TextInput label="Name" required type="text" />
        <Box>
          <h3>Stats</h3>
          <Table highlightOnHover className={classes.table}>
            <thead>
              <tr>
                <th>Stats</th>
                <th>Base</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Box>
        <Box>
          <h3>Abilities</h3>
          {abilities.length > 0 && (
            <ul>
              {abilities.map((elem) => (
                <li key={uuidv4()}>
                  <Group>
                    {elem}
                    <IconTrash
                      size={16}
                      stroke={2}
                      onClick={() => deleteElem(elem, "abilities")}
                    />
                  </Group>
                </li>
              ))}
            </ul>
          )}
          <Group>
            <TextInput
              ref={abilityInputRef}
              type="text"
              placeholder="ability"
              value={ability}
              onChange={(event) => setAbility(event.currentTarget.value)}
            />
            <Button
              onClick={() => {
                ability !== ""
                  ? setAbilities((prevState) => [...prevState, ability])
                  : null;
                setAbility("");
              }}
            >
              Add
            </Button>
          </Group>
        </Box>
        <Box>
          <h3>Skills</h3>
          {skills.length > 0 && (
            <ul>
              {skills.map((elem) => (
                <li key={uuidv4()}>
                  <Group>
                    {elem}
                    <IconTrash
                      size={16}
                      stroke={2}
                      onClick={() => deleteElem(elem, "skills")}
                    />
                  </Group>
                </li>
              ))}
            </ul>
          )}
          <Group>
            <TextInput
              ref={skillInputRef}
              type="text"
              placeholder="skill"
              value={skill}
              onChange={(event) => setSkill(event.currentTarget.value)}
            />
            <Button
              onClick={() => {
                skill !== ""
                  ? setSkills((prevState) => [...prevState, skill])
                  : null;
                setSkill("");
              }}
            >
              Add
            </Button>
          </Group>
        </Box>
        <Box>
          <h3>Inventory</h3>
          {inventory.length > 0 && (
            <ul>
              {inventory.map((elem) => (
                <li key={uuidv4()}>
                  <Group>
                    {elem}
                    <IconTrash
                      size={16}
                      stroke={2}
                      onClick={() => deleteElem(elem, "inventory")}
                    />
                  </Group>
                </li>
              ))}
            </ul>
          )}
          <Group>
            <TextInput
              ref={itemInputRef}
              type="text"
              placeholder="item"
              value={item}
              onChange={(event) => setItem(event.currentTarget.value)}
            />
            <Button
              onClick={() => {
                item !== ""
                  ? setInventory((prevState) => [...prevState, item])
                  : null;
                setItem("");
              }}
            >
              Add
            </Button>
          </Group>
        </Box>
        <Box>
          <h3>Image</h3>
          <Group>
            <TextInput
              type="text"
              placeholder="image address"
              {...form.getInputProps("img")}
              required
            />
          </Group>
        </Box>
        <Box>
          <h3>Money</h3>
          <Group>
            <Input
              type="number"
              placeholder="number"
              required
              {...form.getInputProps("money")}
            />
          </Group>
        </Box>
        <Button className={classes.submitBtn} type="submit">
          Create Champion
        </Button>
      </form>
    </Box>
  );
};

export default CreateChampionForm;
