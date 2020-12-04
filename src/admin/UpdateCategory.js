import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { updateCategory, getCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    updatedCategory: "",
    loading: false,
    getRedirect: false,
  });
  const {
    name,
    error,
    success,
    updatedCategory,
    loading,
    getRedirect,
  } = values;

  const { token, user } = isAuthenticated();

  const preload = (categoryId) =>
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });

  useEffect(() => {
    return preload(match.params.categoryId);
  }, []);

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-info mb-3" to="/admin/categories">
          Manage Categories
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    setValues({ ...values, error: "", name: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    setValues({ ...values, error: "", loading: true });

    // backend request fired
    updateCategory(match.params.categoryId, user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            error: "",
            success: true,
            name: "",
            loading: false,
            getRedirect: true,
            updatedCategory: data.name,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const redirectToAdmin = () => {
    return (
      getRedirect &&
      setTimeout(function () {
        // history.push("/admin/dashboard");
        // /TODO please correct this jugaad with <Redirect to="/admin/dashboard" />
        window.history.pushState(null, null, "/admin/dashboard");
        window.history.go();
      }, 2000)
    );
  };

  const loadingMessage = () => {
    return (
      <div
        className="alert alert-info mt-3"
        style={{ display: loading ? "" : "none" }}
      >
        <h4>loading...</h4>
      </div>
    );
  };

  const successMessage = () => {
    if (success) {
      return (
        <div
          className="alert alert-success mt-3"
          style={{ display: updatedCategory ? "" : "none" }}
        >
          <h4>{updatedCategory} updated successfully.</h4>
        </div>
      );
    }
  };

  const warningMessage = () => {
    if (error) {
      return (
        <div
          className="alert alert-danger mt-3"
          style={{ display: error ? "" : "none" }}
        >
          <h4>{updatedCategory} updation failed.</h4>
        </div>
      );
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead font-weight-bold">Existing category</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="For ex. summer"
          />
          <button onClick={onSubmit} className="btn btn-outline-info">
            Update Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Update a category here"
      description="Update an existing category of t-shirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {goBack()}
          {loadingMessage()}
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {redirectToAdmin()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
