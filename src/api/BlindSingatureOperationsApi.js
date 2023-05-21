import {getContract} from "../components/walletoperations/Contract";
import {isEmpty, set} from "lodash";
import toastError from "../components/utils/Toast";

const contract = await getContract();
export const checkIsBlindedVoteSent = async (account) => {
    return await contract.blindedVotes(account).then((res) => {
        let result = {};
        set(result, "id", 1);
        set(result, "requesterAccount", account);
        set(result, "blindedVote", res.toString());
        return result;
    }).catch((err) => {
        toastError(err.toString());
    });
}

export const getBlindedVoteByAccount = async (account, index) => {
    return await contract.blindedVotes(account).then((res) => {
        let result = {};
        set(result, "id", index);
        set(result, "requesterAccount", account.toString());
        set(result, "blindedVote", res.toString());
        return result;
    });
}

export const checkIsThereAnyBlindSigForGivenBlindVote = async (account) => {
    return await contract.eligibleVoterList(account).then((res) => {
        let result = {};
        set(result, "id", 1);
        set(result, "eligibleVoterAddress", account);
        set(result, "votingActivity", res);
        return result;
    });
}

export const checkOfflineRequestBlindSigEvents = async () => {
    const filter = await contract.filters.voteBlindedBlindSigPending();
    const events = await contract.queryFilter(filter);
    if (!isEmpty(events)) {
        let queryResult = await Promise.all(events.map(async (event, index) => {
            let blindedVoteOfRequesterAccount = await getBlindedVoteByAccount(event.args[0], index);
            let checkIsThereAnyBlindSigForGivenAccount = await checkIsThereAnyBlindSigForGivenBlindVote(event.args[0]);
            if (checkIsThereAnyBlindSigForGivenAccount?.votingActivity[2].toString() === "0") {
                return blindedVoteOfRequesterAccount;
            }
        }));
        if (queryResult.length > 0 && !isEmpty(queryResult[0])) {
            console.log("queryResult", queryResult)
            return queryResult;
        }
    } else {
        return [];
    }
}

const prepareVoterObject =  (voter) => {
    set(voter, "blindlySignedVote" , voter.votingActivity[2].toString());
    return voter;
}

export const checkAwaitingBlindlySignedRequest = async (account) => {
    let voter = await checkIsThereAnyBlindSigForGivenBlindVote(account);
    if(!isEmpty(voter.votingActivity[3].toString())) return [];
    return voter?.votingActivity[2].toString() !== "0" ? [prepareVoterObject(voter)] : [];

}
