import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper/index";
import Base from "../core/Base";
import {
  getProduct,
  getCategories,
  updateProduct,
} from "./helper/adminapicall";

// props.match
const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    updatedProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    photo,
    categories,
    category,
    loading,
    error,
    updatedProduct,
    getRedirect,
    formData,
  } = values;

  const preload = (productId) =>
    getProduct(productId).then((data) => {
      //   console.log("data :", data.photo);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category._id,
          formData: new FormData(),
        });
        preloadCategories();
      }
    });

  const preloadCategories = () =>
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });

  useEffect(() => {
    return preload(match.params.productId);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            getRedirect: true,
            updatedProduct: data.name,
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

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: updatedProduct ? "" : "none" }}
      >
        <h4>{updatedProduct} updated successfully.</h4>
      </div>
    );
  };

  const warningMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: error ? "" : "none" }}
      >
        <h4>{updatedProduct} updation failed.</h4>
      </div>
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

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const createProductForm = () => (
    <form className="p-3 d-flex flex-column justify-content-center bg-light text-dark">
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Stock"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Update Product Here!"
      description="Welcome to product updation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded shadow">
        <div className="col-md-8 offset-md-2">
          {loadingMessage()}
          {successMessage()}
          {warningMessage()}
          {createProductForm()}
          {redirectToAdmin()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
