import React,{useRef} from 'react'
import { Button, Container,Form } from 'react-bootstrap'


const CreatePassword=()=>{

    const newPasswordRef=useRef()

    const changePassword=async(event)=>{

        event.preventDefault()
        const res=await fetch('http://localhost:4000/password/update-password',{
            method:'POST',
            body:JSON.stringify({password:newPasswordRef.current.value})
        })

    }

    return(
        <Container>
            <Form onSubmit={changePassword}>
                <Form.Text className='fs-2 mb-3'>Reset Password</Form.Text>
              <Form.Group className='mb-3'>
                <Form.Label>Enter Your New Password</Form.Label>
                <Form.Control type='password' ref={newPasswordRef}/>
              </Form.Group>
              <Button className='btn-success'>Change Password</Button>
            </Form>
        </Container>
    )
}