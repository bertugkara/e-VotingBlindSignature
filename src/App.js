import './App.css';
import Header from "./components/header/Header";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletAccountContext from "./components/context/WalletAccountContext";
import {useState} from "react";
import Candidate from "./components/content/candidate/candidateoperations/Candidate";
import ContractOwnerPanel from "./components/content/contractowner/ContractOwnerPanel";

function App() {
    const [account, setAccount] = useState(null);
    const [role, setRole] = useState(null);

    return (
        <div className="App">
            <ToastContainer/>
            <WalletAccountContext.Provider value={{account, setAccount, role, setRole}}>
                <Header/>
                <ContractOwnerPanel/>
                <Candidate/>
            </WalletAccountContext.Provider>
        </div>
    );
}

export default App;
