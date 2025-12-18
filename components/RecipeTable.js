import styles from "../styles/RecipeTable.module.css";
import { useEffect } from "react";

function RecipeTable({ingredients, setRecipeCostPrice, setTotalTVA}) {

// Conversion des unités de mesure
const normalizeUnit = (u) =>
  (u ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace("gr", "g");

const toBase = {
  // base: g pour masse
  kg: { base: "g", factor: 1000 },
  g:  { base: "g", factor: 1 },
  mg: { base: "g", factor: 0.001 },

  // base: ml pour volume
  l:  { base: "ml", factor: 1000 },
  cl: { base: "ml", factor: 10 },
  ml: { base: "ml", factor: 1 },
};

const unitConversion = (fromUnit, toUnit, qty) => {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);
  const q = Number(qty);

  if (!Number.isFinite(q)) return qty; // pas un nombre
  if (from === to) return q; // même unité

  const fromInfo = toBase[from]; // 
  const toInfo = toBase[to]; // 

  // pas convertible (pièce -> g, etc.)
  if (!fromInfo || !toInfo) return q;

  // pas le même “type” (masse vs volume)
  if (fromInfo.base !== toInfo.base) return q;

  // convert to base then to target
  const inBase = q * fromInfo.factor;
  return inBase / toInfo.factor;
};

const totalPrice = ingredients.reduce((acc, item) => {
  const boughtQtyInRecipeUnit = unitConversion(
    item.ingredient.unit,
    item.unit,
    item.ingredient.quantity
  );

  if (!boughtQtyInRecipeUnit) return null; // éviter division par 0

  const pricePerUnit =
    item.ingredient.price / boughtQtyInRecipeUnit;

  const ingredientCost =
    pricePerUnit * item.quantity;

  return acc + ingredientCost;
}, 0);  // valeur initiale de l'accumulateur à 0

const totalTVA = ingredients.reduce((acc, item) => {
  const boughtQtyInRecipeUnit = unitConversion(
    item.ingredient.unit,
    item.unit,
    item.ingredient.quantity
  );

  if (!boughtQtyInRecipeUnit) return acc;

  const pricePerUnit =
    item.ingredient.price / boughtQtyInRecipeUnit;

  const ingredientCost =
    pricePerUnit * item.quantity;

  const ingredientTVA =
    ingredientCost * (Number(item.ingredient.TVA) / 100);

  return acc + ingredientTVA;
}, 0);  // valeur initiale de l'accumulateur à 0

// utiliser un useEffect sur totalPrice et totalTVA pour limiter le nombre de re-render
useEffect(() => {
  setRecipeCostPrice(totalPrice.toFixed(2));
  setTotalTVA(totalTVA.toFixed(2));
}, [totalPrice, totalTVA]);

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
        const boughtQtyInRecipeUnit = unitConversion(
          item.ingredient.unit,
          item.unit,
          item.ingredient.quantity
        );

        if (!boughtQtyInRecipeUnit) return null;

        const pricePerUnit =
          item.ingredient.price / boughtQtyInRecipeUnit;

        const priceIngredient =
          pricePerUnit * item.quantity;

        return (
          <div className={styles.row} key={item._id}>
            <div className={styles.col}>{item.ingredient.name}</div>
            <div className={styles.col}>{item.quantity}</div>
            <div className={styles.col}>{item.unit}</div>
            <div className={styles.col}>
              {priceIngredient.toFixed(2)} €
            </div>
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
