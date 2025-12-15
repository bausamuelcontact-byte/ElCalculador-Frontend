import styles from "../styles/Recipe.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeIngredient from "./ChangeIngredient";
import { useSelector } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import Header from "./Header";
import Menu from "./Menu";
import { FaRegEdit } from "react-icons/fa";
import { IconBase } from "react-icons/lib";
import Category from "./Category";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

function Recipe() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  
  const [catModalVisible, setCatModalVisible] = useState(false);
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
  const [selectedValues, setSelectedValues] = useState([]);
  const [selected, setSelected] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [ingredientRecipe, setIngredientRecipe] = useState([]);

  const user = useSelector((state) => state.user.value);

  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };

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
        console.log("categories",data);
        setCategories(data.categories);
      });

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
      <option key={i} value={data._id}>
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
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({
          categoryId: category,
          recipeId: data.recipeId,  
        }),
      });})
      .then((response) => response.json())
        .then((data) => {
          console.log("cat",data)
          alert(data.message);
        })
  };

  const handleRemoveRecipe = ()=>{
      fetch(`http://localhost:3000/categories/removeRecipeFromCategory`,
       { method: "DELETE"}
      
    .then((response) => response.json())
    .then((data) => {
        //    console.log(data);            
       })
  )}

  function handleAddIngredient() {
    const newIngredient = {
      ingredient: ingredient,
      quantity: quantity,
      unit: unit,
    };
    setIngredientTotal([...ingredientTotal, newIngredient]);
    console.log("total", ingredientTotal);
  }
  console.log("ingredientRecipe =>", ingredientRecipe);

  //Affichage des ingrédient de la recette à droite
  const ingredientDisplay = ingredientTotal.map((data, i) => {
    return (
      <div className={styles.ingredient} key={i}>
        <div className={styles.NameIngredient}>
          <div className={styles.name}>
            <span className={styles.description}>Ingrédient : </span>
            {data.name}
          </div>
          <div>
            <span className={styles.description}>Prix : </span>
            {data.price}€
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
                handleCreationFalse(data);
              }}
            />
          </div>
        </div>
      </div>
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
            <BiSolidMessageSquareEdit size={25} onClick={()=>(setCatModalVisible(true))}/>
            <Category catModalVisible={catModalVisible} setCatModalVisible={setCatModalVisible}></Category>
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
          
            {ingredientTotal.map((data, i) => (
              <div key={i}>
                {data.ingredient} - {data.quantity} {data.unit}
              </div>
            ))}
          
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
        <div></div>
      )}
      <div className={styles.ingredients}>{ingredientDisplay}</div>
      <div className={styles.stat}>Hi there</div>
    </div>
  );
}
export default Recipe;
