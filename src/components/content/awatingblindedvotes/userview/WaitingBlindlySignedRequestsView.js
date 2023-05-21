import {DataGrid} from "@mui/x-data-grid";

const WaitingBlindlySignedRequestsView = ({columns,rows}) => {

    return <DataGrid  rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      experimentalFeatures={{newEditingApi: true}}
    />
}

export default WaitingBlindlySignedRequestsView;