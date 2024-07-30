import React, { Fragment,useRef } from "react";
import { Button, Container,Form } from "react-bootstrap";



const ForgotPassword=(props)=>{
    const emailRef=useRef()
    const submitForgotPassword=async(event)=>{
        event.preventDefault()
      
        const res=await fetch('http://localhost:4000/password/forgotpassword',{
            method:'POST',
            body:JSON.stringify({email:emailRef.current.value}),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data=await res.json()
        console.log(data)
        if(data.message)
        alert(data.message)
        else if(data.error)
        {
            //console.log(res)
          alert(data.error)
        }
       
      }



    return(
        <Fragment>
            <Container className='d-flex justify-content-center '>
           <Form onSubmit={submitForgotPassword}>
               <Form.Group className="mb-3 ">
                    <Form.Label>Enter Your Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" ref={emailRef} required/>
               </Form.Group>
               <Button type="submit" className="btn-success m-2" >Submit</Button>
               <Button className="btn-danger" onClick={props.cancel}>Cancel</Button>
           </Form>
           </Container>
        </Fragment>
    )
}

export default ForgotPassword