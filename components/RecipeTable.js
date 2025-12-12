import styles from "../styles/RecipeTable.module.css";
import { useEffect } from "react";

function RecipeTable({ ingredients, setRecipeCostPrice, setTotalTVA}) {

  const totalPrice = ingredients.reduce((acc, item) => {
    const priceIngredient = (item.ingredient.price/item.ingredient.quantity) * item.quantity;
    return acc + priceIngredient;
  }, 0);  

    const totalTVA = ingredients.reduce((acc, item) => {
    const tvaIngredient = (item.ingredient.TVA/item.ingredient.quantity) * item.quantity;
    return acc + tvaIngredient;
  }, 0);  

// utiliser un useEffect sur totalPrice et totalTVA pour limiter le nombre de re-render
 
  useEffect(() => {
    if (ingredients.length===0) return;
    setRecipeCostPrice(totalPrice.toFixed(2));
    setTotalTVA(totalTVA.toFixed(2))
  }, [ingredients]);


  return (

    <div className={styles.container}>

      {/* Header */}
      <div className={`${styles.row} ${styles.header}`}>
        <div className={styles.col}>Produit</div>
        <div className={styles.col}>Qté</div>
        <div className={styles.col}>Unité</div>
        <div className={styles.col}>Prix</div>
      </div>

      {/* Body */}
      {ingredients.map((item) => {
        const priceIngredient = (item.ingredient.price/item.ingredient.quantity) * item.quantity;
        return (
          <div className={styles.row} key={item._id}>
            <div className={styles.col}>{item.ingredient.name}</div>
            <div className={styles.col}>{item.quantity}</div>
            <div className={styles.col}>{item.unit}</div>
            <div className={styles.col}>{priceIngredient.toFixed(2)} €</div>
          </div>
        );
      })}

      {/* Total */}
      <div className={styles.total}>
        <div>
          Total : {totalPrice.toFixed(2)} €
        </div>
      </div>
    </div>
  );
}

export default RecipeTable;
