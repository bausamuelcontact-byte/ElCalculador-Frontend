  // Conversion des unités de mesure
  export const unitConvertion = (ingrUnit, recipeUnit, quantity) => {
    if (ingrUnit === recipeUnit) {
      return quantity;
    } else if (ingrUnit === "Kg" && recipeUnit === "gr") {
      return quantity / 1000;
    } else if (ingrUnit === "gr" && recipeUnit === "Kg") {
      return quantity * 1000;
    } else if (ingrUnit === "L" && recipeUnit === "cL") {
      return quantity / 100;
    } else if (ingrUnit === "mL" && recipeUnit === "cL") {
      return quantity * 10;
    } else if (ingrUnit === "cL" && recipeUnit === "L") {
      return quantity * 100;
    } else if (ingrUnit === "cL" && recipeUnit === "mL") {
      return quantity / 10;
    } else if (ingrUnit === "L" && recipeUnit === "mL") {
      return quantity / 1000;
    } else if (ingrUnit === "mL" && recipeUnit === "L") {
      return quantity * 1000;
    } else if (ingrUnit === "Kg" && recipeUnit === "mg") {
      return quantity / 1e6;
    } else if (ingrUnit === "mg" && recipeUnit === "Kg") {
      return quantity * 1e6;
    } else if (ingrUnit === "gr" && recipeUnit === "mg") {
      return quantity / 1000;
    } else if (ingrUnit === "mg" && recipeUnit === "gr") {
      return quantity * 1000;
    } else {
      console.log("Pas de conversion disponible", ingrUnit, quantity);
      return quantity;
    }
  };

  