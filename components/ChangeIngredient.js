import styles from "../styles/ChangeIngredient.module.css";
import { useState } from "react";

function ChangeIngredient() {
  const token = "DnRWUMfDOW7elz0y3gtAOrF1VBM9UcYw";
  const [nameIngredient, setNameIngredient] = useState("");
  const [quantity, setQuantity] = useState();
  const [unit, setUnit] = useState();
  const [price, setPrice] = useState();
  const [tva, setTva] = useState();

  function addIngredient() {
    fetch("http://localhost:3000/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameIngredient,
        quantity: quantity,
        unit: unit,
        price: price,
        tva: tva,
        token: token,
      }),
    });
  }

  return (
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
          addIngredient();
        }}
      >
        Créer un ingrédient
      </button>
    </div>
  );
}

export default ChangeIngredient;
