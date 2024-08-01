import {React,useRef,useState} from 'react'
import {Container,Button} from 'react-bootstrap'
import {  useSelector } from 'react-redux'
import moment from 'moment'
import ShowReport from './ShowReport'
import {CSVLink} from 'react-csv'

 const monthExtract=(date)=>{
   let month=moment(date).utc().format('MM')
   if(month<10)
     month=month.substring(1)
     
   return months(month-1)
}

const months=(month)=>{
  const months=['January','February','March','April','May','June','July','August','September','October','November','December']
  return months[month]
}


const Report=()=>{
  const expenses=useSelector((state)=>state.expense.expenses)
  const [downloadFile,setDownload]=useState('')
  const csvLink=useRef()

  console.log(expenses)
  const jan=expenses.filter(expense=>monthExtract(expense.createdAt)==='January')
  const feb=expenses.filter(expense=>monthExtract(expense.createdAt)==='February')
  const mar=expenses.filter(expense=>monthExtract(expense.createdAt)==='March')
  const apr=expenses.filter(expense=>monthExtract(expense.createdAt)==='April')
  const may=expenses.filter(expense=>monthExtract(expense.createdAt)==='May')
  const jun=expenses.filter(expense=>monthExtract(expense.createdAt)==='June')
  const july=expenses.filter(expense=>monthExtract(expense.createdAt)==='July')
  const august=expenses.filter(expense=>monthExtract(expense.createdAt)==='August')
  const sept=expenses.filter(expense=>monthExtract(expense.createdAt)==='September')
  const oct=expenses.filter(expense=>monthExtract(expense.createdAt)==='October')
  const nov=expenses.filter(expense=>monthExtract(expense.createdAt)==='November')
  const dec=expenses.filter(expense=>monthExtract(expense.createdAt)==='December')

  const monthlyReports=[jan,feb,mar,apr,may,jun,july,august,sept,oct,nov,dec]
  console.log(monthlyReports)

  const downloadExpenses=async()=>{
     const res=await fetch('http://localhost:4000/expense/download-expense',{
      method:'GET',
      headers:{
        'Authorization':localStorage.getItem('token')
      }
     })
     const data=await res.json()
     if(data.url)
     {
      console.log(data.url)
       setDownload(data.url)
     }
     csvLink.current.link.click()

  }
  
    return(
        <Container>
           <h1>Day To Day Expenses</h1>
            {monthlyReports.map((expense,index)=>
            <>
               {expense.length>0 && <ShowReport expense={expense} month={months(index)}/>}
               </>
              )}
              <Button onClick={downloadExpenses}>Download CSV</Button>
              <CSVLink
         data={downloadFile}
         filename='transactions.csv'
         className='hidden'
         ref={csvLink}
         target='_blank'
      />
        </Container>
    )
}
export default Report