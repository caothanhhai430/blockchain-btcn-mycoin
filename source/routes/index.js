const router = require('express')();
const bodyParser = require('body-parser');
const SocketActions = require('../src/constants');
const Blockchain = require('../src/Blockchain');
const Block = require('../src/Block');
const PORT = 3000;
var app = require('../app');
const httpServer = require('http').Server(app);
const axios = require('axios');
const client = require('socket.io-client');
const socketListeners = require('../src/socketListeners');



let mycoins = new Blockchain();

console.log("mycoins mining in progress....");

mycoins.addNewBlock(
  new Block(1, "01/06/2020", {
    sender: "Iris Ljesnjanin",
    recipient: "Cosima Mielke",
    quantity: 50
  })
);

mycoins.addNewBlock(
  new Block(2, "01/07/2020", {
    sender: "Vitaly Friedman",
    recipient: "Ricardo Gimenes",
    quantity: 100
  })
);


/* GET home page. */
router.get('/', function (req, res, next) {
  socketListeners(client(`http://localhost:3000`), mycoins);
  res.send({ res: JSON.stringify(mycoins, null, 4) });
});



router.post('/nodes', (req, res) => {
  const { host, port } = req.body;
  const { callback } = req.query;
  mycoins.addNewBlock({});
  if (callback === 'true') {
    console.info(`Added node ${node} back`);
    res.json({ status: 'Added node Back' }).end();
  } else {
    axios.post(`${node}/nodes?callback=true`, {
      host: req.hostname,
      port: PORT,
    });
    console.info(`Added node ${node}`);
    res.json({ status: 'Added node' }).end();
  }
});

router.post('/transaction', (req, res) => {
  const { sender, receiver, amount } = req.body;
  console.log({ sender, receiver, amount });
  socketListeners(client(`http://localhost:3000}`), mycoins);
  setTimeout(() => {
    io.emit(SocketActions.ADD_TRANSACTION, sender, receiver, amount);
  }, 2000)
  res.json({ message: 'transaction success' }).end();
});

router.get('/chain', (req, res) => {
  res.json(mycoins.toArray()).end();
});

module.exports = router;
