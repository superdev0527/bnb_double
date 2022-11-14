import { AppBar, Toolbar, Box, Button, SvgIcon } from "@material-ui/core";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from 'styled-components'
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { GiHamburgerMenu } from 'react-icons/gi'
import "./topbar.scss";


function TopBar({ theme, setNotification }) {

  const dialog = useRef();

  useEffect(() => {
    document.addEventListener('mouseup', function (event) {
      if (dialog.current && !dialog.current.contains(event.target)) {
        setHamburgerOpen(false);
      }
    });
  }, []);


  return (
    <StyledContainer >
      <Box display={'flex'} alignItems={'center'}>
        <Box width={'94px'} height={'48px'} style={{ cursor: 'pointer' }}>
          <img src={'/logotext.png'} width={'100%'} height={'100%'} />
        </Box>
      </Box>
      <ConnectMenu setNotification={setNotification} />
    </StyledContainer >
  );
}


const StyledContainer = styled(Box)`
    background-color : #151824fa;
    width : 100%;
    display : flex;
    justify-content : space-between;
    align-items : center;
    padding : 12px 24px;
    position : fixed;
    top : 0;
    left : 0;
    z-index : 10;
`;

export default TopBar;
