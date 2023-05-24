import { host } from "./links";

export const getDeliveryQuote = (
  id: string,
  userAddress: string,
  restAddress: string
) => {
  return fetch(`${host}/getDeliveryQuote`, {
    body: JSON.stringify({
      id,
      userAddress,
      restAddress,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      // let temp = JSON.stringify(res);
      // console.log(temp);
      // console.log("res status: ", res.status);
      return Promise.reject("something went wrong processing your delivery");
    }

    // dataRequest();

    return res.json();
  });
};
