import React, { useState } from "react";
import { Champion } from "../../Models/Models";
import { Box, Button, createStyles, Group, TextInput } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firabase/sdk";
import { showNotification } from "@mantine/notifications";
import { changeImage } from "../../redux/actions/champion/championActions";

const useStyles = createStyles(() => ({
  heroImg: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  container: {
    border: "1px solid orange",
    borderRadius: "5px",
    marginBottom: "1rem",
    padding: "1rem",
  },
  showBtn: {
    marginBottom: ".5rem",
    width: "140px",
  },
  imageInputGroup: {
    marginTop: "1rem",
  },
  imageInput: {
    width: "140px",
  },
}));

type IProps = {
  champ: Champion;
};

const ChampionImage: React.FC<IProps> = ({ champ }) => {
  const user = useSelector((state: RootState) => state.user);
  const { classes } = useStyles();
  const [openImage, setOpenImage] = useState(false);
  const [img, setImg] = useState("");
  const canUserChangeChamp = user.email === champ.user && user.role === "BG";
  const dispatch = useDispatch();

  const changeHeroImageInDb = async () => {
    const docRef = doc(db, "Champions", champ.id);
    await updateDoc(docRef, { img })
      .then(() =>
        showNotification({
          message: `Hero image changed`,
          autoClose: 5000,
          color: "cyan",
        })
      )
      .catch((error) =>
        showNotification({
          message: error.message,
          autoClose: 5000,
          color: "red",
        })
      );

    setImg("");
  };

  return (
    <Box className={openImage ? classes.container : undefined}>
      <Button
        className={classes.showBtn}
        onClick={() => setOpenImage(!openImage)}
      >
        Show Image
      </Button>
      {openImage && (
        <Box>
          <img className={classes.heroImg} src={champ.img} alt="hero" />
          {canUserChangeChamp && (
            <Group className={classes.imageInputGroup}>
              <TextInput
                className={classes.imageInput}
                type="text"
                placeholder="image address"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                required
              />
              <Button
                onClick={() => {
                  img !== '' && dispatch(changeImage(champ.id, img));
                  img !== '' && changeHeroImageInDb();
                }}
              >
                Change
              </Button>
            </Group>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ChampionImage;
