import styles from "../styles/Recipe.module.css";
import { useState, useEffect } from "react";
import ChangeIngredient from "./ChangeIngredient";
import { useSelector } from "react-redux";
import Header from "./Header";
import Menu from "./Menu";
import { FaRegEdit } from "react-icons/fa";
import { IconBase } from "react-icons/lib";
import ReactModal from "react-modal";
import Category from "./Category";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

function Recipe() {
  const [allergen, setAllergen] = useState([]);
  let ingredientDisplay = {};
  //Liste des catégories dans le menu déroulant
  //const [categories, setCategories] = useState([]);
  //Catégorie de la recette qu'on est entrain d'etre modifié
  const [category, setCategory] = useState("");
  //Booléen d'affichage de la modale catégorie
  const [catModalVisible, setCatModalVisible] = useState(false);
  //Booléen de Modification ou Création d'une recette
  const [isBob, setIsBob] = useState(true);
  //Booléen modal de création Ingrédient
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  //Entièreté des ingredients dans le menu deroulant
  const [ingredients, setIngredients] = useState([]);
  //Liste des ingrédient qui vont etre dans la recette
  const [ingredientTotal, setIngredientTotal] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(false);
  //Ingrédient qu'on ajoute 1 par 1 dans la recette ( name, quantity, unit)
  const [ingredient, setIngredient] = useState({
    id: null,
    name: "",
    quantity: 0,
    price: 0,
    unit: "Kg",
    tva: 0,
  });
  // Recette qu'on est entrain de créer
  const [recipe, setRecipe] = useState({
    name: "",
    allergens: [],
    category: 0,
    price: 0,
    tva: 0,
  });

  const user = useSelector((state) => state.user.value);
  const recipeReducer = useSelector((state) => state.recipe.value);
  const categories = useSelector((state) => state.categories.value);

  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };

  useEffect(() => {
    // recuperation des ingrédients pour le menu déroulant
    fetch(`http://localhost:3000/ingredients/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data.ingredient);
      });

    //recupération des catégories
    // fetch(`http://localhost:3000/categories/${user.id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("categories", data);
    //     setCategories(data.categories);
    //   });

    if (!isBob) {
      setRecipe(recipeReducer);
      setIngredientTotal(recipeReducer.ingredients);

      //Recuperation de la categorie grace a l'ID Recipe
      fetch(`http://localhost:3000/categories/recipeId/${recipeReducer._id}`)
        .then((response) => response.json())
        .then((data) => {
          setCategory(data.category[0]);
        });
    }
  }, []);

  //Affichage des ingrédients dans le menu déroulant
  const ingr = ingredients.map((data, i) => {
    return (
      <option key={i} value={data._id} price={data.price}>
        {data.name}
      </option>
    );
  });

  //Affichage des categorie dans le menu deroulant
  const categ = categories?.map((data, i) => {
    return (
      <option key={i} value={data._id}>
        {data.name}
      </option>
    );
  });

  //Création de la recette
  function handleAddRecipe() {
    console.log("test", ingredientTotal);
    fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: recipe.name,
        price: recipe.price,
        allergens: allergen,
        ingredients: ingredientTotal,
        id: user.id,
        tva: recipe.tva,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return fetch("http://localhost:3000/categories/addRecipeToCategory", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: recipe.category,
            recipeId: data.recipeId,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {});

    //Remise à zéro des champs pour création d'une nouvelle recette
    setRecipe({
      name: "",
      allergen: [],
      category: 0,
      price: 0,
      tva: 0,
    });
    setIngredient({
      ingredient: "",
      quantity: 0,
      unit: "Kg",
    });
    setIngredientTotal([]);
  }

  //Modification d'une recette
  function handleModifyRecipe() {
    fetch("http://localhost:3000/recipes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: recipe.name,
        price: recipe.price,
        allergens: allergen,
        ingredients: ingredientTotal,
        id: recipe._id,
        tva: recipe.tva,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(recipe.tva);
      });
    RecipeModifyCategory();
  }
  const handleRemoveRecipe = () => {
    fetch(`http://localhost:3000/categories/removeRecipeFromCategory`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: recipe.category,
        recipeId: recipe._id,
      }),
    });
    fetch(`http://localhost:3000/recipes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: recipe._id,
      }),
    });
  };

  function handleAddIngredient() {
    const newIngredient = {
      id: ingredient.id,
      ingredient: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    };
    console.log("ingr", ingredient);
    setIngredientTotal([...ingredientTotal, newIngredient]);
    setIngredient({
      id: null,
      name: "",
      quantity: 0,
      price: 0,
      unit: "Kg",
      tva: 0,
    });
  }

  //Affichage des ingrédient liste de la recette à droite
  if (isBob) {
    ingredientDisplay = ingredientTotal.map( (data, i) => {

      return (
        <div className={styles.ingredient} key={i}>
          <div className={styles.NameIngredient}>
            <div className={styles.name}>
              <span className={styles.description}>Ingrédient : </span>
              {data.name}
            </div>
          </div>
          <div className={styles.bottom}>
            <div>
              <span className={styles.description}>Quantité : </span>
              {data.quantity}
              <span> </span>
              {data.unit}
            </div>
            <div>
              <FaRegEdit
                className={styles.modify}
                onClick={() => {
                  setIsVisibleModal(!isVisibleModal);
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  } else {
    ingredientDisplay = recipeReducer.ingredients.map((data, i) => {
      return (
        <div className={styles.ingredient} key={i}>
          <div className={styles.NameIngredient}>
            <div className={styles.name}>
              <span className={styles.description}>Ingrédient : </span>
              {data.name}
            </div>
          </div>
          <div className={styles.bottom}>
            <div>
              <span className={styles.description}>Quantité : </span>
              {data.quantity}
              <span> </span>
              {data.unit}
            </div>
            <div>
              <FaRegEdit
                className={styles.modify}
                onClick={() => {
                  setIsVisibleModal(!isVisibleModal);
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  }

  // Change la valeur d'une propriété ingredient pour la Création
  const handleChangeCreation = (field, value) => {
    setIngredient((prev) => ({ ...prev, [field]: value }));
  };

  // Change la valeur d'une propriété recette pour la Création
  const handleChangeCreationRecipe = (field, value) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  function RecipeModifyCategory() {
    console.log("recipeID", recipe._id);
    console.log("categoryID", recipe.category);

    fetch("http://localhost:3000/categories/removeRecipeFromCategory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: recipe.category,
        recipeId: recipe._id,
      }),
    });

    fetch("http://localhost:3000/categories/addRecipeToCategory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: recipe.category,
        recipeId: recipe._id,
      }),
    });
  }

  return (
    <div className={styles.container}>
      <Header onToggleMenu={toggleMenu} />
      {visibleMenu && <Menu />}
      {isBob ? (
        <div className={styles.left}>
          <input
            placeholder="Nom de la recette"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("name", e.target.value);
            }}
            value={recipe?.name || ""}
          ></input>
          <div className={styles.category}>
            <select
              className={styles.inputs}
              onChange={(e) => {
                handleChangeCreationRecipe("category", e.target.value);
              }}
            >
              <option value={null}>Categorie</option>
              {categ}
            </select>
            <BiSolidMessageSquareEdit
              size={25}
              onClick={() => setCatModalVisible(true)}
            />
            <Category
              catModalVisible={catModalVisible}
              setCatModalVisible={setCatModalVisible}
            />
          </div>
          <div>
            <select
              className={styles.inputs}
              onChange={(e) => {
              const selectedIngredient = ingredients.find(
                (ing) => ing._id === e.target.value
              );

              setIngredient({
                ...ingredient,
                id: selectedIngredient._id,
                name: selectedIngredient.name,
                price: selectedIngredient.price,
              });
            }}
            value={ingredient?.id || ""}
            >
              <option value={null}>Ingrédient</option>
              {ingr}
            </select>
            <BiSolidMessageSquareEdit
              className={styles.modify}
              size={25}
              onClick={() => {
                setIsVisibleModal(!isVisibleModal);
              }}
            />
            <ReactModal
              isOpen={isVisibleModal}
              closeTimeoutMS={250}
              shouldCloseOnEsc={true}
              shouldCloseOnOverlayClick={true}
              onRequestClose={() => setIsVisibleModal(false)}
              style={{
                overlay: {
                  position: "fixed",
                },
                content: {
                  position: "absolute",
                  top: "17%",
                  left: "35%",
                  right: "35%",
                  bottom: "17%",
                  border: "1px solid #ccc",
                  background: "#fff",
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: "4px",
                  outline: "none",
                  padding: "20px",
                },
              }}
            >
              <ChangeIngredient Creation={isVisibleModal} />
              <button onClick={() => setIsVisibleModal(false)}>Close</button>
            </ReactModal>
          </div>

          <input
            placeholder="Quantité"
            className={styles.inputs}
            onChange={(e) => handleChangeCreation("quantity", e.target.value)}
            value={ingredient?.quantity || ""}
          ></input>
          <select
            className={styles.inputs}
            onChange={(e) => handleChangeCreation("unit", e.target.value)}
            value={ingredient?.unit || ""}
          >
            <option value="Kg">Kg</option>
            <option value="gr">gr</option>
            <option value="mg">mg</option>
            <option value="L">L</option>
            <option value="cL">cL</option>
            <option value="mL">mL</option>
            <option value="Piece">Pièce(s)</option>
          </select>
          <button
            onClick={() => {
              handleAddIngredient();
            }}
            className={styles.btn}
          >
            Ajouter un ingrédient
          </button>

          <select
            className={styles.inputs}
            onChange={(e) => {
              setAllergen(e.target.value);
            }}
          >
            <option value={null}>Allergènes</option>
            <input value={"Gluten"} type="checkbox" title="Gluten" />
            <option value={"Crustacé"}>Crustacé</option>
            <option value={"Oeuf"}>Oeuf</option>
            <option value={"Poisson"}>Poisson</option>
            <option value={"Soja"}>Soja</option>
            <option value={"Céleri"}>Céleri</option>
            <option value={"Arachides"}>Arachides</option>
            <option value={"Lactose"}>Lactose</option>
            <option value={"Fruits à coques"}>Fruits à coques</option>
            <option value={"Moutarde"}>Moutarde</option>
            <option value={"Sésame"}>Sésame</option>
            <option value={"Sulfite"}>Sulfite</option>
            <option value={"Lupin"}>Lupin</option>
            <option value={"Mollusques"}>Mollusques</option>
          </select>
          <input
            placeholder="Prix"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("price", e.target.value);
            }}
            value={recipe?.price || ""}
          ></input>
          <input
            placeholder="TVA"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("tva", e.target.value);
            }}
            value={recipe?.tva || ""}
          ></input>
          <button
            onClick={() => {
              handleAddRecipe();
            }}
            className={styles.btn}
          >
            Créer une recette
          </button>
        </div>
      ) : (
        <div className={styles.left}>
          <input
            placeholder="Nom de la recette"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("name", e.target.value);
            }}
            value={recipe?.name || ""}
          ></input>
          <div className={styles.category}>
            <select
              className={styles.inputs}
              onChange={(e) => {
                handleChangeCreationRecipe("category", e.target.value);
              }}
            >
              <option value={category?._id || ""}>
                {category?.name || ""}
              </option>
              <option value={null}>Categorie</option>
              {categ}
            </select>
            <BiSolidMessageSquareEdit
              size={25}
              onClick={() => setCatModalVisible(true)}
            />
            <Category
              catModalVisible={catModalVisible}
              setCatModalVisible={setCatModalVisible}
            />
          </div>
          <div>
            <select
              className={styles.inputs}
              onChange={(e) => { const selectedIngredient = ingredients.find( (ing) => ing._id === e.target.value);
               setIngredient({
                      ...ingredient,
                      id: selectedIngredient._id,
                      name: selectedIngredient.name,
                      price: selectedIngredient.price,
                    });
                  }}
                  value={ingredient?.id || ""}
            >
              <option value={""}>Ingrédient</option>
              {ingr}
            </select>
            <BiSolidMessageSquareEdit
              className={styles.modify}
              size={25}
              onClick={() => {
                setIsVisibleModal(!isVisibleModal);
              }}
            />
            <ReactModal
              isOpen={isVisibleModal}
              closeTimeoutMS={250}
              shouldCloseOnEsc={true}
              shouldCloseOnOverlayClick={true}
              onRequestClose={() => setIsVisibleModal(false)}
              style={{
                overlay: {
                  position: "fixed",
                },
                content: {
                  position: "absolute",
                  top: "17%",
                  left: "35%",
                  right: "35%",
                  bottom: "17%",
                  border: "1px solid #ccc",
                  background: "#fff",
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: "4px",
                  outline: "none",
                  padding: "20px",
                },
              }}
            >
              <ChangeIngredient Creation={isVisibleModal} />
              <button onClick={() => setIsVisibleModal(false)}>Close</button>
            </ReactModal>
          </div>

          <input
            placeholder="Quantité"
            className={styles.inputs}
            onChange={(e) => handleChangeCreation("quantity", e.target.value)}
            value={ingredient?.quantity || ""}
          ></input>
          <select
            className={styles.inputs}
            onChange={(e) => handleChangeCreation("unit", e.target.value)}
            value={ingredient?.unit || ""}
          >
            <option value="Kg">Kg</option>
            <option value="gr">gr</option>
            <option value="mg">mg</option>
            <option value="L">L</option>
            <option value="cL">cL</option>
            <option value="mL">mL</option>
            <option value="Piece">Pièce(s)</option>
          </select>
          <button
            onClick={() => {
              handleAddIngredient();
            }}
            className={styles.btn}
          >
            Ajouter un ingrédient
          </button>

          <select
            className={styles.inputs}
            onChange={(e) => {
              setAllergen(e.target.value);
            }}
          >
            <option value={null}>Allergènes</option>
            <input value={"Gluten"} type="checkbox" title="Gluten" />
            <option value={"Crustacé"}>Crustacé</option>
            <option value={"Oeuf"}>Oeuf</option>
            <option value={"Poisson"}>Poisson</option>
            <option value={"Soja"}>Soja</option>
            <option value={"Céleri"}>Céleri</option>
            <option value={"Arachides"}>Arachides</option>
            <option value={"Lactose"}>Lactose</option>
            <option value={"Fruits à coques"}>Fruits à coques</option>
            <option value={"Moutarde"}>Moutarde</option>
            <option value={"Sésame"}>Sésame</option>
            <option value={"Sulfite"}>Sulfite</option>
            <option value={"Lupin"}>Lupin</option>
            <option value={"Mollusques"}>Mollusques</option>
          </select>
          <input
            placeholder="Prix"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("price", e.target.value);
            }}
            value={recipe?.price || ""}
          ></input>
          <input
            placeholder="TVA"
            className={styles.inputs}
            onChange={(e) => {
              handleChangeCreationRecipe("tva", e.target.value);
            }}
            value={recipe?.tva || ""}
          ></input>
          <button
            onClick={() => {
              handleModifyRecipe();
            }}
            className={styles.btn}
          >
            Modifier une recette
          </button>
          <button
            onClick={() => {
              handleRemoveRecipe();
            }}
            className={styles.btn}
          >
            Suppression de la recette
          </button>
        </div>
      )}
      <div className={styles.ingredients}>{ingredientDisplay}</div>
    </div>
  );
}
export default Recipe;
