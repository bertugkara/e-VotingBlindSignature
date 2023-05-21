//import NodeRSA from 'node-rsa';
//const bigInt = require("big-integer");
/*
export const generateKeys = (account) => {
    const key = new NodeRSA({b: 256});

    const bigE = bigInt(key.keyPair.e.toString());
    const bigN = key.keyPair.n;
    const bigD = key.keyPair.d;
    //const bigP = key.keyPair.p; // these are not needed for our purposes
    //const bigQ = key.keyPair.q;

    let publicExponent = bigInt(bigE.toString());
    let publicModulo = bigInt(bigN.toString());
    let privateKey = bigInt(bigD.toString());

    let topic = account.toString() + "PrivateKey";
    localStorage.setItem(`${topic}`, privateKey.toString()); // this should encrypted with contract owner's wallet signature. For local testing purposes, we are leaving as it is.

    return {publicExponent, publicModulo, privateKey};
}
12598059990686028206656972547021584902925455072885184478309350203653694457817
*/