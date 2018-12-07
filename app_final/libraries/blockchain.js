var Block = require('./block');

function Transaction(fromAddress, toAddress, amount, balance) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
	this.balance = balance;
}

function BlockChain(difficulty) {
    this.createGenesisBlock = function() {
        return new Block(new Date(), [], null);
    }
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
	this.rewardTransactions = [];
    this.miningReward = 100;
    this.getLatestBlock = function() {
        return this.chain[this.chain.length - 1];
    }

    this.minePendingTransactions = function(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
		// Add reward transactions
		for (const trans of this.pendingTransactions) {
			var amount = 0.1 * trans.amount * parseFloat(this.difficulty);
			console.log(amount);
			this.rewardTransactions.push(new Transaction(trans.fromAddress, miningRewardAddress, amount, 0));
		}
        block.mineBlock(this.difficulty);
        block.previousHash = this.chain[this.chain.length - 1].hash
        console.log('Block mined successfully.')
        this.chain.push(block)
		console.log('Miner is ' + miningRewardAddress)
		this.pendingTransactions = [];
    }

    this.createTransaction = function(transaction) {
		var balance = this.getBalanceOfAddress(transaction.fromAddress);
		if (balance == 0) {
			return false;
		}
		else {
			transaction.balance = balance;
			this.pendingTransactions.push(transaction);
			return true;
		}
    }

    this.getBalanceOfAddress = function(address) {
		// Default balance is 100
        var balance = 100.00;
		for (const trans of this.pendingTransactions) {
			if (trans.fromAddress === address) {
				// Sender's balance always 0
				return 0;
			}
		}
		
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= parseFloat(trans.amount);
                }
                if (trans.toAddress === address) {
                    balance += parseFloat(trans.amount);
                }
            }
        }
		
		for (const trans of this.rewardTransactions) {
			if (trans.fromAddress === address) {
				balance -= parseFloat(trans.amount);
			}
			if (trans.toAddress === address) {
				balance += parseFloat(trans.amount);
			}
		}
        return balance;
    }

    this.isChainValid = function() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
	
	this.reset = function(difficulty) {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = difficulty;
		this.pendingTransactions = [];
		this.rewardTransactions = [];
		this.miningReward = 100 * this.difficulty;
	}
}

module.exports = BlockChain;