import React, { useState } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "500px",
  },
};

export const PopupModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAddToCart = () => {
    // Add the selected option to the cart
    console.log("Selected option:", selectedOption);
    closeModal();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Add to Cart"
      ariaHideApp={false}
    >
      <h2 className="text-xl font-semibold text-center text-dark mb-4">
        Add to Cart
      </h2>
      <div className="flex flex-col items-center">
        <label className="text-sm text-dark mb-2">Select an option:</label>
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="option1"
              name="option"
              value="Option 1"
              checked={selectedOption === "Option 1"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option1" className="pl-2 text-dark">
              Option 1
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="option2"
              name="option"
              value="Option 2"
              checked={selectedOption === "Option 2"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option2" className="pl-2 text-dark">
              Option 2
            </label>
          </div>
        </div>
        <button
          className="bg-primary text-white py-2 px-4 rounded-full mt-4 hover:bg-muted duration-300 shadow-md"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </ReactModal>
  );
};
