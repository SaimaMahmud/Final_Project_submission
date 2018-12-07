var SparkMD5 = require('spark-md5');

function Block(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.calculateHash = function() {
        return SparkMD5.hash(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    this.hash = this.calculateHash();

    this.mineBlock = function(difficulty) {
        var level = parseInt(difficulty);
        while (this.hash.substring(0, level) !== Array(level + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash)
    }
}

module.exports = Block;