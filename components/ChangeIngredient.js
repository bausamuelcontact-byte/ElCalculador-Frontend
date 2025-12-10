import styles from "../styles/ChangeIngredient.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";

function ChangeIngredient(props) {
  const [nameIngredient, setNameIngredient] = useState("");
  const [quantity, setQuantity] = useState();
  const [unit, setUnit] = useState();
  const [price, setPrice] = useState();
  const [tva, setTva] = useState();
  const user = useSelector((state) => state.user.value);

  //Création d'un ingrédient
  function handleAddIngredient() {
    fetch("http://localhost:3000/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameIngredient,
        quantity: quantity,
        unit: unit,
        price: price,
        tva: tva,
        user: user.id,
      }),
    });
  }

  console.log("props", props);
  //modification d'un ingredient
  function handleModifIngredient() {}

  return (
    <div>
      {props.Creation ? (
        <div>
          <div className={styles.container}>
            <input
              placeholder="Nom de l'ingrédient"
              className={styles.inputs}
              onChange={(e) => {
                setNameIngredient(e.target.value);
              }}
              value={nameIngredient}
            ></input>
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
          </div>

          <button
            onClick={() => {
              handleAddIngredient();
            }}
          >
            Créer un ingrédient
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.container}>
            <input
              placeholder="Nom de l'ingrédient"
              className={styles.inputs}
              onChange={(e) => {
                setNameIngredient(props.info.name);
              }}
              value={props.info.name}
            ></input>
            <input
              placeholder="Quantité"
              className={styles.inputs}
              onChange={(e) => {
                setQuantity(props.info.quantity);
              }}
              value={props.info.quantity}
            ></input>
            <select
              className={styles.inputs}
              onChange={(e) => {
                setUnit(props.info.unit);
              }}
              value={props.info.unit}
            >
              <option value="Kg">Kg</option>
              <option value="gr">gr</option>
              <option value="mg">mg</option>
              <option value="L">L</option>
              <option value="cL">cL</option>
              <option value="mL">mL</option>
              <option value="Piece">Pièce</option>
            </select>
            <input
              placeholder="Prix"
              className={styles.inputs}
              onChange={(e) => {
                setPrice(props.info.price);
              }}
              value={props.info.price}
            ></input>
            <input
              placeholder="TVA"
              className={styles.inputs}
              onChange={(e) => {
                setTva(props.info.TVA);
              }}
              value={props.info.TVA}
            ></input>
          </div>

          <button onClick={() => {}}>Modifier</button>
          <button onClick={() => {}}>Supprimer</button>
        </div>
      )}
    </div>
  );
}

export default ChangeIngredient;
