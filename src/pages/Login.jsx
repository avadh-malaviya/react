import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "../css/login.scss";
import authService from "../services/auth";
import { useAuthState, useAuthDispatch } from '../store/context';
import { useForm } from "react-hook-form";
import { useWindowSize } from '@react-hook/window-size'
import toast, { Toaster } from 'react-hot-toast';
import * as action from './../store/actions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Login(props) {
  const { register, handleSubmit, formState: { isDirty, isValid, errors }, setError, reset  } = useForm();
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(()=>{
  },[])
	const dispatch = useAuthDispatch();
	const { loading, errorMessage, user } = useAuthState();

  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/";

  var attempt_time = 0 ;
  var count_time = 0;
  var compare_flag = 0;
  var lock = 'No';
  var minimum_length = 6;
  var password_confirm_day = [];

  const compareFlag = (data) => {
    authService.sendPassword(data.username, attempt_time, user?.id).then(()=>{
      toast.error('Your account has been locked. Please follow the instructions sent in your email or contact your IT department.')
      reset({
        username: '',
        password: '',
      });
    });
  }

  const onSubmit = async (data) => {
    let compare = await authService.getCompareFlag({username:data.username, property_id: "0"})
    compare_flag = compare.compare_flag;
    lock = compare.lock;
    minimum_length = compare.minimum_length
    // password_expire_confirm_day
    password_confirm_day = JSON.parse(compare.password_expire_confirm_day);
    // check lock or attampt flag
    if(lock === 'Yes' || (count_time > 0 && count_time >= attempt_time && compare_flag === 1 )) {
      compareFlag();
    } else {
      submit(data);
    }
  };

  const confirmExpire = (index) =>{
    var cur_expireday = 0;
    for(var i = 0; i < password_confirm_day.length ; i++ ) {
       if((i === index) ) {
           cur_expireday = password_confirm_day[index];
       }
    }
    return cur_expireday;

  }

  const submit = (data) => {
      authService.login(dispatch, data)
      .then((response) => {
        if(response.auth.expiry_day === confirmExpire(1) || response.data.auth.expiry_day === confirmExpire(0)) {
          toast.error('Your expiry day is '+response.auth.expiry_day+' day.');
          //send mail
          authService.sendExpiryMail(response.user.username,response.auth.expiry_day );
        }
        from = '/'
        if (response.auth != null && (response.auth.expiry_day < confirmExpire(2))) {
            from = '/access/changepass';
            toast.warning('Password Expired! Please Set New Password.');
        } else {
            if (response.user.status_flag === 0) {
              from = '/access/changepass';
              toast.warning('Your password is default. Please change to the password of your choice for security.');
            }
        }
        toast.success(response?.message)
        navigate(from, { replace: true });
      }).catch((error)=>{
        if(error?.message) {
          if(error.code === '402') {
            confirmAlert({
              title: 'Login Confirmation',
              message: error.message,
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    dispatch(action.authError({error: error?.message, code: error?.code}));
                    submit({...data, login_override: user.override});
                  }
                },
                {
                  label: 'No',
                  onClick: () => {}
                }
              ]
            });
          } else {
            compare_flag = error.compare_flag
            attempt_time = error.attempt_time
            count_time++;
            toast.error(error?.message)
            setError('username', { type: "manual", message: error?.message,});
          }
        }
      });
  };

  return (
  <>
    <div className="container-view login-background">
      <div className="row">
        <div className="col-sm-6 logo-container" style={{marginTop: 'auto'}}>
          <img className="navbar-brand block" src={process.env.PUBLIC_URL + "/login_logo.png"} alt="" style={{width: `calc(${windowWidth/2}px - 50%)`, height: 'auto'}}/>
        </div>
        <div className="col-sm-6 form-container" style={{marginTop: `calc(${windowHeight}px -  ${ (windowHeight > 700 ) ? `42%` : `30%`})`}}>
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="login-div">
              <div style={{ fontSize: "13px", marginTop: "4%" }}>Username</div>
              <input
                type="text"
                name="username"
                {...register("username", {required: true, disabled: loading})}
                className="input-field"
              />
              {errors?.username && <p className="error">{errors?.username?.message || "username is required"}</p>}
              <div style={{ fontSize: "13px", marginTop: "4%" }}>Password</div>
              <input
                type="password"
                name="password"
                {...register("password", {required: true, disabled: loading})}
                className="input-field"
              />
              {errors?.password && <p className="error">{"password is required"}</p>}
              <p className="forgot-password"> Forgot password? </p>
              <div className="btn-container">
                <button
                  type="submit"
                  className="btn btn-block bg-gradient-success"
                  disabled={!isDirty || loading}
                >
                  Log in
                </button>
                <label htmlFor="remember" className="remember-me">
                  <input
                    type="checkbox"
                    style={{ margin: "5px" }}
                    id="remember"
                  />
                  Stay signed in
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="content-footer" style={{ textAlign: "center" }}>
        <p style={{ color: "white", fontSize: "11px" }}>
          {" "}
          © 2020 Ennovatech Solutions FZ LLC <br /> Version 3.0.2
        </p>
      </div>
    </div>
    <div className="divider-line" style={{height: `calc(${windowHeight}px -  15%)`}}>
        <div>
            <div></div>
        </div>
    </div>
    <Toaster
     toastOptions={{
      position: 'top-right',
      success: {
        style: {
          background: 'green',
        },
      },
      error: {
        style: {
          background: 'red',
        },
      }
    }}/>
  </>
  );
}

export default Login;