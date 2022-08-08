import {
  Group,
  AppShell,
  Header,
  Burger,
  useMantineTheme,
  Text,
  Navbar,
  MediaQuery,
  NavLink,
  createStyles,
} from "@mantine/core";
import { IconChevronRight, IconActivity, IconLogout } from "@tabler/icons";
import { ReactNode, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { auth } from "../../firabase/sdk";
import { signOut } from "firebase/auth";
import * as userActions from "../../redux/actions/user/userActions";

const useStyles = createStyles(() => ({
  headerGroup: {
    gap: "5px",
    cursor: "pointer",
  },
  logOutHeaderGroup: {
    gap: "5px",
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "0",
  },
  headerMainContainer: {
    width: "100%",
  },
}));

type IProps = {
  children: ReactNode;
  id: string;
};

const Shell: React.FC<IProps> = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changePath = (path: string) => {
    navigate(path);
    setOpened(false);
  };

  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        dispatch(userActions.userLoggedOut());
        navigate("/");
        showNotification({
          message: "Successfully logged out",
          autoClose: 5000,
          color: "green",
        });
      })
      .catch((error) => {
        showNotification({
          message: error.message ? error.message : "Error",
          autoClose: 5000,
          color: "red",
        });
      });
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="xs"
      navbar={
        <MediaQuery query="(min-width: 400px)" styles={{ display: "none" }}>
          <Navbar p="xs" hiddenBreakpoint="xs" hidden={!opened}>
            <NavLink
              onClick={() => {
                changePath("/");
              }}
              label={user.role === "BG" ? "Your hero" : "War"}
              icon={<IconActivity size={16} stroke={2} />}
              rightSection={<IconChevronRight size={16} stroke={2} />}
            />
            <NavLink
              onClick={() => {
                changePath("/champions");
              }}
              label="Team"
              icon={<IconActivity size={16} stroke={2} />}
              rightSection={<IconChevronRight size={16} stroke={2} />}
            />
            <NavLink
              onClick={async () => {
                await logOut();
              }}
              label="Log out"
              icon={<IconLogout size={16} stroke={2} />}
              rightSection={<IconChevronRight size={16} stroke={2} />}
            />
          </Navbar>
        </MediaQuery>
      }
      header={
        <Header height={50} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery query="(min-width: 400px)" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <MediaQuery query="(max-width: 400px)" styles={{ display: "none" }}>
              <Group className={classes.headerMainContainer}>
                {user.role === "BG" ? (
                  <Group className={classes.headerGroup}>
                    <IconActivity size={16} stroke={2} />
                    <Text onClick={() => navigate("/")}>Your hero</Text>
                  </Group>
                ) : (
                  <Group className={classes.headerGroup}>
                    <IconActivity size={16} stroke={2} />
                    <Text onClick={() => navigate("/")}>War</Text>
                  </Group>
                )}
                <Group className={classes.headerGroup}>
                  <IconActivity size={16} stroke={2} />
                  <Text onClick={() => navigate("/champions")}>Team</Text>
                </Group>
                <Group className={classes.logOutHeaderGroup}>
                  <IconLogout size={16} stroke={2} />
                  <Text onClick={() => logOut()}>Log out</Text>
                </Group>
              </Group>
            </MediaQuery>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Shell;
