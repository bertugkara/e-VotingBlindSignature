import {useState} from "react";
import {calculateResults} from "../../../../api/VotingOperationsApi";
import CalculateResultsView from "./CalculateResultsView";

const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'candidateName', headerName: 'Candidate Name', width: 600},
    {field: 'voteCount', headerName: 'Count', width: 400}
];

const CalculateResults = () => {

    const [isCalculateResultsClicked, setIsCalculateResultsClicked] = useState(false);
    const [results, setResults] = useState([]);

    const handleCalculateResultsClicked = async () => {
        await calculateResults().then((res) => {
            setResults(res);
        });
        setIsCalculateResultsClicked(true);
    }

    return <div>
        {isCalculateResultsClicked ? <div>
            <h1>Results</h1>
            <CalculateResultsView columns={columns} rows={results}/>
        </div> : <bl-button style={{marginTop: 30}} kind="success" onClick={handleCalculateResultsClicked}>Calculate
            Results</bl-button>}
    </div>
}

export default CalculateResults;