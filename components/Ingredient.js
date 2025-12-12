import styles from "../styles/Ingredient.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeIngredient from "./ChangeIngredient";
import { useSelector } from "react-redux";
import Header from "./Header";
import Menu from "./Menu";
import { FaRegEdit } from "react-icons/fa";
import { IconBase } from "react-icons/lib";

function Ingredient() {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };
  const [ingredients, setIngredients] = useState([]);
  const [searchIngredient, setSearchIngredient] = useState([]);
  const [isCreation, setIsCreation] = useState(true);
  const [selectIngredient, setSelectIngredient] = useState();
  const user = useSelector((state) => state.user.value);

  // recuperation des ingrédients
  useEffect(() => {
    fetch(`http://localhost:3000/ingredients/search/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data.ingredient);
      });
  }, []);

  //Permet de changer ChangeIngredient.js en modification
  function handleCreationFalse(data) {
    setIsCreation(false);
    setSelectIngredient(data);
  }
  //Permet de changer ChangeIngredient en création
  function handleCreationTrue() {
    setIsCreation(true);
  }

  //Affichage des ingrédients
  const ingredient = ingredients
    .filter((e) => e.name.includes(searchIngredient))
    .map((data, i) => {
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

      <div className={styles.search}>
        <input
          className={styles.searchBar}
          placeholder="Rechercher un ingrédient"
          onChange={(e) => {
            setSearchIngredient(e.target.value);
          }}
          value={searchIngredient}
        ></input>
        <button className={styles.btn} onClick={() => {}}>
          Ajouter ingrédient grâce à l'IA
        </button>
        <button
          className={styles.btn}
          onClick={() => {
            handleCreationTrue();
          }}
        >
          Créer un nouvel ingrédient
        </button>
      </div>
      <div className={styles.list}>{ingredient}</div>
      <div className={styles.add}>
        <ChangeIngredient
          Creation={isCreation}
          ingredient={ingredients}
          info={selectIngredient}
        />
      </div>
    </div>
  );
}
export default Ingredient;
