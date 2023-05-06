// import React, { useState } from "react";
// import ReactModal from "react-modal";

// import { MenuItemType } from "../type";

// interface ModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   item: any;
// }

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "80%",
//     maxWidth: "500px",
//   },
// };

// export const PopupModalNew: React.FC<ModalProps> = ({
//   isOpen,
//   closeModal,
//   item,
// }) => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [firstOptionChoice, setFirstOptionChoice] = useState("");
//   const [secondOptionChoice, setSecondOptionChoice] = useState("");
//   const [sideChoice, setSideChoice] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   const setFirstOption = (price: number | string, name: string) => {
//     setFirstOptionChoice(name);
//   };

//   const setSecondOption = (price: number | string, name: string) => {
//     setSecondOptionChoice(name);
//   };

//   const setSideOption = (price: number | string, name: string) => {
//     setSideChoice(name);
//   };

//   const finishItem = () => {
//     console.log("Add to cart");
//   };

//   const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleAddToCart = () => {
//     // Add the selected option to the cart
//     console.log("Selected option:", selectedOption);
//     closeModal();
//   };

//   return (
//     <ReactModal
//       isOpen={isOpen}
//       onRequestClose={closeModal}
//       style={customStyles}
//       contentLabel="Add to Cart"
//       ariaHideApp={false}
//     >
//       <div>
//         <h2>{item.name}</h2>
//         <p>{item.desc}</p>
//         {item.firstOptionName && (
//           <>
//             <h3>Choose: {item.firstOptionName}</h3>
//             {item.firstOptions.map((option, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={`firstOption-${index}`}
//                   name="firstOption"
//                   value={option.name}
//                   onChange={() => setFirstOption(option.price, option.name)}
//                 />
//                 <label htmlFor={`firstOption-${index}`}>
//                   {option.name} {option.price !== 0 && `+ $${option.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         {item.secondOptionName && (
//           <>
//             <h3>Choose: {item.secondOptionName}</h3>
//             {item.secondOptions.map((option, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={`secondOption-${index}`}
//                   name="secondOption"
//                   value={option.name}
//                   onChange={() => setSecondOption(option.price, option.name)}
//                 />
//                 <label htmlFor={`secondOption-${index}`}>
//                   {option.name} {option.price !== 0 && `+ $${option.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         {item.sides.length > 0 && (
//           <>
//             <h3>Choose: side item</h3>
//             {item.sides.map((side, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={`side-${index}`}
//                   name="side"
//                   value={side.name}
//                   onChange={() => setSideOption(side.price, side.name)}
//                 />
//                 <label htmlFor={`side-${index}`}>
//                   {side.name} {side.price !== 0 && `+ $${side.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         <div>
//           <label htmlFor="quantity">Quantity:</label>
//           <input
//             type="number"
//             id="quantity"
//             name="quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(parseInt(e.target.value))}
//             min={1}
//             step={1}
//           />
//         </div>

//         <button onClick={finishItem}>Add To Cart</button>
//       </div>
//     </ReactModal>
//   );
// };
//////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import ReactModal from "react-modal";

// import { MenuItemType } from "../type";

// interface ModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   item: any;
// }

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "80%",
//     maxWidth: "500px",
//   },
// };

// export const PopupModalNew: React.FC<ModalProps> = ({
//   isOpen,
//   closeModal,
//   item,
// }) => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [firstOptionChoice, setFirstOptionChoice] = useState("");
//   const [secondOptionChoice, setSecondOptionChoice] = useState("");
//   const [sideChoice, setSideChoice] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   const setFirstOption = (price: number | string, name: string) => {
//     setFirstOptionChoice(name);
//   };

//   const setSecondOption = (price: number | string, name: string) => {
//     setSecondOptionChoice(name);
//   };

//   const setSideOption = (price: number | string, name: string) => {
//     setSideChoice(name);
//   };

//   const finishItem = () => {
//     console.log("Add to cart");
//   };

//   const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleAddToCart = () => {
//     // Add the selected option to the cart
//     console.log("Selected option:", selectedOption);
//     closeModal();
//   };

