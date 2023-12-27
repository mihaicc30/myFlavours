import { AppContext } from "@/app/AppContextWrapper";
import CustomLoading from "@/app/CustomLoading";
import { db } from "@/app/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { SiCodechef } from "react-icons/si";
import imageCompression from "browser-image-compression";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export default function AddNewRecipe({ addNewRecipeModal, setAddNewRecipeModal }) {
  const { user } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    author: {
      avatar: user.avatar,
      displayName: user.displayName,
      uid: user.uid,
    },
    date: new Date().toISOString(),
    difficulty: 1,
    dishName: "",
    faved: 0,
    id: crypto.randomUUID(),
    imgs: [],
    ingredients: [
      {
        quantity: "",
        name: "",
      },
    ],
    instructions: [{ step: "" }],
    ratings: {
      avgRating: 0,
      usersRated: {},
    },
    servings: 1,
  });

  const generateOptions = (n) => {
    const options = [];
    for (let i = 1; i <= n; i++) {
      options.push(
        <option
          key={i}
          value={parseInt(i)}
        >
          {i}
        </option>
      );
    }
    return options;
  };

  const handleInputChange = (e, field, index) => {
    if (field === "quantity") {
      let updatedIngredients = [...newRecipe.ingredients];
      updatedIngredients[index][field] = parseInt(e.target.value);
      setNewRecipe({
        ...newRecipe,
        ingredients: updatedIngredients,
      });
    } else if (field === "name") {
      let updatedIngredients = [...newRecipe.ingredients];
      updatedIngredients[index][field] = e.target.value;
      setNewRecipe({
        ...newRecipe,
        ingredients: updatedIngredients,
      });
    } else if (field === "instructions") {
      let updatedInstructions = [...newRecipe.instructions];
      updatedInstructions[index]["step"] = e.target.value;
      setNewRecipe({
        ...newRecipe,
        instructions: updatedInstructions,
      });
    } else {
      setNewRecipe({
        ...newRecipe,
        [field]: ["difficulty", "servings"].indexOf(field) >= 0 ? parseInt(e.target.value) : e.target.value,
      });
    }
  };

  const handleAddIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { quantity: "", name: "" }],
    });
  };

  const generateIngredientsFields = () => {
    return newRecipe.ingredients.map((ingredient, index) => (
      <div
        key={index}
        className="grid grid-cols-2 max-[400px]:grid-cols-1 justify-items-center w-[100%]"
      >
        <input
          type="number"
          min={0}
          value={newRecipe.ingredients[index]["quantity"]}
          name={`quantity${index}`}
          onChange={(e) => handleInputChange(e, "quantity", index)}
          placeholder="Quantity in grams..."
          className="border-2 rounded-full my-1 py-1 px-4 w-[100%] text-center"
        />
        <input
          type="text"
          value={newRecipe.ingredients[index]["name"]}
          name={`name${index}`}
          onChange={(e) => handleInputChange(e, "name", index)}
          placeholder="Ingredient Name..."
          className="border-2 rounded-full my-1 py-1 px-4 w-[100%] max-[400px]:text-center"
        />
      </div>
    ));
  };

  const handleAddInstruction = () => {
    setNewRecipe({
      ...newRecipe,
      instructions: [...newRecipe.instructions, { step: "" }],
    });
  };

  const generateInstructionsFields = () => {
    return newRecipe.instructions.map((instruction, index) => (
      <div
        key={index}
        className="flex flex-nowrap gap-1 items-center w-[100%]"
      >
        {index + 1}.{" "}
        <input
          type="text"
          value={newRecipe.instructions[index]["step"]}
          name={`step${index}`}
          onChange={(e) => handleInputChange(e, "instructions", index)}
          placeholder={`Step...`}
          className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
        />
      </div>
    ));
  };

  const handleAddNewRecipe = () => {
    const filteredIngredients = newRecipe.ingredients.filter((ingredient) => String(ingredient.quantity) !== "" && String(ingredient.name).trim() !== "");

    const filteredInstructions = newRecipe.instructions.filter((instruction) => String(instruction.step).trim() !== "");

    const recipeToSubmit = {
      ...newRecipe,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    };

    const docRef = addDoc(collection(db, "recipes"), recipeToSubmit);
    resetAndCloseModal();
  };

  const resetAndCloseModal = () => {
    setNewRecipe({
      author: {
        avatar: user.avatar,
        displayName: user.displayName,
        uid: user.uid,
      },
      date: new Date().toISOString(),
      difficulty: 0,
      dishName: "",
      faved: 0,
      id: crypto.randomUUID(),
      imgs: [],
      ingredients: [
        {
          quantity: "",
          name: "",
        },
      ],
      instructions: [{ step: "" }],
      ratings: {
        avgScore: 0,
        usersRated: {},
      },
      servings: 0,
    });
    setAddNewRecipeModal(false);
  };

  const handleImageClick = () => {
    // Trigger the file input click
    document.getElementById("imageInput").click();
  };

  const handleImageUpload = async (e) => {
    const storage = getStorage();
    let file = e.target.files[0];

    if (file) {
      setUploading(true);
      const customFileName = `${Date.now()}_${file.name}`;

      const storageRef = ref(storage, `gs://culinary-fimiar.appspot.com/${customFileName}`);

      const compressedFile = await imageCompression(file, { maxSizeMB: 0.25 }); // Adjust the maxSizeMB as needed
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload the file to Cloud Storage
      await uploadBytes(storageRef, compressedFile, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded. Download URL:", downloadURL);

      setNewRecipe({
        ...newRecipe,
        imgs: [...newRecipe.imgs, String(downloadURL)],
      });

      setUploading(false);
    }
  };

  return (
    <div className={`p-4 transition`}>
      <button
        onClick={() => setAddNewRecipeModal(false)}
        className="border-2 hover:border-black transition rounded-full flex justify-center items-center px-3 py-3 bg-gray-200"
      >
        <MdOutlineArrowBackIosNew />
      </button>
      <p className="text-center text-lg">Add new recipe details</p>
      <div className="max-w-[800px] mx-auto">
        <span className="border-t-2 w-[50%] mx-auto h-2 flex my-4"></span>
        <div className={`group cursor-pointer relative flex flex-col text-center mt-[3svh] mx-[10vw] border-2 border-transparent hover:border-dashed hover:border-2 hover:border-inherit `}>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <div onClick={handleImageClick}>
            <p className="absolute select-none opacity-0 group-hover:bg-gray-200/80 transition group-hover:opacity-[100%] flex justify-center items-center w-[100%] h-[100%] text-xl">Upload new image</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {newRecipe.imgs.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="m-auto h-[100px] w-[100px] rounded-full my-4"
                src={newRecipe.imgs[0]}
                alt="Chef"
              />
            ) : (
              <SiCodechef className="m-auto h-[100px] w-[100px] rounded-full my-4" />
            )}
          </div>
          {uploading && (
            <div>
              <CustomLoading />
              Uploading...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 justify-items-center px-[10vw] mt-[1svw]">
          <label
            htmlFor="newRecipeDishName"
            className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
          >
            Recipe Name:
          </label>
          <input
            type="text"
            id="newRecipeDishName"
            placeholder="Enter Recipe Name..."
            value={newRecipe.dishName}
            onChange={(e) => handleInputChange(e, "dishName")}
            className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
          />
        </div>
        <div className="grid grid-cols-2 px-[10vw] mt-[1svw]">
          <div className="grid grid-cols-1 justify-items-center">
            <label
              htmlFor="newRecipeDifficulty"
              className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
            >
              Difficulty:
            </label>
            <select
              id="newRecipeDifficulty"
              value={newRecipe.difficulty}
              onChange={(e) => handleInputChange(e, "difficulty")}
              className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
            >
              {generateOptions(5)}
            </select>
          </div>
          <div className="grid grid-cols-1 justify-items-center">
            <label
              htmlFor="newRecipeServings"
              className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
            >
              Servings:
            </label>
            <select
              id="newRecipeServings"
              value={newRecipe.servings}
              onChange={(e) => handleInputChange(e, "servings")}
              className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
            >
              {generateOptions(8)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 justify-items-center px-[10vw] mt-[1svw]">
          <label
            htmlFor="newRecipeIngredients"
            className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
          >
            Ingredients:
          </label>
          {generateIngredientsFields()}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="border-2 rounded-full my-1 py-1 px-4"
          >
            ➕ Ingredient
          </button>
        </div>
        <div className="grid grid-cols-1 justify-items-center px-[10vw] mt-[1svw]">
          <label
            htmlFor="newRecipeInstructions"
            className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
          >
            Instructions:
          </label>
          {generateInstructionsFields()}
          <button
            type="button"
            onClick={handleAddInstruction}
            className="border-2 rounded-full my-1 py-1 px-4"
          >
            ➕ Instruction
          </button>
        </div>

        <div className="grid grid-cols-1 justify-items-center px-[10vw] gap-4 my-[5svh] col-span-full">
          <button
            onClick={handleAddNewRecipe}
            className="border-2 max-w-[140px] border-green-400 hover:text-white active:text-white hover:bg-green-400  active:bg-green-400 rounded-xl w-[100%] h-[14svh] items-center flex flex-col justify-center relative cursor-pointer text-3xl hover:text-4xl transition"
          >
            <p className="text-xs font-[600] text-center">Submit Recipe</p>
          </button>
        </div>
      </div>
    </div>
  );
}
