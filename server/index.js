const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const JSONbig = require("json-bigint");

app.use(cors());
app.use(express.json());
// public keys
const balances = {
  "02dcb1d2d474b2d0285e949ce6338d2a2dd8e75cd61d8e46b1fafd1cfedec90b22": 100,
  "03c2c43026ddbfc0e9f8386875a45adf2836fed23f8fa2609b542c6ad4e2cb34eb": 50,
  "025bd2a0696a76306359f788697d252d9d09855ea20522525a7fa87dd162a4a185": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // Signature from client app
  // recover public key from signature
  console.log(req.body);

  const { sender, recipient, amount, signature, msgHash  } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  /**** [Problem]
  * Since I couldn't send BigInt as is, I used json-bigint, 
  * However, there is limitation that mentioned in the npm page
  * https://www.npmjs.com/package/json-bigint#limitations
  * 
  * signature loses 'n' from digit as the result, I cannot match the signature
  * with secp256k1.verify method.
  ****/ 
  const parsedSignature = JSONbig.parse(signature)

  const isSigned = secp256k1.verify(parsedSignature, msgHash, sender) 
 
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if(isSigned) {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  } else {
    res.status(401).send({ message: "Invalid signature!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
