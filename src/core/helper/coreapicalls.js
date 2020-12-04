const { API } = require("../../backend");

export const getProducts = () => {
  return fetch(`${API}/products`, {
    method: "GET",
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => console.log(err));
};
