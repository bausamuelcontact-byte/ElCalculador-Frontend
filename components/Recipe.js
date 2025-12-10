import styles from "../styles/Recipe.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeIngredient from "./ChangeIngredient";
import { useSelector } from "react-redux";

function Recipe() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState();
  const [isBob, setIsBob] = useState(true);
  const [nameRecipe, setNameRecipe] = useState("");
  const [price, setPrice] = useState();
  const [allergen, setAllergen] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [ingredientTotal, setIngredientTotal] = useState([]);
  const [tva, setTva] = useState();
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const user = useSelector((state) => state.user.value);

  // recuperation des ingrédients
  useEffect(() => {
    fetch(`http://localhost:3000/ingredients/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.ingredient);
        setIngredients(data.ingredient);
      });

    //recupération des catégorie
    fetch(`http://localhost:3000/categories/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategories(data);
      });

    //recupération des ingrédients dans la recette
    fetch(`http://localhost:3000/recipes/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ingredient =>", data);
      });
  }, []);

  //Affichage des ingrédients dans le menu déroulant
  const ingr = ingredients.map((data, i) => {
    return (
      <option key={i} value={data.name}>
        {data.name}
      </option>
    );
  });

  //Affichage des categorie dans le menu deroulant
  const categ = categories.map((data, i) => {
    return (
      <option key={i} value={data.name}>
        {data.name}
      </option>
    );
  });

  function handleAddIngredient() {
    setIngredientTotal([...ingredientTotal, ingredient]);
    console.log(ingredientTotal);
  }

  function handleAddRecipe() {
    fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRecipe,
        price: price,
        allergens: allergen,
        ingredients: ingredientTotal,
        user: user.id,
        TVA: tva,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
      });
  }

  return (
    <div className={styles.container}>
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
          <select
            className={styles.inputs}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value={null}>Categorie</option>
            {categ}
          </select>
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
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            value={quantity}
          ></input>
          <select
            className={styles.inputs}
            onChange={(e) => {
              setUnit(e.target.value);
            }}
          >
            <option value="Kg">Kg</option>
            <option value="gr">gr</option>
            <option value="mg">mg</option>
            <option value="L">L</option>
            <option value="cL">cL</option>
            <option value="mL">mL</option>
            <option value="Piece">Pièce</option>
          </select>
          <button
            onClick={() => {
              handleAddIngredient();
            }}
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
          >
            Créer une recette
          </button>
        </div>
      ) : (
        <div></div>
      )}
      <div className={styles.ingredients}>Hello</div>
      <div className={styles.stat}>Hi there</div>
    </div>
  );
}
export default Recipe;
