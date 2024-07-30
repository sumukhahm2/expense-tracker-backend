import {React,Fragment,useRef,useState} from 'react'
import {Form,Button, Container} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { authAction } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import ForgotPassword from './ForgotPassword'
import './Login.css'

const Login=()=>{

  const nameRef=useRef()
  const passwordRef=useRef()
  const confirmPasswordRef=useRef()
  const emailRef=useRef()

  const [message,setMessage]=useState(null)
  const [error,setError]=useState(null)
  const [isLogin,setIsLogin]=useState(false)
  const [isForgotPassword,setForgotPassword]=useState(false)
 
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const onSignUp=async(event)=>{
      event.preventDefault() 
  
   let res;
   let authData;
     if(isLogin)
     {
      
        authData={
            email:emailRef.current.value,
            password:passwordRef.current.value
       }
       res=await fetch('http://localhost:4000/user/auth-login',{
        method:'POST',
        body:JSON.stringify(authData),
        headers:{
            'Content-Type':'application/json'
        }
     })
     }
     else{
         authData={
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
         }
         console.log(authData)
        res=await fetch('http://localhost:4000/user/auth-signup',{
             method:'POST',
             body:JSON.stringify(authData),
             headers:{
                 'Content-Type':'application/json'
             }
          })
     }
    const data=await res.json()
     console.log(data)
    if(data.error)
     {
        if(isLogin)
        {
            setError(data.error)
        }
        else{
            const message=data.error
            setError(message)
        }
       
     }
    else{
         if(isLogin)
         {
            console.log(data.token)
            setMessage(data.message)
           dispatch(authAction.login({...authData,token:data.token}))
           window.location.reload()

         }
         else{
            setMessage('User Created Successfully')
            dispatch(authAction.signup(authData))
            
         }
        
    }
     
      
    
}


console.log(isLogin)

    return(
        <Fragment>
            
       {!isForgotPassword && <Container className='d-flex justify-content-center '>
             <Form className='w-50 border border-success  rounded form'  onSubmit={onSignUp}>
                <Form.Text className='fs-1 text-success fw-bold'>{isLogin?'Login':'Sign Up'}</Form.Text>
                {message && <h5 className='text-success'>{message}</h5>}
                {error && <h5 className='text-danger'>{error}</h5>}
                {!isLogin && <Form.Group className="mb-3 mx-2"  controlId="formBasicPassword">
        <Form.Label className='fw-bold'>Name</Form.Label>
        <Form.Control type="text" placeholder="Name" className='border border-success'  ref={nameRef} required/>
      </Form.Group>}
      <Form.Group className="mb-3  mx-2" controlId="formBasicEmail">
        <Form.Label className='fw-bold'>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" className='border border-success' ref={emailRef} required/>
        <Form.Text className="text-muted text-success">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3  mx-2" controlId="formBasicPassword">
        <Form.Label className='fw-bold'>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" className='border border-success' ref={passwordRef} required/>
      </Form.Group>
      {!isLogin && <Form.Group className="mb-3  mx-2" controlId="formBasicPassword">
        <Form.Label className='fw-bold'>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" className='border border-success'  ref={confirmPasswordRef} required/>
      </Form.Group>}
      <Button variant="success" type="submit" className='fw-bold'>
       {isLogin?'Login':'SignUp'}
      </Button>
      <br/>
      <button type='button' onClick={()=>{setIsLogin((prev)=>{return !prev})}} className='m-2 border border-none bg-none text-success fw-bold'>{isLogin?'Don`t Have An Account':'Have An Account?'}</button>
      {isLogin && <button  type='button' onClick={()=>{setForgotPassword(true)}} className='m-2 border border-none bg-none text-success fw-bold'>Forgot Password?</button>}
    </Form>
        </Container>}
        {isForgotPassword && <ForgotPassword cancel={()=>{setForgotPassword(false)}}/>}
        </Fragment>

    )
}

export default Login