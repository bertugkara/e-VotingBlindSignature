import WaitingBlindedVoteRequestsView from "../adminview/WaitingBlindedVoteRequestsView";
import {useContext, useEffect, useState} from "react";
import {isEmpty} from "lodash";
import {checkAwaitingBlindlySignedRequest} from "../../../../api/BlindSingatureOperationsApi";
import WalletAccountContext from "../../../context/WalletAccountContext";
import {voteAfterBlindlySigned} from "../../candidate/blindedVoteInteractions/VoteAfterBlindlySigned";
import toastError from "../../../utils/Toast";

const WaitingBlindlySignedRequests = (props) => {

    const [waitingBlindlySignedRequests, setWaitingBlindlySignedRequests] = useState([]);
    const {account} = useContext(WalletAccountContext);

    useEffect(() => {
        if (!isEmpty(account)) fillRows().then((res) => {
            setWaitingBlindlySignedRequests(res);
        }).catch((err) => {
            console.log(err);
        });
    }, [account]);

    const fillRows = async () => {
        return await checkAwaitingBlindlySignedRequest(account);
    }

    const handleVoteButtonClicked = async (rowData) => {
        if (isEmpty(props.selectedCandidate)) {
            toastError("Please select a candidate that you selected while submitting Blind Vote request! If you select the wrong candidate, your transaction will be reverted!");
            return;
        }
        await voteAfterBlindlySigned(rowData.row, account, props.selectedCandidate);
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'blindlySignedVote', headerName: 'Blindly Signed Vote', width: 600},
        {field: 'eligibleVoterAddress', headerName: 'Account', width: 400},
        {
            field: "Sign",
            renderCell: (cellValues) => {
                return (
                    <bl-button onClick={async () => {
                        await handleVoteButtonClicked(cellValues)
                    }}>Vote</bl-button>
                );
            }
            , width: 150
        }
    ];

    return <div style={{marginTop: 20}}>
        <h2>Waiting Blind Vote Requests Of Yours</h2>
        {isEmpty(waitingBlindlySignedRequests) ?
            <h2 style={{color: "red"}}>Contract Owner has not signed your previous request. Please Wait!</h2> :
            <WaitingBlindedVoteRequestsView columns={columns} rows={waitingBlindlySignedRequests}/>}
        <bl-button kind="success" label onClick={fillRows}>Refresh Results</bl-button>
    </div>
}

export default WaitingBlindlySignedRequests;