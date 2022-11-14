import { useEffect, useState, useCallback, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation, useHistory } from "react-router-dom";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import { Box } from "@material-ui/core";
import { useParams } from "react-router-dom";

import TopBar from "./components/TopBar/TopBar";
import Landing from './views/Landing/Landing'
import { ethers } from "ethers";

import "./style.scss";
import Notification from "./components/Notification";
import styled from "styled-components";


function App() {
  const { connect, hasCachedProvider } = useWeb3Context();
  const address = useAddress();

  const [notification, setNotification] = useState(null);
  const [referer, setReferer] = useState(null);


  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(msg => {
        if (msg.type === 'error') {
          setNotification(msg)
        }
      });

    } else {
      // then user DOES NOT have a wallet
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
  }, []);

  const href = location.href;

  useEffect(() => {
    if (!href) return;
    console.log(href);
    const strlist = href.split('r/');
    console.log(strlist);
    if (strlist.length && ethers.utils.isAddress(strlist[strlist.length - 1])) {
      setReferer(strlist[strlist.length - 1]);
    }
  }, [href])
  return (
    <Router>
      <StyledContainer>
        <TopBar setNotification={setNotification} />

        <Switch>

          <Route exact path="/">
            <Landing
              account={address}
              setNotification={setNotification}
              referer={referer}
            />

          </Route>

          <Route exact path="/r/:id">
            <Redirect to={'/'} />
          </Route>
        </Switch>
        <Notification data={notification} />
      </StyledContainer>
    </Router>
  );
}

const StyledContainer = styled(Box)`
  background-image : url('/images/back.png');
  width : 100%;
  min-height : 100vh;
  background-size : 100% 100%;
`
export default App;
