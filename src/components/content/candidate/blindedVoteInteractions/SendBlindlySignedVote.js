import {getContract} from "../../../walletoperations/Contract";
import {isEmpty} from "lodash";
import toastError, {toastSuccess} from "../../../utils/Toast";

const bigInt = require("big-integer");

const privateKey = bigInt("12598059990686028206656972547021584902925455072885184478309350203653694457817");
// Later I will deploy the contract without modulo and exponent values then I will try to generate keys with a button or smth.and I will ask from contract_owner to send a tx to fill those.
// when the keys are generated. I will try to encrypt privatekey and save it localStorage. to obtain it back user might try to sign personal_sign message. symmetric encryption may be?
// or everytime can be asked as input from owner.

const contract = await getContract();
export const SendBlindlySignedVote = async (offlineRequestBlindSigEvents) => {

    const publicModulo = bigInt((await contract.publicModulo()).toString());

    if (!isEmpty(offlineRequestBlindSigEvents.blindedVote)) {
        let blindlySignedVote = bigInt(offlineRequestBlindSigEvents?.blindedVote).modPow(privateKey, publicModulo);
        console.log("blindlySignedVote", blindlySignedVote.toString());
        await contract.writeBlindSig(offlineRequestBlindSigEvents?.requesterAccount, blindlySignedVote.toString()).then(() => {
            toastSuccess("Blindly signed vote is sent successfully!");
        }).catch((err) => {
            toastError(err.toString());
        });
    }

}
