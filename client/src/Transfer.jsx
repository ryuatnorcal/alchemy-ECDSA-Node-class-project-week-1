import { useState } from "react";
import server from "./server";
import JSONbig from 'json-bigint';
import { sha256 } from "ethereum-cryptography/sha256";
import {secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

 function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
console.log('public',address, 'private',privateKey)
  async function transfer(evt) {
    evt.preventDefault();
    const msgHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28"
    console.log(msgHash)
    const signature = secp256k1.sign(msgHash, privateKey)
    console.log('signature', signature.r, signature.s, signature.recovery)
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: JSONbig.stringify(signature)
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
