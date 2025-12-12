import styles from "../styles/ChangeIngredient.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChangeIngredient(props) {
  const user = useSelector((state) => state.user.value);
  const [ingredientCreation, setIngredientCreation] = useState({
    name: "",
    quantity: 0,
    price: 0,
    unit: "Kg",
    tva: 0,
  });
  const [ingredient, setIngredient] = useState({
    name: "",
    quantity: 0,
    price: 0,
    unit: " ",
    tva: 0,
  });
  console.log(props.info);
  //Création d'un ingrédient
  function handleAddIngredient() {
    fetch("http://localhost:3000/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ingredientCreation.name,
        quantity: ingredientCreation.quantity,
        unit: ingredientCreation.unit,
        price: ingredientCreation.price,
        tva: ingredientCreation.tva,
        user: user.id,
      }),
    });
    resetBtnCreation();
  }

  //modification d'un ingredient
  function handleModifIngredient() {
    fetch("http://localhost:3000/ingredients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.info._id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        price: ingredient.price,
        tva: ingredient.tva,
      }),
    });
    resetBtn();
  }

  //Suppression d'un ingrédient
  function handleDeleteIngredient() {
    fetch("http://localhost:3000/ingredients", {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.info._id,
      }),
    });
    resetBtn();
  }

  //Reset des inputs apres appuie sur bouton Modifier/ Supprimer
  function resetBtn() {
    setIngredient({
      name: "",
      quantity: 0,
      price: 0,
      unit: " ",
      tva: 0,
    });
  }

  //Reset des inputs apres appuie sur un bouton Créer un ingrédient
  function resetBtnCreation() {
    setIngredientCreation({
      name: "",
      quantity: 0,
      price: 0,
      unit: "Kg",
      tva: 0,
    });
  }

  //Recupération des infos de l'ingrédient listé
  useEffect(() => {
    setIngredient(props.info);
  }, [props.info]);

  // Change la valeur d'une propriété pour la modification
  const handleChange = (field, value) => {
    setIngredient((prev) => ({ ...prev, [field]: value }));
  };

  // Change la valeur d'une propriété pour la Création
  const handleChangeCreation = (field, value) => {
    setIngredientCreation((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div>
      {props.Creation ? (
        <div className={styles.container}>
          <div className={styles.contain}>
            <input
              placeholder="Nom de l'ingrédient"
              className={styles.inputs}
              onChange={(e) => handleChangeCreation("name", e.target.value)}
              value={ingredientCreation?.name || ""}
            ></input>
            <input
              placeholder="Quantité"
              className={styles.inputs}
              onChange={(e) => handleChangeCreation("quantity", e.target.value)}
              value={ingredientCreation?.quantity || ""}
            ></input>
            <select
              className={styles.btnAdd}
              onChange={(e) => handleChangeCreation("unit", e.target.value)}
              value={ingredientCreation?.unit || ""}
            >
              <option value="Kg">Kg</option>
              <option value="gr">gr</option>
              <option value="mg">mg</option>
              <option value="L">L</option>
              <option value="cL">cL</option>
              <option value="mL">mL</option>
              <option value="Piece">Pièce(s)</option>
            </select>
            <input
              placeholder="Prix"
              className={styles.inputs}
              onChange={(e) => handleChangeCreation("price", e.target.value)}
              value={ingredientCreation?.price || ""}
            ></input>
            <input
              placeholder="TVA"
              className={styles.inputs}
              onChange={(e) => handleChangeCreation("tva", e.target.value)}
              value={ingredientCreation?.tva || ""}
            ></input>
            <button
              className={styles.btnAdd}
              onClick={() => {
                handleAddIngredient();
              }}
            >
              Créer un ingrédient
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.contain}>
            <input
              placeholder="Nom de l'ingrédient"
              className={styles.inputs}
              onChange={(e) => handleChange("name", e.target.value)}
              value={ingredient?.name || ""}
            ></input>
            <input
              placeholder="Quantité"
              className={styles.inputs}
              onChange={(e) => handleChange("quantity", e.target.value)}
              value={ingredient?.quantity || ""}
            ></input>
            <select
              className={styles.inputs}
              onChange={(e) => handleChange("unit", e.target.value)}
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
            <input
              placeholder="Prix"
              className={styles.inputs}
              onChange={(e) => handleChange("price", e.target.value)}
              value={ingredient?.price || ""}
            ></input>
            <input
              placeholder="TVA"
              className={styles.inputs}
              onChange={(e) => handleChange("TVA", e.target.value)}
              value={ingredient?.TVA || ""}
            ></input>
            <button
              className={styles.btnAdd}
              onClick={() => {
                handleModifIngredient();
              }}
            >
              Modifier
            </button>
            <button
              className={styles.btnAdd}
              onClick={() => {
                handleDeleteIngredient();
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeIngredient;
