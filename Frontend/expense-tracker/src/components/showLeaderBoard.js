import react, { Fragment } from 'react'
import { Container, Row,Col } from 'react-bootstrap'
import { leaderboardAction } from '../store/leaderboardSlice'
import { useSelector } from 'react-redux'


const ShowLeaderBoard=()=>{
   const expenses=useSelector(state=>state.leaderboard.expenses)
    return(
        <Fragment>
            <Container>
                <h2>LeaderBoard</h2>
                {expenses.map(expense=>
                    <Row>
                    <p>{expense.username} Total Expenses:- {expense.totalExpenses}</p>
                </Row>)}
                
            </Container>
        </Fragment>

    )
}

export default ShowLeaderBoard