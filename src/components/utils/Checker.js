import {toLower} from "lodash";

export const isOwnerOfTheContract = async (contract, account) => {
    const contractOwnerAddress = toLower(await contract.owner());
    return contractOwnerAddress === account;
}