// useEffect(() => {
//   let tempArray: any = [];
//   item.allergies.map((object: any) => {
//     const [key, value] = Object.entries(object)[0];
//     value === true ? tempArray.push(key) : null;
//   });
//   setAllergyArray(tempArray);
// }, []);

//   return (
//     <ReactModal
//       isOpen={isOpen}
//       onRequestClose={closeModal}
//       style={customStyles}
//       contentLabel="Add to Cart"
//       ariaHideApp={false}
//     >
//       <div className="flex flex-col items-center">
//         <h2 className="text-xl font-semibold text-center text-dark mb-4">
//           {item.name}
//         </h2>
//         <p className="text-sm text-dark mb-2">{item.desc}</p>
//         {item.firstOptionName && (
//           <>
//             <h3 className="text-sm text-dark mb-2">
//               Choose: {item.firstOptionName}
//             </h3>
//             {item.firstOptions.map((option, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="radio"
//                   id={`firstOption-${index}`}
//                   name="firstOption"
//                   value={option.name}
//                   onChange={() => setFirstOption(option.price, option.name)}
//                 />
//                 <label
//                   htmlFor={`firstOption-${index}`}
//                   className="pl-2 text-dark"
//                 >
//                   {option.name} {option.price !== 0 && `+ $${option.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}
//         {item.secondOptionName && (
//           <>
//             <h3 className="text-sm text-dark mb-2">
//               Choose: {item.secondOptionName}
//             </h3>
//             {item.secondOptions.map((option, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="radio"
//                   id={`secondOption-${index}`}
//                   name="secondOption"
//                   value={option.name}
//                   onChange={() => setSecondOption(option.price, option.name)}
//                 />
//                 <label
//                   htmlFor={`secondOption-${index}`}
//                   className="pl-2 text-dark"
//                 >
//                   {option.name} {option.price !== 0 && `+ $${option.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         {item.sides.length > 0 && (
//           <>
//             <h3 className="text-sm text-dark mb-2">Choose: side item</h3>
//             {item.sides.map((side, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="radio"
//                   id={`side-${index}`}
//                   name="side"
//                   value={side.name}
//                   onChange={() => setSideOption(side.price, side.name)}
//                 />
//                 <label htmlFor={`side-${index}`} className="pl-2 text-dark">
//                   {side.name} {side.price !== 0 && `+ $${side.price}`}
//                 </label>
//               </div>
//             ))}
//           </>
//         )}

//         <div className="my-4">
//           <label htmlFor="quantity" className="text-sm text-dark mr-2">
//             Quantity:
//           </label>
//           <input
//             type="number"
//             id="quantity"
//             name="quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(parseInt(e.target.value))}
//             min={1}
//             step={1}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>

//         <button
//           className="bg-primary text-white py-2 px-4 rounded-full mt-4 hover:bg-muted duration-300 shadow-md"
//           onClick={finishItem}
//         >
//           Add To Cart
//         </button>
//       </div>
//     </ReactModal>
//   );
// };

///////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import ReactModal from "react-modal";

// import { MenuItemType } from "../type";

// interface ModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   item: any;
// }

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "75%",
//     maxHeight: "75%",
//     overflowY: "auto",
//   },
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.75)",
//   },
// };

// export const PopupModalNew: React.FC<ModalProps> = ({
//   isOpen,
//   closeModal,
//   item,
// }) => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [firstOptionChoice, setFirstOptionChoice] = useState("");
//   const [secondOptionChoice, setSecondOptionChoice] = useState("");
//   const [sideChoice, setSideChoice] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [allergyArray, setAllergyArray] = useState([]);
//   const [getTemps, setGetTemps] = useState([
//     {
//       label: "rare",
//       value: "rare",
//     },
//     {
//       label: "medium-rare",
//       value: "medium-rare",
//     },
//     {
//       label: "medium",
//       value: "medium",
//     },
//     {
//       label: "medium-well",
//       value: "medium-well",
//     },
//     {
//       label: "well",
//       value: "well",
//     },
//   ]);

//   const setFirstOption = (price: number | string, name: string) => {
//     setFirstOptionChoice(name);
//   };

