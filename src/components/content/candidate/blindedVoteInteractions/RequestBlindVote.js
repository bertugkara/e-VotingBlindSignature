import toastError, {toastSuccess} from "../../../utils/Toast";
import {gcd} from "big-integer";
import sha256 from 'js-sha256'
const bigInt = require("big-integer");


export const requestBlindVote = async (contract, selectedCandidate, account) => {
    const publicExponent = bigInt((await contract.publicExponent()).toString());
    const publicModulo = bigInt((await contract.publicModulo()).toString());

    let blindingFactor;
    do {
        blindingFactor = bigInt.randBetween(1, publicModulo.minus(1));
    } while (gcd(blindingFactor, publicModulo).notEquals(1));
    console.log("blinding", blindingFactor.toString());

    const voteCode = selectedCandidate.choiceCode.toString();
    console.log(voteCode)
    const voteHash = bigInt(sha256(voteCode), 16);
    console.log("Vote Hash:", voteHash.toString());

    const blindedVote = voteHash
        .multiply(blindingFactor.modPow(publicExponent, publicModulo))
        .mod(publicModulo);
    console.log("Blinded Vote:", blindedVote.toString());

    return await contract.requestBlindSig(blindedVote.toString()).then((res) => {
        toastSuccess("Blind Vote Requested");
        localStorage.setItem(`${account}`, JSON.stringify(blindingFactor)); // use encryption later, not safe at the moment.
        return res;
    }).catch((err) => {
        toastError(err.toString());
    });
}

export const unblindVote = async (contract) => {
    const publicModulo = await contract.publicModulo();

    const unblindedVoteHash = bigInt(190).multiply(bigInt(117).modInv(publicModulo)).mod(publicModulo);
    console.log("unblindedVoteHash", unblindedVoteHash.toString());
    return unblindedVoteHash;
}

/*
const blindlySignedVote = bigInt("190");
const blindingFactor = bigInt("117");
const publicModulo = bigInt("191");
 */

