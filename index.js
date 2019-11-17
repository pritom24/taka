const sha256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return sha256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(
      "Mining Completed " + this.hash + " and nonce is " + this.nonce
    );
  }
}
class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}
class BlockChain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 5;
    this.pendingTransactions = [];
  }

  generateGenesisBlock() {
    return new Block(Date.now(), "GENESIS", "0000");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }
  minePendingTransactions() {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];
  }
  isBlockChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      return true;
    }
  }
}
const taka = new BlockChain();
taka.createTransaction(new Transaction("one", "two", 100));
taka.createTransaction(new Transaction("one", "three", 10));
taka.createTransaction(new Transaction("four", "one", 50));
taka.minePendingTransactions();
console.log(taka);
