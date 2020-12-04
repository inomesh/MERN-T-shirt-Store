import React, { useState, useEffect } from "react";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/carthelper";
import StripeCheckout from "./StripeCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>This section is to load products</h2>

        {products.map((product, index) => (
          <Card
            key={index}
            addtoCart={false}
            removeFromCart={true}
            product={product}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>For Checkout</h2>
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="ready to check out">
      <div className="row text-center">
        <div className="col-6">
          {products.length ? (
            loadAllProducts(products)
          ) : (
            <h3>No Products In Cart</h3>
          )}
        </div>
        <div className="col-6">
          <StripeCheckout
            products={products}
            setReload={setReload}
            reload={reload}
          />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
