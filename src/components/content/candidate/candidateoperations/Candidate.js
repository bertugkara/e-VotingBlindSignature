import {useContext, useEffect, useState} from "react";
import CandidateViewTemplate from "./CandidateViewTemplate";
import fenerbahce from "../images/fenerbahce.png";
import galatasaray from "../images/galatasaray.png";
import WalletAccountContext from "../../../context/WalletAccountContext";
import {isEmpty} from "lodash";
import {getContract} from "../../../walletoperations/Contract";
import {requestBlindVote} from "../blindedVoteInteractions/RequestBlindVote";
import toastError from "../../../utils/Toast";
import {isOwnerOfTheContract} from "../../../utils/Checker";
import TxConclusionTemplate from "../../contractowner/TxConclusionTemplate";
import {ROLE} from "../../../utils/ContractParams";
import WaitingBlindlySignedRequests from "../../awatingblindedvotes/userview/WaitingBlindlySignedRequests";
import {checkIsBlindedVoteSent} from "../../../../api/BlindSingatureOperationsApi";

const Candidate = () => {

    const {account, role} = useContext(WalletAccountContext);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isBlindSignatureRequested, setIsBlindSignatureRequested] = useState(false); //fetch from contract will be wiser idea.
    const [tx, setTx] = useState(null);

    const candidateList = [
        {id: 1, name: "Fenerbahce", image: fenerbahce, choiceCode: "FB"},
        {id: 2, name: "Galatasaray", image: galatasaray, choiceCode: "GS"},
    ];

    useEffect(() => {
        checkBlindSignatureRequested();
        setTx(null);
        setSelectedCandidate(null);
    }, [account]);

    useEffect(() => {
        checkBlindSignatureRequested();
    }, [tx]);

    const checkBlindSignatureRequested = () => {
        if (isEmpty(account)) return;
        checkIsBlindedVoteSent(account).then((res) => {
            isEmpty(res) || res.blindedVote == 0 ? setIsBlindSignatureRequested(false) : setIsBlindSignatureRequested(res);
        });
    }

    const checkIsUserWhitelisted = async (account) => {
        const contract = await getContract();
        contract.eligibleVoterList(account).then((res) => {
            return res[0];
        }).catch((err) => {
            toastError(err.toString());
        });
    }

    const loginToSeeTheCandidatesTemplate = <h2>Please login your Metamask to see the candidates</h2>;

    const question = "Who will win the league?";

    const handleRequestBlindSignatureClicked = async () => {
        const contract = await getContract();
        if (await isOwnerOfTheContract(contract, account)) {
            toastError("You are owner of the contract, you can not request for blind signature!");
            return;
        }
        await requestBlindVote(contract, selectedCandidate, account).then((res) => {
            setTx(res);
            console.log(res);
        });
    }

    return <div style={{marginTop: 80}} hidden={role !== ROLE.VOTER}>
        {isEmpty(account) ? loginToSeeTheCandidatesTemplate : <div>
            <h1>{question}</h1>
            <h2 style={{marginTop: 40}}> Candidates < /h2>
            <br/>
            <CandidateViewTemplate selectedCandidate={selectedCandidate} candidateList={candidateList}
                                   setSelectedCandidate={setSelectedCandidate}/>
            {!isBlindSignatureRequested && !isEmpty(selectedCandidate) &&
                <bl-button id="Request-Sig-Button" style={{marginTop: 30}} kind="success"
                           onClick={handleRequestBlindSignatureClicked}>Request Blind
                    Signature</bl-button>
            }
            {!isEmpty(tx) && <TxConclusionTemplate txResult={tx}/>}
            {isBlindSignatureRequested && <WaitingBlindlySignedRequests selectedCandidate={selectedCandidate}/>}
        </div>
        }
    </div>
}

export default Candidate;
