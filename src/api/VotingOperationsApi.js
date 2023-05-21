import toastError, {toastInfo} from "../components/utils/Toast";
import {getContract} from "../components/walletoperations/Contract";
import {isEmpty, set} from "lodash";

const contract = await getContract();

export const checkIsVotingLive = async () => {
    return await contract.isVotingLive().then((res) => {
        return res;
    }).catch(() => {
        toastError("Failed to check if voting is live.");
    });
}

export const enableVoting = async () => {
    toastInfo("Enabling voting...")
    return await contract.openCloseVoting().then((res) => { //Todo lagging
        return res;
    }).catch((err) => {
        toastError("Failed to enable voting." + err.toString());
    });
}

export const calculateResults = async () => {
    toastInfo("Calculating results...")
    return await contract.calculateResults().then((res) => {
        if (isEmpty(res)) return [];
        return res.map((item, index) => {
            let editedItem = {};
            set(editedItem, "id", index);
            set(editedItem, "candidateName", res[index][0]);
            set(editedItem, "voteCount", res[index][1].toString());
            return editedItem;
        });
    }).catch((err) => {
        toastError("Failed to calculate results." + err.toString());
    });
}