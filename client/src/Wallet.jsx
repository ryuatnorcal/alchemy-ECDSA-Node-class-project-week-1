import server from "./server";
import {secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const key = evt.target.value;
    setPrivateKey(key);
    const publicKey = secp256k1.getPublicKey(key);
    setAddress(toHex(publicKey));
    if (key) {
      const {
        data: { balance },
      } = await server.get(`balance/${toHex(publicKey)}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key 
        <input placeholder="Type an private key, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <label>Public Key: {address}</label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
