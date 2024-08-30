"use client";
import Web3Modal from "web3modal";
import { useState, ChangeEvent, useEffect } from "react";
import { ethers } from "ethers";

const swapContractAddress = "";
const usdtAddress = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9";
const usdcAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const daiAddress = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";

const providerOptions = {};

export default function Home() {
  let [signer, setSigner] = useState("");
  let [isConnected, setConnection] = useState(false);
  let [walletAddress, setWalletAddress] = useState();
  let [isOpen, setIsOpen] = useState(false);
  let tokenFrom;
  let tokenTo;
  let amount;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemFromTokenName = (item) => {
    tokenFrom = item;
    console.log(`You clicked on ${tokenFrom}`);
    setIsOpen(false);
  };

  const handleItemToTokenName = (item) => {
    tokenTo = item;
    console.log(`You clicked on ${tokenTo}`);
    setIsOpen(false);
  };

  async function connectWallet() {
    try {
      let web3modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });

      const web3ModalInstance = await web3modal.connect();
      const web3ModalProvider = new ethers.BrowserProvider(web3ModalInstance);
      const signer = await web3ModalProvider.getSigner();
      const balance = await web3ModalProvider.getBalance(signer.address);
      const network = await web3ModalProvider.getNetwork();

      if (signer) {
        setConnection(true);
        setSigner(signer.address);
      }
      await setWalletAddress(signer.address);
      console.log(walletAddress);
    } catch (error) {
      console.log(error);
    }
  }

  async function swap() {
    const abiFile = await fetch("/.json");
    const parsedAbiFile = await abiFile.json();
    const abi = parsedAbiFile.abi;

    const provider = signer.provider;

    const contract = new ethers.Contract(swapContractAddress, abi, provider);
    let tokenFromAdd = "";
    let tokenToAdd = "";

    if (tokenFrom == "USDT") tokenFromAdd = usdtAddress;
    else if (tokenFrom == "DAI") tokenFromAdd = daiAddress;
    else tokenFromAdd = usdcAddress;

    if (tokenTo == "USDT") tokenToAdd = usdtAddress;
    else if (tokenTo == "DAI") tokenToAdd = daiAddress;
    else tokenToAdd = usdcAddress;

    let res = await contract.swap(tokenFromAdd, tokenToAdd, amount, 0);

    console.log(res);
  }

  const handleAmountChange = (item) => {
    amount = item.target.value;
    console.log(amount);
  };

  return (
    <main>
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full"
        onClick={connectWallet}
      >
        Connect
      </button>
      <div className="slide-down-container">
        <button onClick={toggleDropdown} className="slide-down-button">
          Select Token
        </button>
        {isOpen && (
          <div className="slide-down-content">
            <ul>
              <li onClick={() => handleItemFromTokenName("USDT")}>USDT</li>
              <li onClick={() => handleItemFromTokenName("DAI")}>DAI</li>
              <li onClick={() => handleItemFromTokenName("USDC")}>USDC</li>
            </ul>
          </div>
        )}
      </div>
      <input
        type="number"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={handleAmountChange}
      />

      <div className="slide-down-container">
        <button onClick={toggleDropdown} className="slide-down-button">
          Select Token
        </button>
        {isOpen && (
          <div className="slide-down-content">
            <ul>
              <li onClick={() => handleItemToTokenName("USDT")}>USDT</li>
              <li onClick={() => handleItemToTokenName("DAI")}>DAI</li>
              <li onClick={() => handleItemToTokenName("USDC")}>USDC</li>
            </ul>
          </div>
        )}
      </div>

      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full"
        onClick={swap}
      >
        Swap
      </button>
    </main>
  );
}
