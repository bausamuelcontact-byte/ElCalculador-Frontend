import jsPDF from "jspdf";

/**
 * Génère et télécharge le PDF d'une fiche recette
 */

export const exportRecipePdf = async ({
  recipeName,
  recipeImage,
  ingredients,
  steps,
  costPrice,
  totalTVA,
  salePrice,
  saleTVA,
}) => {
  if (!recipeName) return;

  const doc = new jsPDF();
  let y = 20;

  // Titre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(recipeName, 20, y);
  y += 10;

  // Image recette (si présente)
  if (recipeImage) {
    try {
      const img = await fetch(recipeImage)
        .then((res) => res.blob())
        .then((blob) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });

      doc.addImage(img, "JPEG", 20, y, 60, 40);
      y += 45;
    } catch (err) {
      console.warn("Image PDF non chargée", err);
    }
  }

  // Prix
  y+= 5;
  doc.setFontSize(14);
  doc.text("Détails des prix :", 20, y);
  doc.setFont("helvetica", "normal");
  y += 8;
  doc.setFontSize(12);
  doc.text(`Prix de vente : ${salePrice} €`, 20, y);
  y += 6;
  doc.text(`TVA (vente) : ${saleTVA} €`, 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Prix de revient : ${costPrice} €`, 20, y);
  y += 6;
  doc.text(`TVA (revient) : ${totalTVA} €`, 20, y);
  y += 6;

// Ingrédients
  y+=5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Ingrédients :", 20, y);
  doc.setFont("helvetica", "normal");
  y += 8;

  doc.setFontSize(11);
  ingredients.forEach((item) => {
    doc.text(
      `- ${item.ingredient.name} : ${item.quantity} ${item.unit}`,
      20,
      y
    );
    y += 6;
  })


  // Étapes
  y += 5;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Étapes de préparation :", 20, y);
  doc.setFont("helvetica", "normal");
  y += 8;

  doc.setFontSize(11);
  steps.forEach((step, index) => {
    doc.text(`${index + 1}. ${step}`, 20, y);
    y += 6;
  });

  y += 6;

  doc.save(`${recipeName}.pdf`);
};
