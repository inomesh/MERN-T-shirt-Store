import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/carthelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderhelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const authToken = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log(res);

        const { status } = res;
        console.log("STATUS ", status);

        cartEmpty();
        setReload(!reload);
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51HuDEcLz5CDpALaHAoXG1WsQ9umuDBe9xhRwmzfPDJtuizCgwMj2Kk1MBS77xKTR50ThCWZ76h2QoYORfTOOXHK300uNeeUA43"
        token={makePayment}
        name="Buy t-shirts"
        amount={getFinalPrice() * 100}
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success rounded shadow">
          pay with stripe
        </button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning rounded shadow">sign in</button>
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-white">Stripe checkout ${getFinalPrice()}</h1>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
