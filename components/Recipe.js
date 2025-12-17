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
  // const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [isBob, setIsBob] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [nameRecipe, setNameRecipe] = useState("");
  const [price, setPrice] = useState();
  const [allergen, setAllergen] = useState([]);
  //entièreté des ingredients dans le menu deroulant
  const [ingredients, setIngredients] = useState([]);
  //liste des ingrédient qui vont etre dans la recette
  const [ingredientTotal, setIngredientTotal] = useState([]);
  const [tva, setTva] = useState();
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [ingredientRecipe, setIngredientRecipe] = useState([]);
  const [ingredient, setIngredient] = useState({
    name: "",
    quantity: 0,
    price: 0,
    unit: "Kg",
    tva: 0,
  });

  const user = useSelector((state) => state.user.value);
  const categories = useSelector((state) => state.categories.value);

  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };

  // recuperation des ingrédients
  useEffect(() => {
    fetch(`http://localhost:3000/ingredients/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("dataIngredeint", data.ingredient);
        setIngredients(data.ingredient);
      });

    //recupération des catégories
    // fetch(`http://localhost:3000/categories/${user.id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("categories", data);
    //     setCategories(data.categories);
    //   });

    //recupération des ingrédients dans la recette
    fetch(`http://localhost:3000/recipes/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ingredient =>", data);
        setIngredientRecipe(data.recipe);
      });
  }, []);

  //Affichage des ingrédients dans le menu déroulant
  const ingr = ingredients.map((data, i) => {
    return (
      <option key={i} value={data.name} price={data.price}>
        {data.name}
      </option>
    );
  });

  //Affichage des categorie dans le menu deroulant
  const categ = categories.map((data, i) => {
    return (
      <option key={i} value={data._id}>
        {data.name}
      </option>
    );
  });

  //Création de la recette
  function handleAddRecipe() {
    fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRecipe,
        price: price,
        allergens: allergen,
        ingredients: ingredientTotal,
        id: user.id,
        tva: tva,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        console.log("valeur", selectedValues);
        console.log("categoryId:", category);
        console.log("recipeId:", data.recipeId);

        return fetch("http://localhost:3000/categories/addRecipeToCategory", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: category,
            recipeId: data.recipeId,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("cat", data);
        alert(data.message);
      });
  }

  //Modification d'une recette
  function handleModificationRecipe() {
    fetch("http://localhost:3000/recipes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRecipe,
        price: price,
        allergens: allergen,
        ingredients: ingredientTotal,
        id: user.id,
        tva: tva,
      }),
    })
      .then((response) => response.json())
      .then((data) => {});
  }
  const handleRemoveRecipe = () => {
    fetch(
      `http://localhost:3000/categories/removeRecipeFromCategory`,
      { method: "DELETE" }

        .then((response) => response.json())
        .then((data) => {
          //    console.log(data);
        })
    );
  };

  function handleAddIngredient() {
    setIngredientTotal([...ingredientTotal, ingredient]);
    console.log("total", ingredient);
  }

  //Affichage des ingrédient de la recette à droite
  const ingredientDisplay = ingredientTotal.map((data, i) => {
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

  // Change la valeur d'une propriété pour la Création
  const handleChangeCreation = (field, value) => {
    setIngredient((prev) => ({ ...prev, [field]: value }));
  };

  //Affichage du tableau bas gauche
  const ingredientArray = ingredientTotal.map((data, i) => {
    let priceUse = data.price / data.quantity;
    console.log("ingredient array =>", data);
    return (
      <tr className={styles.ligne}>
        <td className={styles.ligne}>{data.name}</td>
        <td className={styles.ligne}>{priceUse}</td>
        <td className={styles.ligne}>{data.name}</td>
      </tr>
    );
  });

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
              setNameRecipe(e.target.value);
            }}
            value={nameRecipe}
          ></input>
          <div className={styles.category}>
            <select
              className={styles.inputs}
              onChange={(e) => {
                setCategory(e.target.value);
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
                handleChangeCreation("name", e.target.value),
                  handleChangeCreation("price", e.target.price);
              }}
              value={ingredient?.name || ""}
              price={ingredient?.price || ""}
            >
              <option value={null}>Ingrédient</option>
              {ingr}
            </select>
            <FaRegEdit
              className={styles.modify}
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

          <select
            className={styles.inputs}
            onChange={(e) => {
              setIngredient(e.target.value);
            }}
          >
            <option value={null}>Ingrédient</option>
            {ingr}
          </select>
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
              setPrice(e.target.value);
            }}
            value={price}
          ></input>
          <input
            placeholder="TVA"
            className={styles.inputs}
            onChange={(e) => {
              setTva(e.target.value);
            }}
            value={tva}
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
              setNameRecipe(e.target.value);
            }}
            value={nameRecipe}
          ></input>
          <select
            className={styles.inputs}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value={null}>Categorie</option>
            {categ}
          </select>
          <div>
            <select
              className={styles.inputs}
              onChange={(e) => handleChangeCreation("name", e.target.value)}
              value={ingredient?.name || ""}
            >
              <option value={null}>Ingrédient</option>
              {ingr}
            </select>
            <FaRegEdit
              className={styles.modify}
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
              setPrice(e.target.value);
            }}
            value={price}
          ></input>
          <input
            placeholder="TVA"
            className={styles.inputs}
            onChange={(e) => {
              setTva(e.target.value);
            }}
            value={tva}
          ></input>
          <button
            onClick={() => {
              handleModificationRecipe();
            }}
            className={styles.btn}
          >
            Modifier la recette
          </button>
        </div>
      )}
      <div className={styles.ingredients}>{ingredientDisplay}</div>
      <div className={styles.stat}>
        <table className={styles.array}>
          <tr className={styles.ligne}>
            <td className={styles.ligne}>Nom de l'ingrédient</td>
            <td className={styles.ligne}>Prix quantité utilisée</td>
            <td className={styles.ligne}>Total</td>
          </tr>
          {ingredientArray}
        </table>
      </div>
    </div>
  );
}
export default Recipe;
