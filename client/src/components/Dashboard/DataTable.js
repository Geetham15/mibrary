import MUIDataTable from "mui-datatables";

function DataTable({ title, books, columns, options }) {
  return (
    <div>
      <MUIDataTable
        title={title}
        data={books}
        columns={columns}
        options={options}
      />
    </div>
  );
}

export default DataTable;
