import * as userActions from "./redux/actions/user/userActions";

import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Auth from "./auth/Auth";
import Card from "./components/Cards/Card";
import ChampionDashboard from "./components/Champion/ChampionDashboard";
import Dices from "./components/dices/Dices";
import MPDashboard from "./components/MP/MPDashboard";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { RootState } from "./redux/store/store";
import Shell from "./components/AppShell/Shell";
import Team from "./components/OtherChampions/Team";
import { auth } from "./firabase/sdk";
import { useEffect } from "react";

function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) dispatch(userActions.userLoggedIn(user));
    });
  }, []);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ModalsProvider>
        <NotificationsProvider position="top-right" zIndex={2077} limit={5}>
          {Object.keys(user).length === 0 ? (
            <Auth />
          ) : (
            <Router>
              <Shell id='shell'>
                <Routes>
                  {user.role === "BG" ? (
                    <Route path="/" element={<ChampionDashboard />}></Route>
                  ) : (
                    <Route path="/" element={<MPDashboard />}></Route>
                  )}
                  <Route path="/champions" element={<Team />}></Route>
                  <Route path="/cards" element={<Card />}></Route>
                  <Route path="/dices" element={<Dices />}></Route>
                  <Route path="/stats" element={<Team />}></Route>
                </Routes>
              </Shell>
            </Router>
          )}
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
