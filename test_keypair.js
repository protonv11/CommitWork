import sdk from '@stellar/stellar-sdk';
const pair = sdk.Keypair.random();
console.log(pair.publicKey());
console.log(pair.secret());
