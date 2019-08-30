import React from 'react';
import Psw from './passwordMobx';
import { observer } from 'mobx-react-lite';
import './UserPanel.css'

import { Redirect, Link  } from "react-router-dom";

const UserPanel = observer(() => {

    const [RegistrationPanel, setRegistrationPanel] = React.useState(false);

    const [ErrorText, setErrorText] = React.useState('');
    const [Red, setRed] = React.useState(false);


    const store = React.useContext(Psw);

    const handleSetRegistration = () =>{
        setRegistrationPanel(() => !RegistrationPanel);
    }

    const chekReg = (event) => {
        console.log("i in checkPass:\n store.password: ", store.password, "  store.confirm.password:  ", store.confirmPassword);
        event.preventDefault();
        if (store.password !== store.confirmPassword){
            setErrorText(() => "Passwords are different!!!");
            
        }else if(store.username.length <= 3){
            setErrorText(() => "Username must contein more than 3 simbols!!!");
        }else if(store.password.length <= 3){
            setErrorText(() => "Password must contein more than 3 simbols!!!");
        }else{
            fetch('/reg', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                     },
                    body: JSON.stringify({
                        username: store.username,
                        password: store.password
                      })
              })
            .then(response => response.json())
            .then(res => {
                setErrorText(() => res.err);
                if(res.status_text === 'OK'){
                    chekLogin(event);
                }

            })
              .catch(err => console.log(err));
        }
    }

    const chekLogin = (event) => {
        event.preventDefault();
        fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                    },
                body: JSON.stringify({
                    username: store.username,
                    password: store.password
                    })
            })
        .then(response => response.json())
        .then(res => {
            setErrorText(() => res.err);
            if(res.status_text === 'OK'){
                setRed(() => true);
            }

        })
        .catch(err => console.log(err));
    
    }


    const reg = (
        
        <form className="registration-form" action="/reg" method="POST" onSubmit={chekReg}>
            <Link to='/'>To main page</Link>
            <p className="my-2" style={{color:"red"}}>{ErrorText}</p>
            <br/>
            <h2 className="form-signin-heading">Please fill filds!</h2>
            <div className='form-group'>
                <label htmlFor="inputUsername">Username:</label>
                <input
                    type="name"
                    className='form-control'
                    id="inputUsername"
                    name="username"
                    placeholder="Name"
                    onChange = {store.toggleUsername}
                    required
                    autoFocus
                />

                <label htmlFor="inputPassword">Password:</label>
                <input
                    type="password"
                    className='form-control'
                    id="inputPassword"
                    name="password"
                    placeholder="Password"
                    style={ErrorText === "Passwords are different!!!" ? {backgroundColor:"red"} : undefined}
                    onChange={store.togglePassword}
                    required
                />

                <label htmlFor="inputRepiatPassword">Repiate your password:</label>
                <input
                    type="password"
                    className='form-control'
                    id="inputRepiatPassword"
                    name="repiatPassword"
                    placeholder="Password"
                    style={ErrorText === "Passwords are different!!!" ? {backgroundColor:"red"} : undefined}
                    onChange={store.toggleConfirmPassword}
                    required
                />
            </div>
            <br/>
            <button className="btn btn-primary" type="submit">Registration</button>
            <span onClick={handleSetRegistration} className="mx-1 UserPanel__toogleType">Login</span>
            <br/>
            <p className="my-3">Another way:</p>
            <a href="/auth/facebook"><i className="fa fa-facebook-official" style={{"font-size":"36px", color:"blue"}}></i></a>
        </form>

    );

    const loginPanel = (
        
        <form className="login-form" action="/login" method="POST" onSubmit={chekLogin}>
            <Link to='/'>To main page</Link>
            <p className="my-2" style={{color:"red"}}>{ErrorText}</p>
            <br/>
            <h2 className="form-signin-heading">Please fill filds!</h2>
            <div className='form-group'>
                <label htmlFor="inputUsername">Username:</label>
                <input
                    type="name"
                    className='form-control'
                    id="inputUsername"
                    name="username"
                    placeholder="Name"
                    onChange = {store.toggleUsername}
                    required
                    autoFocus
                />

                <label htmlFor="inputPassword">Password:</label>
                <input
                    type="password"
                    className='form-control'
                    id="inputPassword"
                    name="password"
                    placeholder="Password"
                    onChange={store.togglePassword}
                    required
                />
            </div>
            <br/>
            <button className="btn btn-primary" type="submit">Sign up</button>
            <span onClick={handleSetRegistration} className="mx-1 UserPanel__toogleType" >Registration</span>
            <br/>
            <p className="my-3">Another way:</p>
            
            <a href="/auth/facebook"><i className="fa fa-facebook-official" style={{"font-size":"36px", color:"blue"}}></i></a>
        </form>
    );

    const chooseCase = () => {
        if(Red){
            return <Redirect to="/personalPage"/>;
        }
        if (RegistrationPanel){
            return reg;
        }else{
           return loginPanel;
        }
    };

    const body = chooseCase();

    return(
        <div>
            
            {body}

        </div>
    )
})

export default UserPanel;