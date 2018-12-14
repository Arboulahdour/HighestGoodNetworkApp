import React, { Component } from "react";
import Joi from "joi";
import { renderInput, renderButton } from "./common/form";
import { login, getCurrentUser } from "../services/loginService";
import { Redirect } from "react-router-dom";

class Login extends Component {
  state = {
    data: { email: "", password: "" },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    const email = this.state.data.email;
    const password = this.state.data.password;
    try {
      let result = await login({ email, password });
      if (result && result.userType === "newUser") {
        window.location = `/forcePasswordUpdate/${result.userId}`;
        return;
      }
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/dashboard";
      return;
    } catch (ex) {
      if (ex.response && ex.response.status === 403) {
        const errors = this.state.errors;

        errors["email"] = ex.response.data.message;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="container mt-5">
        <h2>Please Sign in</h2>

        <form className="col-md-6 xs-12" onSubmit={e => this.handleSubmit(e)}>
          {renderInput("email", "Email:")}
          {renderInput("password", "Password:", "password")}
          {renderButton("Submit")}
        </form>
      </div>
    );
  }
}

export default Login;
