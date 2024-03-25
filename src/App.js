import "./App.css";

import { createDAppStoreClient } from "@evmos/dappstore-sdk";
import { useState, useEffect } from "react";

export const dappstore = createDAppStoreClient();

// Erc20 Balance function
const balanceOf = "0x70a08231";
const offset = "000000000000000000000000";

async function getErc20Balance(wallet, contract, decimals = 6) {
  const params = [
    {
      to: contract,
      data: balanceOf + offset + wallet.replace("0x", ""),
    },
    "latest",
  ];
  try {
    const balance = await dappstore.provider.request({
      method: "eth_call",
      params,
    });
    return Number(balance) / 10 ** decimals;
  } catch (e) {
    console.error(e);
  }
  return 0;
}

// Frontend
function App() {
  const [wallet, setWallet] = useState("");
  const [erc20contract, setErc20Contract] = useState(
    "0xf1faE9eC886C5F6E4ea13dA2456087Bd72F02cD1",
  );
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    dappstore.onAccountsChange((accounts) => setWallet(accounts[0]));
  }, []);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        margin: "0px 0px",
        padding: "0px 0px",
      }}
    >
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <p style={{ fontWeight: "bolder" }}>User Wallet:</p>
        <p
          style={{
            paddingBottom: "30px",
          }}
        >
          {wallet}
        </p>

        <input
          style={{
            padding: "10px 20px",
            border: "none",
            border: "3px solid #555",
            fontSize: "14px",
          }}
          type="text"
          onChange={(e) => setErc20Contract(e.target.value)}
          value={erc20contract}
        />
        <button
          style={{
            backgroundColor: "#04AA6D",
            border: "none",
            color: "white",
            margin: "10px 0px",
            padding: "10px 32px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
          }}
          onClick={async () => {
            setBalance(await getErc20Balance(wallet, erc20contract));
          }}
        >
          Check balance
        </button>
        <p style={{ fontWeight: "bolder", paddingTop: "30px" }}>Balance:</p>
        <p style={{ fontSize: "30px" }}>{balance}</p>
      </div>
    </div>
  );
}

export default App;
