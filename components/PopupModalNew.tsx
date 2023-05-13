import React, { useState, useEffect } from "react";
import { HiMinusSmall } from "react-icons/hi2";
import { MdOutlineAdd } from "react-icons/md";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addToCart, checkCurrentRestaurant } from "redux/shoppersSlice";
import toast, { Toaster } from "react-hot-toast";

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
  firstOptionRequired: boolean;
  secondOptionRequired: boolean;
  sidesRequired: boolean;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  item: Item;
  rest: string;
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
  rest,
}) => {
  const dispatch = useDispatch();
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
  const [valueTemp, setValueTemp] = useState<string | null>(null);
  const [getTemps, setGetTemps] = useState([
    { label: "rare", value: "rare" },
    { label: "medium-rare", value: "medium-rare" },
    { label: "medium", value: "medium" },
    { label: "medium-well", value: "medium-well" },
    { label: "well", value: "well" },
  ]);

  const currentRest = useSelector(
    (state: any) => state.shopper.currentRestaurant
  );

  useEffect(() => {
    setItemPrice(item.price + firstOptionPrice + secondOptionPrice + sidePrice);
  }, [secondOptionPrice, sidePrice, firstOptionPrice, item.price]);

  const setFirstOption = (price: string, name: string) => {
    return new Promise((resolve, reject) => {
      let tempPrice = 0;

      item.firstOptionMultiple === false
        ? parseFloat(price) === 0 || !price
          ? (setFirstOptionPrice(0), setFirstOptionChoice([name]), resolve())
          : (setFirstOptionPrice(parseFloat(price)),
            setFirstOptionChoice([name]),
            resolve())
        : !firstOptionChoice
        ? (setFirstOptionPrice(parseFloat(price)),
          setFirstOptionChoice([name]),
          resolve())
        : firstOptionChoice.includes(name) === false
        ? firstOptionChoice.length === 0
          ? ((tempPrice = parseFloat(price) + firstOptionPrice),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
          : ((tempPrice = parseFloat(price) + firstOptionPrice),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(firstOptionPrice - parseFloat(price), 0)),
          setFirstOptionPrice(tempPrice),
          setFirstOptionChoice(firstOptionChoice.filter((v) => v !== name)),
          resolve());
    });
  };

  const setSecondOption = (price: string, name: string) => {
    // console.log(price, name);
    // console.log("FOC", firstOptionChoice);
    return new Promise((resolve, reject) => {
      let tempPrice = 0;
      // console.log(props.route.params.item.firstOptionMultiple);
      item.secondOptionMultiple === false
        ? parseFloat(price) === 0 || !price
          ? // console.log("nonmultiple"),
            (setSecondOptionPrice(0), setSecondOptionChoice([name]), resolve())
          : (setSecondOptionPrice(parseFloat(price)),
            setSecondOptionChoice([name]),
            resolve())
        : !secondOptionChoice
        ? (setSecondOptionPrice(parseFloat(price)),
          setSecondOptionChoice([name]),
          resolve())
        : secondOptionChoice.includes(name) === false
        ? secondOptionChoice.length === 0
          ? // console.log("multiple, doesn't include name, and length is 0."),
            ((tempPrice = parseFloat(price) + secondOptionPrice),
            // console.log(tempPrice),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
          : //   console.log("multiple map & doesnt include name"),
            // console.log(firstOptionChoice),
            ((tempPrice = parseFloat(price) + secondOptionPrice),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray): any => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(secondOptionPrice - parseFloat(price), 0)),
          // console.log("TP", tempPrice),
          setSecondOptionPrice(tempPrice),
          setSecondOptionChoice(secondOptionChoice.filter((v) => v !== name)),
          // console.log("FOC", firstOptionChoice),
          resolve());
    });
  };

  const setSideOption = (price: string, name: string) => {
    return new Promise((resolve, reject) => {
      if (parseFloat(price) === 0 || !price) {
        setSidePrice(0);
        setSideChoice(name);
        resolve();
      } else {
        setSidePrice(parseFloat(price));
        setSideChoice(name);
        resolve();
      }
    });
  };

  const getKey = (tempItem: string) => {
    let randKey = Math.random().toFixed(5);
    return `${tempItem}+${randKey}`;
  };

  const finishItem = () => {
    //  run checks on menu item

    if (item.selectTempRequired && valueTemp === null) {
      alert("Please make selections on required sections");
      return;
    }
    if (item.firstOptionRequired && firstOptionChoice.length === 0) {
      alert("Please make selections on required sections");
      return;
    }
    if (item.secondOptionRequired && secondOptionChoice.length === 0) {
      alert("Please make selections on required sections");
      return;
    }
    if (item.sidesRequired && sideChoice === null) {
      alert("Please make selections on required sections");
      return;
    }

    // check if we need to update restaurant

    console.log("currentRest", currentRest);
    console.log("rest", rest);

    dispatch(checkCurrentRestaurant({ rest: rest }));

    // generate random key for id and removing from cart

    let tempKey = getKey(item.name);

    //check if there are any modifiers, if not just push to cart with empty array

    if (firstOptionChoice || secondOptionChoice || sideChoice || valueTemp) {
      //remove duplicates from arrays

      let uniqueFirstOptionChoices = Array.from(new Set(firstOptionChoice));
      let uniqueSecondOptionChoices = Array.from(new Set(secondOptionChoice));

      dispatch(
        addToCart({
          item: item.name,
          id: tempKey,
          price: itemPrice,
          modifiers: [
            ...uniqueFirstOptionChoices,
            ...uniqueSecondOptionChoices,
            sideChoice,
            valueTemp,
          ],
          quantity: quantity,
        })
      ) &&
        toast.success(`${item.name.substring(0, 20)} is added to cart`) &&
        closeModal();
    } else {
      dispatch(
        addToCart({
          item: item.name,
          id: tempKey,
          price: itemPrice,
          modifiers: [],
          quantity: quantity,
        })
      ) &&
        toast.success(`${item.name.substring(0, 20)} is added to cart`) &&
        closeModal();
    }
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
                    setValueTemp(selectedOption.value);
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
              <div className="w-2/3 justify-between flex flex-row">
                <h3 className="text-lg text-dark mb-2">
                  Choose: {item.firstOptionName}{" "}
                </h3>
                <p className=" text-dark mt-2">
                  {item?.firstOptionRequired ? "  *Selection Required" : ""}
                </p>
              </div>
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
              <div className="w-2/3 justify-between flex flex-row">
                <h3 className="text-lg text-dark mb-2">
                  Choose: {item.secondOptionName}{" "}
                </h3>
                <p className=" text-dark mt-2">
                  {item?.secondOptionRequired ? "  *Selection Required" : ""}
                </p>
              </div>
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
              <div className="w-2/3 justify-between flex flex-row">
                <h3 className="text-lg text-dark mb-4">Choose: side item</h3>
                <p className=" text-dark mt-2">
                  {item?.sidesRequired ? "  *Selection Required" : ""}
                </p>
              </div>
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

        <div className="w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3">
          <button
            onClick={(e) => setQuantity(Math.max(quantity - 1, 1))}
            className="text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
          >
            <HiMinusSmall />
          </button>
          <span>{quantity}</span>
          <button
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
