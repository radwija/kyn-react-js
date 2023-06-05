import React, { Component, useState } from 'react';
// import './Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../constants';
import { login } from '../util/APIUtils';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import fbLogo from '../img/fb-logo.png';

export default function Login(props) {
    console.log(props)
    const location = useLocation();

    // Didcomponentmount
    React.useEffect(() => {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
        if (location.state && location.state.error) {
            setTimeout(() => {
                // Alert.error(location.state.error, {
                //     timeout: 5000
                // });
                this.props.history.replace({
                    pathname: location.pathname,
                    state: {}
                });
            }, 100);
        }
        return () => { }
    }, [])

    if (props.authenticated) {
        return <Navigate
            to={{
                pathname: "/",
                state: { from: props.location }
            }} />;
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Login to Know Your Neighborhood</h1>
                <SocialLogin />
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <LoginForm props />
                <span className="signup-link">New user? <Link to="/signup">Sign up!</Link></span>
            </div>
        </div>
    );
}

const SocialLogin = () => {

    return (
        <div className="social-login">
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
        </div>
    );
}


const LoginForm = (props) => {
    const navigate = useNavigate();
    const [credential, setCredential] = useState({
        email: '',
        password: ''
    });
    const { email, password } = credential;

    const handleInputChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        const loginRequest = Object.assign({}, credential);

        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                alert("You logged in successfully!");
                navigate("/");
            }).catch(error => {
                alert("Incorrect credential!");
            });
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-item">
                <input type="email" name="email"
                    className="form-control" placeholder="Email"
                    value={email}
                    onChange={(e) => handleInputChange(e)} required />
            </div>
            <div className="form-item">
                <input type="password" name="password"
                    className="form-control" placeholder="Password"
                    value={password}
                    onChange={(e) => handleInputChange(e)} required />
            </div>
            <div className="form-item">
                <button type="submit" className="btn btn-block btn-primary">Login</button>
            </div>
        </form>
    );


}