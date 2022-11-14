import { ethers } from "ethers";
import { MULTICALL_ADDR, STAKING_ADDR } from '../abis/address'
import MultiCallABI from '../abis/MultiCallABI.json'
import StakingABI from '../abis/StakingABI.json'

export const RPC_ENDPOINT = 'https://bsc-dataseed1.binance.org'

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

export const getContract = (abi, address, signer) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getMulticallContract = (chainId, signer) => {
  return getContract(MultiCallABI, MULTICALL_ADDR, signer)
}

export const getStakingContract = (signer) => {
  return getContract(StakingABI, STAKING_ADDR, signer)
}

export const multicall = async (abi, calls) => {
  try {
    const itf = new ethers.utils.Interface(abi)
    const multi = getMulticallContract();
    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])

    const { returnData } = await multi.aggregate(calldata)
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res
  } catch (error) {
    console.log(error);
  }
}