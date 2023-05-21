import {useContext, useEffect} from "react";
import WalletAccountContext from "../../context/WalletAccountContext";
import {isEmpty} from "lodash";
import {checkIsVotingLive, enableVoting} from "../../../api/VotingOperationsApi";
import {toastSuccess} from "../../utils/Toast";


const EnableVoting = (props) => {

    const {account} = useContext(WalletAccountContext);

    useEffect(() => {
        if (!isEmpty(account)) handleCheckIsVotingLive().catch((err) => {
            console.log(err);
        });
    }, [account]);

    const handleCheckIsVotingLive = async () => {
        await checkIsVotingLive().then((res) => {
            props.setIsVotingLive(res);
        });
    }

    const handleEnableVotingOnClick = async () => {
        await enableVoting().then((res) => {
            if (!isEmpty(res)) {
                toastSuccess("Voting is enabled successfully! Please Refresh the page.");
                setTimeout(() => {
                    handleCheckIsVotingLive();
                }, 3000);
            }
        });
    }

    return <div hidden={props.isVotingLive} style={{marginBottom: 20}}>
        {props.isVotingLive ? "Voting is live" :
            <div> Voting is not live yet. Click Here to enable. <bl-button onClick={handleEnableVotingOnClick}>Enable
                Voting</bl-button></div>}
    </div>
}

export default EnableVoting;