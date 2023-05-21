import {useContext, useEffect, useRef, useState} from "react";
import {getContract} from "../../walletoperations/Contract";
import {isEmpty, toLower} from "lodash";
import WalletAccountContext from "../../context/WalletAccountContext";
import {ROLE} from "../../utils/ContractParams";
import toastError, {toastSuccess} from "../../utils/Toast";
import {isOwnerOfTheContract} from "../../utils/Checker";
import TxConclusionTemplate from "./TxConclusionTemplate";
import WaitingBlindedVoteRequests from "../awatingblindedvotes/adminview/WaitingBlindedVoteRequests";
import EnableVoting from "./EnableVoting";
import CalculateResults from "./results/CalculateResults";

const ContractOwnerPanel = () => {

    const {account, role, setRole} = useContext(WalletAccountContext);
    const [contractOwnerAddress, setContractOwnerAddress] = useState(null);
    const [whitelistAddress, setWhitelistAddress] = useState(null);
    const inputRef = useRef(null);
    const [tx, setTx] = useState(null);
    const [isVotingLive, setIsVotingLive] = useState(false);

    useEffect(() => {
        checkContractOwner();
    }, [account, ]);

    const checkContractOwner = async () => {
        const contract = await getContract();
        setContractOwnerAddress(await contract.owner());
    }

    useEffect(() => {
        !isEmpty(contractOwnerAddress) && toLower(contractOwnerAddress) === toLower(account) ? setRole(ROLE.CONTRACT_OWNER) : setRole(ROLE.VOTER);
    }, [account, contractOwnerAddress, setRole]);

    const handleAddWhitelistedAddressClicked = async () => {
        const contract = await getContract();
        if (isEmpty(whitelistAddress) || !await isOwnerOfTheContract(contract, account)) return;
        return await contract.addEligibleVoter(whitelistAddress).then((res) => {
            toastSuccess("Address added successfully!");
            console.log(res);
            setTx(res);
        }).catch((err) => {
            toastError(err.toString());
        });
    }

    useEffect(() => {
        const inputElement = inputRef.current;
        const handleChange = (event) => {
            setWhitelistAddress(event.detail);
        };
        inputElement.addEventListener('bl-change', handleChange);
        return () => {
            inputElement.removeEventListener('bl-change', handleChange);
        };
    }, [inputRef]);

    return <div hidden={role !== ROLE.CONTRACT_OWNER} style={{marginTop: 100}}>
        <h1>Contract Owner Panel</h1>
        <EnableVoting isVotingLive={isVotingLive} setIsVotingLive={setIsVotingLive}/>
        <div className="chromatic-wrapper" style={{marginTop: 20}} hidden={!isVotingLive}>
            <bl-input ref={inputRef}
                      label="Add whitelisted Voter">{whitelistAddress}</bl-input>
            <bl-button style={{marginLeft: 30}} kind="success" onClick={handleAddWhitelistedAddressClicked}>Add
                Whitelisted Address
            </bl-button>
            {!isEmpty(tx) && <TxConclusionTemplate txResult={tx}/>}
            <WaitingBlindedVoteRequests/>
            <CalculateResults/>
        </div>

    </div>
}

export default ContractOwnerPanel;