//   const setSecondOption = (price: number | string, name: string) => {
//     setSecondOptionChoice(name);
//   };

//   const setSideOption = (price: number | string, name: string) => {
//     setSideChoice(name);
//   };

//   const finishItem = () => {
//     console.log("Add to cart");
//   };

//   const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleAddToCart = () => {
//     console.log("Selected option:", selectedOption);
//     closeModal();
//   };

//   useEffect(() => {
//     let tempArray: any = [];
//     item.allergies.map((object: any) => {
//       const [key, value] = Object.entries(object)[0];
//       value === true ? tempArray.push(key) : null;
//     });
//     setAllergyArray(tempArray);
//   }, []);

//   return (
//     <ReactModal
//       isOpen={isOpen}
//       onRequestClose={closeModal}
//       style={customStyles}
//       contentLabel="Add to Cart"
//       ariaHideApp={false}
//     >
//       <div className="flex flex-col items-center">
//         <h2 className="text-xl font-semibold text-center text-dark mb-4">
//           {item.name}
//         </h2>
//         <p className="text-sm text-dark mb-2">{item.desc}</p>
//         {item.allergies && (
//           <>
//             <h3 className="text-sm text-dark mb-2">Allergens</h3>
//             <ul className="list-disc pl-5">
//               {item.allergies.map((items, index) => (
//                 item.
//                 <li key={index} className="text-dark">
//                   {items}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//         {item.showRawWarning && (
//           <div className="bg-warning p-2 rounded-md text-white mb-4">
//             <p className="text-sm font-semibold">Warning:</p>
//             <p className="text-xs">
//               Consuming raw or undercooked meats, poultry, seafood, shellfish,
//               or eggs may increase your risk of foodborne illness, especially if
//               you have certain medical conditions.
//             </p>
//           </div>
//         )}
//         {item.ingredients && (
//           <>
//             <h3 className="text-sm text-dark mb-2">Ingredients</h3>
//             <ul className="list-disc pl-5">
//               {item.ingredients.map((ingredient, index) => (
//                 <li key={index} className="text-dark">
//                   {ingredient}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}

//         {item.selectTempRequired && (
//           <>
//             <h3 className="text-sm text-dark mb-2">Choose: Temperature</h3>
//             <div className="flex flex-wrap justify-around">
//               {item.temperatureOptions.map((temp, index) => (
//                 <div key={index} className="flex items-center mb-2 w-1/2">
//                   <input
//                     type="radio"
//                     id={`temp-${index}`}
//                     name="temp"
//                     value={temp}
//                     onChange={() => setSelectedOption(temp)}
//                   />
//                   <label htmlFor={`temp-${index}`} className="pl-2 text-dark">
//                     {temp}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//         {item.firstOptionName && (
//           <>
//             <h3 className="text-sm text-dark mb-2">
//               Choose: {item.firstOptionName}
//             </h3>
//             <div className="flex flex-wrap justify-around">
//               {item.firstOptions.map((option, index) => (
//                 <div key={index} className="flex items-center mb-2 w-1/2">
//                   <input
//                     type="radio"
//                     id={`firstOption-${index}`}
//                     name="firstOption"
//                     value={option.name}
//                     onChange={() => setFirstOption(option.price, option.name)}
//                   />
//                   <label
//                     htmlFor={`firstOption-${index}`}
//                     className="pl-2 text-dark"
//                   >
//                     {option.name} {option.price !== 0 && `+ $${option.price}`}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//         {item.secondOptionName && (
//           <>
//             <h3 className="text-sm text-dark mb-2">
//               Choose: {item.secondOptionName}
//             </h3>
//             <div className="flex flex-wrap justify-around">
//               {item.secondOptions.map((option, index) => (
//                 <div key={index} className="flex items-center mb-2 w-1/2">
//                   <input
//                     type="radio"
//                     id={`secondOption-${index}`}
//                     name="secondOption"
//                     value={option.name}
//                     onChange={() => setSecondOption(option.price, option.name)}
//                   />
//                   <label
//                     htmlFor={`secondOption-${index}`}
//                     className="pl-2 text-dark"
//                   >
//                     {option.name} {option.price !== 0 && `+ $${option.price}`}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {item.sides.length > 0 && (
//           <>
//             <h3 className="text-sm text-dark mb-2">Choose: side item</h3>
//             <div className="flex flex-wrap justify-around">
//               {item.sides.map((side, index) => (
//                 <div key={index} className="flex items-center mb-2 w-1/2">
//                   <input
//                     type="radio"
//                     id={`side-${index}`}
//                     name="side"
//                     value={side.name}
//                     onChange={() => setSideOption(side.price, side.name)}
//                   />
//                   <label htmlFor={`side-${index}`} className="pl-2 text-dark">
//                     {side.name} {side.price !== 0 && `+ $${side.price}`}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         <div className="my-4">
//           <label htmlFor="quantity" className="text-sm text-dark mr-2">
//             Quantity:
//           </label>
//           <input
//             type="number"
//             id="quantity"
//             name="quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(parseInt(e.target.value))}
//             min={1}
//             step={1}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>

