import {DataGrid} from "@mui/x-data-grid";

const WaitingBlindedVoteRequestsView = ({rows,columns}) => {

    return  <DataGrid rows={rows}
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}
                              disableSelectionOnClick
    />
}

export default WaitingBlindedVoteRequestsView;