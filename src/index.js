const Web3 = require('web3');

// Based on the post by Alex Miller https://hackernoon.com/add-secure-fee-less-one-click-payments-to-any-website-for-free-12e721eec5d8

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545')
    );
  }
});

function onSubmitForm(e) {
  e.preventDefault();

  const inpEth = document.getElementById('eth');
  const amount = Number(inpEth.value);

  const inpAddress = document.getElementById('address');
  const toAddress = inpAddress.value;

  sendTxn(window.web3, amount, toAddress)
    .then(txHash => {
      const elResult = document.getElementById('result');
      elResult.innerText = 'Success! hash: ' + txHash;
    })
    .catch(err => {
      const elResult = document.getElementById('result');
      elResult.innerText = 'An error occurred. See console for more info';

      throw err;
    });

  return false;
}

const form = document.getElementById('form');
form.addEventListener('submit', onSubmitForm, false);

function sendTxn(web3, ether, toAddress) {
  const user = web3.eth.accounts[0];
  const wei = ether * Math.pow(10, 18);
  const gasPrice = 3 * Math.pow(10, 9);
  const gasLimit = 30000;
  const rawTx = {
    gasPrice: `0x${gasPrice.toString(16)}`,
    gasLimit: `0x${gasLimit.toString(16)}`,
    from: user,
    to: toAddress,
    value: `0x${wei.toString(16)}`
  };

  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(rawTx, (err, txHash) => {
      if (err) {
        return reject(err);
      }

      return resolve(txHash);
    });
  });
}