//         <button
//           className="bg-primary text-white py-2 px-4 rounded-full mt-4 hover:bg-muted duration-300 shadow-md"
//           onClick={finishItem}
//         >
//           Add To Cart
//         </button>
//       </div>
//     </ReactModal>
//   );
// };

////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { HiMinusSmall } from "react-icons/hi2";
import { MdOutlineAdd } from "react-icons/md";
import ReactModal from "react-modal";
import Select from "react-select";

interface Option {
  name: string;
  price: number;
}

interface Item {
  name: string;
  desc: string;
  price: number;
  allergies: Array<string>;
  showRawWarning: boolean;
  ingredients: Array<string>;
  selectTempRequired: boolean;
  temperatureOptions: Array<string>;
  firstOptionName: string;
  firstOptions: Array<Option>;
  secondOptionName: string;
  secondOptions: Array<Option>;
  sides: Array<Option>;
  showTemp: boolean;
  secondOptionMultiple: boolean;
  firstOptionMultiple: boolean;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  item: Item;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    maxHeight: "75%",
    overflowY: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

export const PopupModalNew: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  item,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [firstOptionChoice, setFirstOptionChoice] = useState<string[]>([]);
  const [firstOptionPrice, setFirstOptionPrice] = useState(0);
  const [secondOptionChoice, setSecondOptionChoice] = useState<string[]>([]);
  const [secondOptionPrice, setSecondOptionPrice] = useState(0);
  const [sideChoice, setSideChoice] = useState<string | null>(null);
  const [sidePrice, setSidePrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [allergyArray, setAllergyArray] = useState<Array<string>>([]);

  const [getTemps, setGetTemps] = useState([
    { label: "rare", value: "rare" },
    { label: "medium-rare", value: "medium-rare" },
    { label: "medium", value: "medium" },
    { label: "medium-well", value: "medium-well" },
    { label: "well", value: "well" },
  ]);

  useEffect(() => {
    setItemPrice(item.price + firstOptionPrice + secondOptionPrice + sidePrice);
  }, [secondOptionPrice, sidePrice, firstOptionPrice, item.price]);

  const setFirstOption = (price: number, name: string) => {
    return new Promise((resolve, reject) => {
      let tempPrice = 0;

      item.firstOptionMultiple === false
        ? price === 0 || !price
          ? (setFirstOptionPrice(0), setFirstOptionChoice([name]), resolve())
          : (setFirstOptionPrice(price),
            setFirstOptionChoice([name]),
            resolve())
        : !firstOptionChoice
        ? (setFirstOptionPrice(price), setFirstOptionChoice([name]), resolve())
        : firstOptionChoice.includes(name) === false
        ? firstOptionChoice.length === 0
          ? ((tempPrice = price + firstOptionPrice),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
          : ((tempPrice = price + firstOptionPrice),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(firstOptionPrice - price, 0)),
          setFirstOptionPrice(tempPrice),
          setFirstOptionChoice(firstOptionChoice.filter((v) => v !== name)),
          resolve());
    });
  };

  const setSecondOption = (price: number, name: string) => {
    // console.log(price, name);
    // console.log("FOC", firstOptionChoice);
    return new Promise((resolve, reject) => {
      let tempPrice = 0;
      // console.log(props.route.params.item.firstOptionMultiple);
      item.secondOptionMultiple === false
        ? price === 0 || !price
          ? // console.log("nonmultiple"),
            (setSecondOptionPrice(0), setSecondOptionChoice([name]), resolve())
          : (setSecondOptionPrice(price),
            setSecondOptionChoice([name]),
            resolve())
        : !secondOptionChoice
        ? (setSecondOptionPrice(price),
          setSecondOptionChoice([name]),
          resolve())
        : secondOptionChoice.includes(name) === false
        ? secondOptionChoice.length === 0
          ? // console.log("multiple, doesn't include name, and length is 0."),
            ((tempPrice = price + secondOptionPrice),
            // console.log(tempPrice),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
          : //   console.log("multiple map & doesnt include name"),
            // console.log(firstOptionChoice),
            ((tempPrice = price + secondOptionPrice),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(secondOptionPrice - price, 0)),
          // console.log("TP", tempPrice),
          setSecondOptionPrice(tempPrice),
          setSecondOptionChoice(secondOptionChoice.filter((v) => v !== name)),
          // console.log("FOC", firstOptionChoice),
          resolve());
    });
  };

  const setSideOption = (price: number, name: string) => {
    return new Promise((resolve, reject) => {
      if (price === 0 || !price) {
        setSidePrice(0);
        setSideChoice(name);
        resolve();
      } else {
        setSidePrice(price);
        setSideChoice(name);
        resolve();
      }
    });
  };

  const finishItem = () => {
    console.log("Add to cart");
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAddToCart = () => {
    console.log("Selected option:", selectedOption);
    closeModal();
  };

  useEffect(() => {
    let tempArray: any = [];
    item.allergies.map((object: any) => {
      const [key, value] = Object.entries(object)[0];
      value === true ? tempArray.push(key) : null;
    });
    setAllergyArray(tempArray);
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Add to Cart"
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-center text-dark mb-4">
          {item.name}
        </h2>
        <p className="text-sm text-dark mb-2">{item.desc}</p>
        {item.allergies && allergyArray.length > 0 && (
          <>
            <h3 className="text-sm text-dark mb-2">Allergens</h3>
            <ul className="list-disc pl-5">
              {item.allergies.map((items, index) => {
                const [key, value] = Object.entries(items)[0];
                if (value === true) {
                  return (
                    <li key={index} className="text-dark">
                      {key.slice(0, key.length - 7)}
                    </li>
                  );
                }
              })}
            </ul>
          </>
        )}
        {item.showRawWarning && (
          <div className=" w-3/4 bg-warning py-4 rounded-md text-white mb-4">
            <p className="text-lg font-semibold text-dark">Warning:</p>
            <p className="text-xs text-dark">
              Consuming raw or undercooked meats, poultry, seafood, shellfish,
              or eggs may increase your risk of foodborne illness, especially if
              you have certain medical conditions.
            </p>
          </div>
        )}
        {item.ingredients && (
          <>
            <h3 className="text-sm text-dark mb-2">Ingredients</h3>
            <ul className="list-disc pl-5">
              {item.ingredients.map((ingredient, index) => (
                <li key={index} className="text-dark">
                  {ingredient}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* {item.selectTempRequired && (
          <>
            <h3 className="text-sm text-dark mb-2">Choose: Temperature</h3>
            <div className="flex flex-wrap justify-around">
              {item.temperatureOptions.map((temp, index) => (
                <div key={index} className="flex items-center mb-2 w-1/2">
                  <input
                    type="radio"
                    id={`temp-${index}`}
                    name="temp"
                    value={temp}
                    onChange={() => setSelectedOption(temp)}
                  />
                  <label htmlFor={`temp-${index}`} className="pl-2 text-dark">
                    {temp}
                  </label>
                </div>
              ))}
            </div>
          </>
        )} */}

        {item.showTemp && (
          <div className="w-3/4 py-4">
            <div className="w-full justify-between flex flex-row">
              <div className="text-lg">Select temperature:</div>

              <div className="w-44">
                {item.selectTempRequired && (
                  <div style={{ justifyContent: "center" }}>
                    <p>*Selection Required</p>
                  </div>
                )}
                <Select
                  placeholder="Temperature selection"
                  options={getTemps}
                  onChange={(selectedOption) => {
                    console.log(selectedOption);
                  }}
                  styles={{
                    container: (base) => ({
                      ...base,
                      zIndex: 11111,
                    }),
                    control: (base) => ({
                      ...base,
                      borderColor: "#E7E7E7",
                      color: "white",
                      backgroundColor: "white",
                      borderRadius: 5,
                      height: 61,
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "black",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#BFBEBE",
                      borderColor: "#E7E7E7",
                      zIndex: 999,
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {item.firstOptionName && (
          <>
            <div className="w-3/4">
              <h3 className="text-lg text-dark mb-2">
                Choose: {item.firstOptionName}
              </h3>
              <div className="py-4 px-2 grid grid-cols-2 gap-4 mt-2">
                {item.firstOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center mb-2 ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <input
                      type="radio"
                      id={`firstOption-${index}`}
                      name="firstOption"
                      value={option.name}
                      onChange={() => setFirstOption(option.price, option.name)}
                    />
                    <label
                      htmlFor={`firstOption-${index}`}
                      className="pl-2 text-dark"
                    >
                      {option.name} {option.price !== 0 && `+ $${option.price}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {item.secondOptionName && (
          <>
            <div className="w-3/4">
              <h3 className="text-lg text-dark mb-2">
                Choose: {item.secondOptionName}
              </h3>
              <div className="py-4 px-2 grid grid-cols-2 gap-4 mt-2">
                {item.secondOptions.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`secondOption-${index}`}
                      name="secondOption"
                      value={option.name}
                      onChange={() =>
                        setSecondOption(option.price, option.name)
                      }
                    />
                    <label
                      htmlFor={`secondOption-${index}`}
                      className="pl-2 text-dark"
                    >
                      {option.name} {option.price !== 0 && `+ $${option.price}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {item.sides.length > 0 && (
          <>
            <div className="w-3/4">
              <h3 className="text-lg text-dark mb-4">Choose: Side Item</h3>
              <div className="py-4 px-2 grid grid-cols-2 gap-4 mt-2">
                {item.sides.map((side, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="radio"
                      id={`side-${index}`}
                      name="side"
                      value={side.name}
                      onChange={() => setSideOption(side.price, side.name)}
                    />
                    <label htmlFor={`side-${index}`} className="pl-2 text-dark">
                      {side.name} {side.price !== 0 && `+ $${side.price}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* <div className="my-4">
          <label htmlFor="quantity" className="text-sm text-dark mr-2">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min={1}
            step={1}
            className="border rounded px-2 py-1 text-sm"
          />
        </div> */}

        <div className="w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3">
          <button
            // onClick={() =>
            //   dispatch(
            //     minusQuantity({
            //       _id: item._id,
            //       title: item.title,
            //       description: item.description,
            //       image: item.image,
            //       price: item.price,
            //       oldPrice: item.oldPrice,
            //       quantity: 1,
            //       brand: item.brand,
            //       category: item.category,
            //     })
            //   )
            // }
            onClick={(e) => setQuantity(Math.max(quantity - 1, 1))}
            className="text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
          >
            <HiMinusSmall />
          </button>
          <span>{quantity}</span>
          <button
            // onClick={() =>
            //   dispatch(
            //     plusQuantity({
            //       _id: item._id,
            //       title: item.title,
            //       description: item.description,
            //       image: item.image,
            //       price: item.price,
            //       oldPrice: item.oldPrice,
            //       quantity: 1,
            //       brand: item.brand,
            //       category: item.category,
            //     })
            //   )
            // }
            onClick={(e) => setQuantity(quantity + 1)}
            className="text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
          >
            <MdOutlineAdd />{" "}
          </button>
        </div>

        <button
          className="bg-primary text-white py-2 px-4 rounded-full mt-4 hover:bg-muted duration-300 shadow-md"
          onClick={finishItem}
        >
          Add To Cart
        </button>
      </div>
    </ReactModal>
  );
};

export default PopupModalNew;
