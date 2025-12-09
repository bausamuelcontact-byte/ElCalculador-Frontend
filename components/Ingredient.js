import styles from "../styles/Ingredient.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeIngredient from "./ChangeIngredient";

function Ingredient() {
  const [ingredients, setIngredients] = useState([]);
  const [searchIngredient, setSearchIngredient] = useState([]);
  const token = "DnRWUMfDOW7elz0y3gtAOrF1VBM9UcYw";
  const router = useRouter();

  // recuperation des ingrédients
  useEffect(() => {
    fetch(`http://localhost:3000/ingredients:${token}`)
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data.ingredient);
      });
  }, []);

  //Affichage des ingrédients
  const ingredient = ingredients
    .filter((e) => e.name.includes(searchIngredient))
    .map((data, i) => {
      console.log(test);

      return (
        <div className={styles.ingredient}>
          <div className={styles.NameIngredient}>
            <div className={styles.name}>Ingrédient : {data.name}</div>
            <div>Prix : {data.price}€</div>
          </div>
          <div>
            Quantité : {data.quantity}
            {data.unit}
          </div>
        </div>
      );
    });

  //Trie des ingrédient selon la recherche
  function search() {}

  return (
    <div className={styles.container}>
      header
      <div className={styles.search}>
        <input
          className={styles.searchBar}
          placeholder="Rechercher un ingrédient"
          onChange={(e) => {
            setSearchIngredient(e.target.value);
          }}
          value={searchIngredient}
        ></input>
        <button
          className={styles.btnIA}
          onClick={() => {
            router.push("/ChangeIngredient");
          }}
        >
          Ajouter ingrédient grâce à l'IA
        </button>
        <button className={styles.btnAddTop}>Créer un nouvel ingrédient</button>
      </div>
      <div className={styles.list}>{ingredient}</div>
      <div className={styles.add}>
        <ChangeIngredient />
      </div>
    </div>
  );
}
export default Ingredient;
