import {useContext, useEffect, useState} from "react";
import WaitingBlindlySignedRequestsView from "../userview/WaitingBlindlySignedRequestsView";
import {isEmpty} from "lodash";
import WalletAccountContext from "../../../context/WalletAccountContext";
import {checkOfflineRequestBlindSigEvents} from "../../../../api/BlindSingatureOperationsApi";
import {SendBlindlySignedVote} from "../../candidate/blindedVoteInteractions/SendBlindlySignedVote";

const WaitingBlindedVoteRequests = () => {

    const {account} = useContext(WalletAccountContext);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if(!isEmpty(account)) fillRows().then((res) => {
            isEmpty(res) ? setRows([]) : setRows(res);
        });
    }, [account]);

    const fillRows = async () => {
       return await checkOfflineRequestBlindSigEvents();
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 150},
        {field: 'blindedVote', headerName: 'Blinded Vote', width: 500},
        {field: 'requesterAccount', headerName: 'Account', width: 500},
        {
            field: "Sign",
            renderCell: (cellValues) => {
                return (
                    <bl-button onClick={async () => {
                         await handleSignButtonClicked(cellValues)
                    }}>Sign </bl-button>
                );
            }
            , width: 150
        }
    ];

    const handleSignButtonClicked = async (data) => {
        await SendBlindlySignedVote(data.row);
    }

    return <div hidden={isEmpty(rows)} style={{marginTop: 50}}>
        <WaitingBlindlySignedRequestsView columns={columns} rows={rows}/>
    </div>
}

export default WaitingBlindedVoteRequests;