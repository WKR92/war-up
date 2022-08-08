import { Box, Button, Text, createStyles } from "@mantine/core";
import { openConfirmModal, closeAllModals } from "@mantine/modals";
import { useEffect, useRef } from "react";

const useStyles = createStyles(() => ({
  deleteChampBtn: {
    width: "140px",
  },
  container: {
    backgroundColor: '#1a1b1e',
    position: "absolute",
    top: "400vh",
    height: '60px',
  },
}));

type IPops = {
  onConfirm: () => void;
};

const DeleteChampionModal: React.FC<IPops> = ({ onConfirm }) => {
  const { classes } = useStyles();

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Delete hero",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete your champion?</Text>
      ),
      labels: { confirm: "Delete my hero", cancel: "Don't do it" },
      confirmProps: { color: "red" },
      onCancel: () => closeAllModals(),
      onConfirm: () => {
        onConfirm();
        closeAllModals();
      },
    });

  return (
    <Box className={classes.container}>
      <Button
        className={classes.deleteChampBtn}
        onClick={openDeleteModal}
        color="red"
      >
        Delete hero
      </Button>
    </Box>
  );
};

export default DeleteChampionModal;
