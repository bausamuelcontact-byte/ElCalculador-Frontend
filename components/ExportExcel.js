import * as XLSX from "xlsx";
import styles from "../styles/ExportExcel.module.css";

export default function ExportExcel({ recipeList, ingredientList, unitConvertion }) {
    const handleExport = () => {
       // Créer une map des ingrédients 
    const ingredientMap = {};
    ingredientList.forEach(ing => { if (ing && ing._id) ingredientMap[ing._id] = ing; });

    // 2. Créer les données pour toutes les recettes
    const allRecipesData = recipeList.map(recipe => {
      // filtrer les ingrédients utilisés dans la recette
      const costData = recipe.ingredients.map(recIng => {
        const ingrDetail = ingredientMap[recIng.ingredient];
        if (!ingrDetail) return 0; // si ingrédient introuvable
        const adjustedQuantity = unitConvertion(ingrDetail.unit, recIng.unit, recIng.quantity);
        const price = (ingrDetail.price * adjustedQuantity) / ingrDetail.quantity;
        const TVA = price * (ingrDetail.TVA / 100);
        return price + TVA;
      });
      const totalCost = costData.reduce((sum, val) => sum + val, 0);
      return {
        Recette: recipe.name,
        "Prix HT (€)": recipe.price,
        "TVA (%)": recipe.TVA,
        "Coût total (€)": totalCost.toFixed(2),
        "Marge (€)": (recipe.price - totalCost).toFixed(2),
      };
    });

    
    const ws = XLSX.utils.json_to_sheet(allRecipesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recettes");
    XLSX.writeFile(wb, "Recettes.xlsx");
  };

  return <button className={styles.exportBtn} onClick={handleExport}>Exporter Excel</button>;
}