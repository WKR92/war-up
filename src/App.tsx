import Auth from "./auth/Auth";
import { MantineProvider } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/store/store";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "./firabase/sdk";
import * as userActions from "./redux/actions/user/userActions";
import ChampionDashboard from "./components/Champion/ChampionDashboard";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import MPDashboard from "./components/MP/MPDashboard";
import Shell from "./components/AppShell/Shell";
import Team from "./components/OtherChampions/Team";

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
