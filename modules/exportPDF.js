import jsPDF from "jspdf";

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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  const BORDEAUX_BG = [245, 235, 238];
  const GOLD = [212, 175, 55];
  const BLACK = [0, 0, 0];
  const DARK = [40, 40, 40];

  doc.setFont("times");

  /* =========================
     TITRE
  ========================= */
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...BLACK);
  doc.text(recipeName, pageWidth / 2, y, { align: "center" });
  y += 14;

  /* =========================
     IMAGE
  ========================= */
  if (recipeImage) {
    try {
      const img = await fetch(recipeImage)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );

      doc.addImage(img, "JPEG", pageWidth / 2 - 30, y, 60, 40);
      y += 50;
    } catch {}
  }

  /* =========================
     HELPERS
  ========================= */
  const sectionTitle = (text) => {
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...BLACK);
    doc.text(text, 20, y);
    y += 2;
    doc.setDrawColor(...GOLD);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;
    doc.setFont("times", "normal");
    doc.setTextColor(...DARK);
  };

  const drawBlockBackground = (startY, endY) => {
    doc.setFillColor(...BORDEAUX_BG);
    doc.rect(18, startY - 6, pageWidth - 36, endY - startY + 10, "F");
  };

  /* =========================
     PRIX
  ========================= */
  sectionTitle("Informations tarifaires");
  const priceStartY = y;

  // calcul hauteur à l’avance
  const priceEndY = y + 26;
  drawBlockBackground(priceStartY, priceEndY);

  doc.setFontSize(11);
  doc.text(`Prix de vente : ${salePrice} €`, 26, y);
  y += 6;
  doc.text(`TVA (vente) : ${saleTVA} €`, 26, y);
  y += 8;
  doc.text(`Prix de revient : ${costPrice} €`, 26, y);
  y += 6;
  doc.text(`TVA (revient) : ${totalTVA} €`, 26, y);

  y += 18;

  /* =========================
     INGREDIENTS
  ========================= */
  sectionTitle("Ingrédients");
  const ingStartY = y;
  const ingEndY = y + ingredients.length * 6;

  drawBlockBackground(ingStartY, ingEndY);
  doc.setFontSize(11);
  ingredients.forEach((item) => {
    doc.text(
      `• ${item.ingredient.name} — ${item.quantity} ${item.unit}`,
      26,
      y
    );
    y += 6;
  });

  y += 14;

  /* =========================
     ETAPES
  ========================= */
  sectionTitle("Étapes de préparation");
  const stepsStartY = y;
  const stepsEndY = y + steps.length * 8;

  drawBlockBackground(stepsStartY, stepsEndY);

  doc.setFontSize(11);
  steps.forEach((step, index) => {
    doc.setFont("times", "bold");
    doc.text(`${index + 1}.`, 22, y);
    doc.setFont("times", "normal");
    doc.text(step, 30, y, { maxWidth: pageWidth - 50 });
    y += 8;
  });

  /* =========================
     FOOTER
  ========================= */
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    "El Calculador Fiche recette — impression cuisine",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  doc.save(`${recipeName}.pdf`);
};
