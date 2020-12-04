import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper/index";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#ffffff" };
  }
};

const menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-dark p-2 justify-content-center">
      <li className="nav-item">
        <Link className="nav-link" to="/" style={currentTab(history, "/")}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          to="/cart"
          style={currentTab(history, "/cart")}
        >
          Cart
        </Link>
      </li>

      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/user/dashboard"
            style={currentTab(history, "/user/dashboard")}
          >
            U. Dashboard
          </Link>
        </li>
      )}

      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/admin/dashboard"
            style={currentTab(history, "/admin/dashboard")}
          >
            A. Dashboard
          </Link>
        </li>
      )}

      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/signup"
              style={currentTab(history, "/signup")}
            >
              Signup
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/signin"
              style={currentTab(history, "/signin")}
            >
              Signin
            </Link>
          </li>
        </Fragment>
      )}
      {isAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link text-warning"
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
            style={currentTab(history, "/signout")}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);
export default withRouter(menu);
