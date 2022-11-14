import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import styled from "styled-components";
import { ethers } from "ethers";

import { useWeb3Context } from "../../hooks/web3Context";

import { multicall, getStakingContract } from '../../utils/contracts'
import { STAKING_ADDR, MULTICALL_ADDR } from '../../abis/address'
import MultiCallABI from '../../abis/MultiCallABI.json';
import StakingABI from '../../abis/StakingABI.json';

let timerid = null, copytimerid = null;

const Landing = ({ account, setNotification, referer }) => {

  const sm = useMediaQuery("(max-width: 500px)");

  const { connect, hasCachedProvider, provider } = useWeb3Context();

  const [accountbalance, setAccountBalance] = useState(0);
  const [contractbalance, setContractBalance] = useState(0);
  const [userinfo, setUserInfo] = useState({
    totalActiveDeposits: 0,
    readyToWithdraw: 0,
    referals: 0,
    totalBonus: 0
  });

  const [pending, setPending] = useState(false);
  const [copypressed, setCopyPressed] = useState(false);
  const [amount, setAmount] = useState(0);
  const [maxpressed, setMaxPressed] = useState(false);

  async function fetchData() {
    try {
      let calls = [{
        address: MULTICALL_ADDR,
        name: 'getEthBalance',
        params: [STAKING_ADDR],
      }];
      if (account) {
        calls.push(
          {
            address: MULTICALL_ADDR,
            name: 'getEthBalance',
            params: [account],
          }
        )
      }
      let result = await multicall(MultiCallABI, calls);
      setContractBalance(Number(ethers.utils.formatEther(result[0][0])));
      setAccountBalance(account ? result[1][0] : 0);
      if (account) {
        calls = [{
          address: STAKING_ADDR,
          name: 'getUserInfo',
          params: [account],
        }];
        result = await multicall(StakingABI, calls);
        console.log(result);
        setUserInfo({
          totalActiveDeposits: Number(ethers.utils.formatEther(result[0].totalActiveDeposits)),
          readyToWithdraw: Number(ethers.utils.formatEther(result[0].readyToWithdraw)),
          referals: result[0].referals / 1,
          totalBonus: Number(ethers.utils.formatEther(result[0].totalBonus))
        })
      }
      else {
        setUserInfo({
          totalActiveDeposits: 0,
          readyToWithdraw: 0,
          referals: 0,
          totalBonus: 0
        })
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const onCopyLink = () => {
    if (!account) return;
    setCopyPressed(true);
    const el = document.createElement('textarea');
    el.value = `https://ETH2XTREME.finance/r/${account}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const onInvest = async () => {
    setPending(true);
    try {
      console.log(referer);
      const stakingContract = getStakingContract(provider.getSigner());
      const value = !maxpressed ? ethers.utils.parseEther(amount.toString()) : accountbalance;
      const tx = await stakingContract.invest(
        referer ? referer : '0x0000000000000000000000000000000000000000',
        { value }
      );
      await tx.wait();
    }
    catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }


  const onReInvest = async () => {
    setPending(true);
    try {
      const stakingContract = getStakingContract(provider.getSigner());
      const tx = await stakingContract.reinvest();
      await tx.wait();
    }
    catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  const onWithdraw = async () => {
    setPending(true);
    try {
      const stakingContract = getStakingContract(provider.getSigner());
      const tx = await stakingContract.withdraw();
      await tx.wait();
    }
    catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  useEffect(() => {
    fetchData();
    if (timerid)
      clearInterval(timerid);
    timerid = setInterval(() => {
      fetchData();
    }, 5000);
  }, [account])

  useEffect(() => {
    if (!copypressed) return;
    if (copytimerid)
      clearTimeout(copytimerid);
    copytimerid = setTimeout(function () {
      setCopyPressed(false);
    }, 1000)
  }, [copypressed])

  const figureError = (error) => {
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      const list = error.message.split(',');
      for (let i = 0; i < list.length; i++) {
        if (list[i].includes('message')) {
          let msg = String(list[i]).replaceAll('"', '');
          msg.replaceAll('"\"', '');
          msg.replaceAll('message:', '');
          msg.replaceAll('}', '');
          setNotification({ type: 'error', title: msg.split(':')[1].toUpperCase(), detail: msg.split(':')[2] })
          break;
        }
      }
    }
    else
      setNotification({ type: 'error', title: 'Error', detail: error.message })
  }

  return (
    <StyledContainer>
      <Box>
        <Box fontSize={sm ? '16px' : '24px'} textAlign={'center'}>
          Stake BNB to get daily passive rewards using ETH2x - safe verified audited smart contract built on BSC Network.
        </Box>

        <Box padding={'8px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} bgcolor={'#262626'} borderRadius={'8px'} mt={'24px'}>
          <Box width={sm ? '24px' : '32px'} height={sm ? '24px' : '32px'}>
            <img src={'/images/home.svg'} width={'100%'} height={'100%'} />
          </Box>
          <Box color={'#f0b90b'} fontSize={sm ? '14px' : '20px'} fontWeight={'600'}>Dashboard</Box>
          <Box />
        </Box>
        <Panel>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box>Contract</Box>
            <Box fontWeight={600}>{contractbalance.toFixed(2)} BNB</Box>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={'24px'}>
            <Box>Wallet</Box>
            <Box fontWeight={600}>{Number(ethers.utils.formatEther(accountbalance)).toFixed(2)} BNB</Box>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={'24px'}>
            <Box>Your Double</Box>
            <Box fontWeight={600}>{userinfo.totalActiveDeposits.toFixed(2)} BNB</Box>
          </Box>
          <StyledInput>
            <input type={'text'} placeholder={0.00} value={amount} onChange={(e) => {
              setAmount(e.target.value);
              setMaxPressed(false);
            }} />
            <MaxButton onClick={() => {
              setMaxPressed(true);
              setAmount(Number(ethers.utils.formatEther(accountbalance)).toFixed(4))
            }}>MAX</MaxButton>
          </StyledInput>
          <Box mt={'12px'}>
            <StyledButton
              onClick={() => onInvest()} disabled={pending || !Number(amount)}
            >
              Double Your BNB
            </StyledButton>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={'24px'}>
            <Box>Your Earnings</Box>
            <Box fontWeight={600}>{userinfo.readyToWithdraw.toFixed(4)} BNB</Box>
          </Box>
          <Box mt={'24px'}>
            <StyledButton
              disabled={pending || !userinfo.totalActiveDeposits}
              onClick={() => onReInvest()}
            >
              Double Earnings
            </StyledButton>
          </Box>
          <Box mt={'12px'}>
            <StyledButton
              disabled={pending || !userinfo.totalActiveDeposits}
              onClick={() => onWithdraw()}
            >
              Withdraw Earnings
            </StyledButton>
          </Box>
        </Panel>
        <Box mt={'24px'} fontSize={sm ? '16px' : '24px'} textAlign={'center'}>
          6.66% Daily Return for 30 days - 200% ROI<br style={{ display: sm ? 'none' : 'block' }} />
          (no limits, deposit any amount any times)
        </Box>
        <Box mt={'24px'} fontSize={sm ? '16px' : '24px'} textAlign={'center'}>
          10% Referral Reward | 10% Dev fee (not affect on your deposit and earnings amount)
        </Box>
        <Box mt={'24px'}>
          <a href={`https://etherscan.io/address/${STAKING_ADDR}#code`} target={'_blank'}>
            <StyledButton>Verified Contract</StyledButton>
          </a>
        </Box>
        <Box mt={'12px'}>
          <StyledButton>Documentation</StyledButton>
        </Box>
        <Box mt={'12px'}>
          <StyledButton>Security Audit</StyledButton>
        </Box>

        <Box padding={'8px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} bgcolor={'#262626'} borderRadius={'8px'} mt={'24px'}>
          <Box width={sm ? '24px' : '32px'} height={sm ? '24px' : '32px'}>
            <img src={'/images/link.svg'} width={'100%'} height={'100%'} />
          </Box>
          <Box color={'#f0b90b'} fontSize={sm ? '14px' : '20px'} fontWeight={'600'}>Referral Link</Box>
          <Box />
        </Box>
        <Panel>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box>Invited</Box>
            <Box fontWeight={600}>{userinfo.referals} Users</Box>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={'24px'}>
            <Box>Earned</Box>
            <Box fontWeight={600}>{userinfo.totalBonus.toFixed(4)} BNB</Box>
          </Box>
          <StyledInput border={'1px solid rgb(150,150,150)'} style={{ padding: '0 0 0 12px' }} alignItems={'center'}>
            <Box width={'100%'} >{account ? copypressed ? 'Copied' : 'Copy Link' : 'Connet Wallet'}</Box>
            <CopyButton onClick={() => onCopyLink()}>
              <img src={'/images/copy.svg'} width={sm ? '14px' : '24px'} height={sm ? '20px' : '30px'} />
            </CopyButton>
          </StyledInput>
          <Box mt={'24px'} fontSize={sm ? '14px' : '20px'} textAlign={'center'}>
            Get 10% of the BNB used to double from anyone who uses your referral link
          </Box>
        </Panel>
        <Socials mt={'24px'}>
          <a>
            <Box>
              <img src={'/images/youtube.svg'} width={'100%'} heightt={'100%'} />
            </Box>
          </a>
          <a>
            <Box>
              <img src={'/images/twitter.svg'} width={'100%'} heightt={'100%'} />
            </Box>
          </a>
          <a href={'https://t.me/ETHEREUM2XOFFICIAL'} target={'_blank'}>
            <Box>
              <img src={'/images/telegram.svg'} width={'100%'} heightt={'100%'} />
            </Box>
          </a>
        </Socials>
      </Box>
    </StyledContainer>
  );
};

const Socials = styled(Box)`
  display : flex;
  width : fit-content;
  margin : 0 auto;
  >a>div{
    width : 48px;
    height : 48px;
    margin : 0 12px;
    cursor : pointer;
    transition : all 0.5s;
    :hover{
      transform : scale(1.1,1.1);
    }
    @media screen and (max-width : 500px){
      width : 36px;
      height : 36px;
    }
  }
`;
const CopyButton = styled(Box)`
  cursor : pointer;
  width : 48px;
  height : 48px;
  background-color : #f0b90b;
  border-radius : 8px;
  display : flex;
  justify-content : center;
  align-items : center;
  >img{
    transition : all 0.5s;
  }
  :hover{
    >img{
      transform : scale(1.1,1.1);
    }
  }
  @media screen and (max-width : 500px){
    width : 36px;
    height : 36px;
  }
`;

const StyledButton = styled.button`
  background-color: #f0b90b;
  border-radius: 8px;
  font-weight: 600;
  line-height: 24px;
  padding: 13px;
  transition: all .3s ease-out;
  width: 100%;
  :hover{
    background-color : #ffe389;
  }
  border: none;
  font-size : 20px;
  cursor : pointer;
  font-family : 'Inter';
  :disabled{
    background-color : rgba(38,38,38,.2);
  }
  color : #262626;
  @media screen and (max-width:500px){
    font-size : 14px;
    line-height : 14px;
  }
`;

const MaxButton = styled(Box)`
  color : #ff2100;
  cursor : pointer;
  @media screen and (max-width : 500px){
    line-height : 14px;
    font-size : 14px;
  }
`;

const StyledInput = styled(Box)`
  display : flex;
  background-color: #fff;
  border: 0.5px solid #f0b90b;
  border-radius: 8px;
  display: flex;
  line-height: 24px;
  margin-top: 24px;
  padding: 12px;
  width: 100%;
  font-weight : 600;
  >input{
    font-size : 20px;
    font-weight : 600;
    width : 100%;
    background : transparent;
    border : none;
    font-family : 'Inter';
    color : #262626;
    @media screen and (max-width : 500px){
      font-size : 14px;
    }
  }
`;

const Panel = styled(Box)`
  background-color  : rgba(220, 220, 220, 0.8);
  padding : 16px 24px 24px;
  border-radius : 8px;
  font-size : 20px;
  color : #262626;
  @media screen and (max-width : 500px){
    font-size : 14px;
    padding : 16px 12px 12px;
  }
`;

const StyledContainer = styled(Box)`
  color : #f0f0f0;
  width : 100%;
  min-height : 100vh;
  margin : 0 auto;
  padding-top : 100px;
  backdrop-filter : blur(10px);
  padding-bottom : 70px;
  >div{
    width : 100%;
    max-width : 550px;
    margin : 0 auto;
    padding : 0 10px;
  }
`;

export default Landing;