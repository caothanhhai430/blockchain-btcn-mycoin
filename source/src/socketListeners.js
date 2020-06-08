const SocketActions = require('./constants');
const Transaction = require('./transaction');
const Blockchain = require('./Blockchain');

const socketListeners = (socket, chain) => {
  // console.log(socket);
  console.log(chain);
  socket.on(SocketActions.ADD_TRANSACTION, (sender, receiver, amount) => {
    console.log(SocketActions.ADD_TRANSACTION);
    const transaction = new Transaction(sender, receiver, amount);
    chain.newTransaction(transaction);
    console.info(`Added transaction: ${JSON.stringify(transaction.getDetails(), null, '\t')}`);
  });

  socket.on(SocketActions.END_MINING, (newChain) => {
    console.log('End Mining encountered');
    console.log(SocketActions.END_MINING);
    process.env.BREAK = true;
    const blockChain = new Blockchain();
    blockChain.parseChain(newChain);
    if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
      chain.blocks = blockChain.blocks;
    }
  });

  return socket;
};

module.exports = socketListeners;
