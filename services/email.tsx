import { host } from "./links";

function capitalizeFirstLetter(name: string) {
  let tempString = name.toLowerCase();
  return tempString.charAt(0).toUpperCase() + tempString.slice(1);
}

function allAreNull(array: any) {
  array.map((item: any) => {
    if (item !== null) {
      return true;
    }
    return false;
  });
}

export const sendOrderEmail = (
  name: string,
  userEmail: string,
  cart: any,
  restName: string,
  finalAmt: number,
  cartSum: number,
  calculatedTip: number,
  totalTax: number,
  appyFee: number,
  newCount: number,
  restaurantPhoneNumber: string,
  restAddress: string,
  restCity: string,
  restState: string,
  restZip: string,
  deliveryQuote: number
) => {
  let sum = cartSum;
  let tempName = capitalizeFirstLetter(name);
  let email = userEmail;
  let quote = parseFloat((parseFloat(deliveryQuote) / 100).toFixed(2));
  let orderNumber = newCount;
  let restNumber = restaurantPhoneNumber;
  let subject = `${tempName}, your order has been placed!`;
  let htmlOrder = cart.map((item: any, i: number) => {
    if (allAreNull(item?.modifiers)) {
      return `<li>${item.item}</li>`;
    } else {
      let tempArr = item.modifiers.map((option: any) => {
        // console.log(option);
        if (!option) {
          return;
        } else {
          return `<li>${option}</li>`;
        }
      });
      let formattedTempArr = tempArr.join("");

      if (i + 1 === cart.length) {
        if (formattedTempArr === "") {
          return `<tr class="details"><td style="text-align: left">${
            item.item
          }</td><td style="text-align: left">$${(item.price / 100).toFixed(
            2
          )}</td>`;
        } else {
          return `<tr class="details"><td style="text-align: left">${
            item.item
          }</td><td style="text-align: left">$${(item.price / 100).toFixed(
            2
          )}</td></tr><td style="padding-bottom: 5px">${formattedTempArr}</td>`;
        }
      } else {
        if (formattedTempArr === "") {
          return `<tr class="details"><td style="text-align: left; border-bottom: 1px solid #eee">${
            item.item
          }</td><td style="text-align: left">$${(item.price / 100).toFixed(
            2
          )}</td>`;
        } else {
          return `<tr class="details"><td style="text-align: left">${
            item.item
          }</td><td style="text-align: left">$${(item.price / 100).toFixed(
            2
          )}</td></tr><td style="border-bottom: 1px solid #eee; padding-bottom: 5px">${formattedTempArr}</td>`;
        }
      }
    }
  });

  let formattedTotal = `$${parseFloat(finalAmt / 100).toFixed(2)}`;
  // console.log(htmlOrder.join(""));
  let formattedHtmlOrder = htmlOrder.join("");

  // console.log(formattedHtmlOrder);

  return fetch(`${host}/sendWebOrderMail`, {
    body: JSON.stringify({
      name,
      email,
      formattedHtmlOrder,
      subject,
      restName,
      formattedTotal,
      orderNumber,
      restNumber,
      sum,
      calculatedTip,
      totalTax,
      appyFee,
      restAddress,
      restCity,
      restState,
      restZip,
      quote,
    }),
    method: "POST",
  }).then((res) => {
    // console.log("res: ", res);
    if (res.status > 200) {
      // let temp = JSON.stringify(res);
      // console.log("res error: ", res);
      return Promise.reject(res, "something went wrong processing your mail");
      // return res.json();
    } else {
      // console.log("should have sent");
      //   console.log("res sent: ", res);
      //   Alert.alert("email sent!");
      return res.json();
    }
  });
};
