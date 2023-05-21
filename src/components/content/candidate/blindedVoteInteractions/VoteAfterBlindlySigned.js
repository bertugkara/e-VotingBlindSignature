import {getContract} from "../../../walletoperations/Contract";
import {isEmpty} from "lodash";
import toastError, {toastSuccess} from "../../../utils/Toast";
import sha256 from "js-sha256";

const bigInt = require("big-integer");

const contract = await getContract();
export const voteAfterBlindlySigned = async (blindlySignedVoteObject, account, selectedCandidate) => {

    let blindingFactor = bigInt(JSON.parse(localStorage.getItem(`${account}`)).toString());
    if(isEmpty(blindingFactor)) {
        toastError("Blinding factor is not found in local storage. Please request a blind vote first.");
        return;
    }

    const voteCode = selectedCandidate.choiceCode.toString();
    console.log(voteCode)
    const voteHash = bigInt(sha256(voteCode), 16);
    console.log("Vote Hash:", voteHash.toString());

    const publicModulo = bigInt((await contract.publicModulo()).toString());

    let blindlySignedVote = bigInt(blindlySignedVoteObject.blindlySignedVote.toString());
    let unblindedVoteHash = blindlySignedVote.multiply(blindingFactor.modInv(publicModulo)).mod(publicModulo);

    await contract.Vote(voteCode.toString(), unblindedVoteHash.toString(), voteHash.toString()).then(() => {
        toastSuccess("Vote is sent successfully!");
    }).catch((err) => {
        toastError(err.toString());
    });
}