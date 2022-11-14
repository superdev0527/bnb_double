import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import styled from 'styled-components'


function ConnectMenu({ theme, width, height, setNotification }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const address = useAddress();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const sm = useMediaQuery("(max-width: 500px)");

  let ellipsis = address
    ? address.slice(0, 2) +
    "..." +
    address.substring(address.length - 4, address.length)
    : "Connect Wallet";

  let buttonText = sm ? 'Connect' : "Connect Wallet";
  let clickFunc = connect;

  function onConnect() {
    connect().then(msg => {
      if (msg.type === 'error') {
        setNotification(msg)
      }
    });
  }

  if (isConnected) {
    buttonText = 'Disconnect';
    clickFunc = disconnect;
  }


  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      className="wallet-menu"
      id="wallet-menu"
    >
      <ConnectButton
        onClick={() => isConnected ? disconnect() : onConnect()} >
        {buttonText}
      </ConnectButton>
    </div>
  );
}

const ConnectButton = styled(Box)`
  background-color: #f0b90b;
  border-radius: 8px;
  color: #262626;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  padding: 9px 12px;
  transition: all .3s ease-out;
  white-space: nowrap;
  cursor : pointer;
  :hover{
    background-color : #ffe389;
  }
`;


export default ConnectMenu;
