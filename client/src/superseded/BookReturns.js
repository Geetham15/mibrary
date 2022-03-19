import React, {usestate, useEffect} from 'react'
import {Button,} from '@mui/icons-material'
import DataTable from "../components/Dashboard/DataTable";
const BookReturns = () => {
// find loaned book in  db then return Title, Author. ISBN_10 Date Lent date for return comments
 

return (
    <>
<h1>Book Return Component</h1>
<DataTable/>
    </>
  )
}

export default BookReturns