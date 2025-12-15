import styles from "../styles/RecipeCard.module.css";
import Header from './Header';
import Menu from './Menu';
import { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaSearch, FaImage } from "react-icons/fa";
import RecipeTable from "./RecipeTable";
import RecipeSteps from "./RecipeSteps";
import { exportRecipePdf } from "../modules/exportPDF";

// import { useSelector } from "react-redux";
import { useEffect } from "react";

function RecipeCard() {

  //  Le store n'est pas encore persistant 
  //  const userInfo = useSelector((state) => state.user.value); 

  // utilisation d'un userId fixe pour le moment
  // A modifier lorsque le store sera persistant
  const userInfo = {id: "6936ab0cee14c830750e2bea", token: "pt0oyg44CsVgLGck-74jVju5Ts2fxiRL"};

  // user with more data 
  //const userInfo = {id : "6937f28fb4d4f0be72695c79", token: "DnRWUMfDOW7elz0y3gtAOrF1VBM9UcYw"};

  // recherche de fiche recette via la barre de recherche
  const [searchRecipe, setSearchRecipe] = useState("");

  // récupération du prix de vente de la recette sélectionnée depuis le menu déroulant
  const [recipeSalePrice, setRecipeSalePrice] = useState(null);

  // récupération de la TVA du prix de vente de la recette sélectionnée depuis le menu déroulant
  const [recipeTVA, setRecipeTVA] = useState(null);

  // récupération des étapes de préparation de la fiche recette sélectionnée 
  const [recipeCardSteps, setRecipeCardSteps] = useState([]);

  // recupération fiche recette existante : true/false 
  const [existingRecipeCard, setExistingRecipeCard] = useState(false)

  // Fiche recette existante: modifier / sinon : créer
  let buttonContent = existingRecipeCard ? 'Modifier' : 'Créer';

  // passer les étapes de la fiche recette en mode édition
  const [editMode, setEditMode] = useState(false)

  // édition des étapes de la fiche recette en editMode
  const [newSteps, setNewSteps] = useState(Array(10).fill(""));

  // gérer la création / Update de fiche recette :
 const handleRecipeCard = () => {
  
  // on entre en mode édition quand on est en mode affichage
  if (!editMode) {
    setNewSteps(() => { // setNewSteps pré-remplit les 10 inputs avec les étapes existantes
      const padded = Array(10).fill("");
      recipeCardSteps.forEach((step, index) => {
        if (index < 10) padded[index] = step; // on copie les étapes (si existantes) dans padded jusqu'à 10 étapes maximum
      });
      return padded;
    });

    setEditMode(true);
    return;
  }

  // une fois en mode édition, on confirme les changements

  // nettoyer les étapes vides ou par défaut
  const cleanedSteps = newSteps.filter(step => step.trim() !== "" && step.trim() !== "Pas de fiche recette existante.");

  // si les étapes sont toutes vides, on n'envoie rien au backend
  if (cleanedSteps.length === 0) {
    setEditMode(false);
    return;
  }

  setRecipeCardSteps(cleanedSteps) 
  setEditMode(false);
  const method = existingRecipeCard ? "PUT" : "POST"; // si fiche recette existe, on modifie (PUT), sinon on crée (POST)
  fetch(`http://localhost:3000/recipeCards`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipeId: selectedRecipe._id,
      description: cleanedSteps,
      userId: userInfo.id,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.result) {
        console.error("Erreur fiche recette :", data.error);
        return;
      }
      // re-render central
      setExistingRecipeCard(true);

      // upload image si sélectionnée
      const recipeCardId = data.recipeCard?._id || data.recipeCard?.id;
      if (recipeImageFile && recipeCardId) {
      const formData = new FormData();
      formData.append("image", recipeImageFile);
      fetch(`http://localhost:3000/recipeCards/${recipeCardId}/image`, {
      method: "PUT",
      body: formData,
       });
      }

      // re-render liste gauche
      fetch(`http://localhost:3000/recipeCards/${userInfo.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.result) setRecipeCardsUser(data.recipeCards);
        });
    });
};

// Lorsqu'on clique sur le crayon d'une fiche recette dans la liste de gauche 
// les étapes associées s'affichent dans l'éditeur en mode édition 
// et la recette associée est sélectionnée dans le menu déroulant

const handleEditRecipeCard = (recipeFromCard) => {
  if (editMode) return; // sécurité : éviter les conflits en mode édition

  const fullRecipe = recipesUser.find(r => r._id === recipeFromCard._id); // retrouver la recette complète associée à la fiche recette
  if (!fullRecipe) return; // sécurité : si la recette n'est pas trouvée, on sort (ne devrait pas arriver)

  // synchroniser prix/TVA + recette (comme la dropdown)
  setRecipeSalePrice(fullRecipe.price);
  setRecipeTVA(fullRecipe.TVA);

  // récupérer la fiche recette (steps) depuis la liste gauche
  const recipeCard = recipeCardsUser.find(rc => rc.recipe._id === fullRecipe._id);

  // si on trouve la fiche recette, on pré-remplit avec les étapes existantes, sinon on retourne le message par défaut
  const steps = recipeCard?.description?.length
    ? recipeCard.description
    : ["Pas de fiche recette existante."];

  setExistingRecipeCard(!!recipeCard); // !! → transforme recipeCard en booléen || undefined → false, object → true
  setRecipeCardSteps(steps);

  // pré-remplir les 10 inputs AVANT d’activer editMode
  const padded = Array(10).fill("");
  steps
    .filter(s => s !== "Pas de fiche recette existante.") // on ignore cette valeur par défaut
    .slice(0, 10) // sécurité : max 10 étapes 
    .forEach((s, i) => (padded[i] = s)); // On copie les étapes existantes une par une dans padded -> padded[0] = "Étape 1", padded[1] = "Étape 2", etc. 

  setNewSteps(padded); 
  setSelectedRecipe(fullRecipe); 
  setEditMode(true);
};

const handleDeleteRecipeCard = (recipeCardId, recipeId) => {

  fetch(`http://localhost:3000/recipeCards/${recipeCardId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.json())
    .then(data => {
      if (!data.result) {
        console.error("Erreur suppression fiche recette :", data.error);
        return;
      }

      // NE TOUCHE AU CENTRE QUE SI
      // la fiche recette supprimée concerne la recette affichée
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setExistingRecipeCard(false);
        setRecipeCardSteps(['Pas de fiche recette existante.']);
        setEditMode(false);
      }

      // LISTE GAUCHE : TOUJOURS
      fetch(`http://localhost:3000/recipeCards/${userInfo.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.result) setRecipeCardsUser(data.recipeCards);
        });
    });
};

  // en editMode, le bouton devient 'Confirmer'
  buttonContent = editMode ? 'Confirmer' : buttonContent;

  // récupération de la recette sélectionnée dans le menu déroulant
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // récupération du prix de revient total de la recette sélectionnée
  const [recipeCostPrice, setRecipeCostPrice] = useState(null);

  // récupération du prix de la TVA pour la recette sélectionnée
  const [totalTVA, setTotalTVA] = useState(null);

  // affichage du menu latéral
  const [visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };

// Récupération des fiches recettes de l'utilisateur connecté (affichage dans la liste des fiches recettes à gauche)
  const [recipeCardsUser, setRecipeCardsUser] = useState([]);

// Récupération des recettes de l'utilisateur connecté (affichage dans le menu déroulant)
  const [recipesUser, setRecipesUser] = useState([]);
  
// gestion de l'upload photo pour une fiche recette 
const [recipeImageFile, setRecipeImageFile] = useState(null);

// message de confirmation d'upload
const [photoUploaded, setPhotoUploaded] = useState(false);

// reset du message de confirmation après 2 secondes
useEffect(() => {
  if (!photoUploaded) return;
  const timer = setTimeout(() => setPhotoUploaded(false), 2000);
  return () => clearTimeout(timer);
}, [photoUploaded]);

// Récupération des fiches recettes de l'utilisateur connecté (affichage dans la liste des fiches recettes à gauche)
  useEffect(() => {
    fetch(`http://localhost:3000/recipeCards/${userInfo.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setRecipeCardsUser(data.recipeCards)
        } else {
          console.error("Error fetching recipe cards:", data.error);
        }
    })}, []);

// Récupération des recettes de l'utilisateur connecté (affichage dans le menu déroulant)
useEffect(() => {
  fetch(`http://localhost:3000/recipes/withIngredients/user/${userInfo.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        setRecipesUser(data.recipe)
      } else {
        console.error("Error fetching user recipes with ingredients:", data.error);
      }
  })}, []);

// récupération des étapes de préparation associée à la recette sélectionnée depuis le menu déroulant
useEffect(() => {
  if (!selectedRecipe) return;

  const recipeCard = recipeCardsUser.find( 
    rc => rc.recipe._id === selectedRecipe._id
  );

  if (recipeCard) {
    setExistingRecipeCard(true);
    setRecipeCardSteps(recipeCard.description);
  } else {
    setExistingRecipeCard(false);
    setRecipeCardSteps(["Pas de fiche recette existante."]);
  }

}, [selectedRecipe, recipeCardsUser]);
// dépendance 1 : selectedRecipe pour charger les étapes lors du changement de recette dans le menu déroulant
// dépendance 2 : recipeCardsUser pour recharger les étapes après création/modification/suppression de la fiche recette

// fiche recette associée à la recette sélectionnée?
const currentRecipeCard = selectedRecipe
  ? recipeCardsUser.find(rc => rc.recipe._id === selectedRecipe._id)
  : null;

// gestion de l'export PDF
const handleExportPDF = () => {
  exportRecipePdf({
    recipeName: selectedRecipe.name,
    recipeImage: currentRecipeCard?.image, 
    ingredients: selectedRecipe.ingredients,
    steps: recipeCardSteps,
    costPrice: recipeCostPrice,
    totalTVA: totalTVA,
    salePrice: recipeSalePrice, 
    saleTVA: recipeTVA,           
  });
};

    return (
      <div>
        <div className={styles.pageContainer}>
          <Header onToggleMenu={toggleMenu}/>
          <div className={styles.recipeCardWrapper}>
            {visibleMenu && <Menu/>}
            <div className={visibleMenu ? styles.recipeCardPageMenu : styles.recipeCardPageFull}>
            <div className={styles.recipeCardContainer}>
              <div className={styles.searchBar}>
                <div className={styles.searchWrapper}>
                  <input className={styles.searchInput} type="text" placeholder="Chercher une fiche recette existante..." onChange={(e) => setSearchRecipe(e.target.value)} />
                  <FaSearch size={20} className={styles.searchIcon} />
                </div>
              </div>
              <div className={styles.recipeCardDisplayer}>
                {recipeCardsUser.length === 0 && 
                <div className={styles.recipeCardDisplayed} key={0}>
                  Aucune fiche recette existante.
                  </div>}
                {recipeCardsUser.length > 0 && recipeCardsUser.map((recipeCard) => { // filtrer et afficher les fiches recettes en fonction de la recherche
                    let matchSearch = recipeCard.recipe.name.toLowerCase().includes(searchRecipe.toLowerCase());
                    if (matchSearch) {
                    return <div className={styles.recipeCardDisplayed} key={recipeCard._id}>{recipeCard.recipe.name}
                    <div className={styles.editIcons}>
                      <div>
                        <FaPencilAlt size={18} className={styles.editPencil} onClick={()=>{handleEditRecipeCard(recipeCard.recipe)}} />
                      </div>
                      <div>
                        <FaTrashAlt size={18} className={styles.editTrash} onClick={()=>{if(editMode) return;
                        window.confirm("Confirmer la suppression de cette fiche recette ?") && handleDeleteRecipeCard(recipeCard._id, recipeCard.recipe._id)}}/>
                      </div>
                    </div>
                    </div>;}
                    else {
                      return null;
                    }})}
            </div>
            <div className={styles.recipeCardEditor}>
              <div className={styles.selectRecipe}>
                <select
                  className={styles.selectRecipeDropdown}
                  value={selectedRecipe ? selectedRecipe._id : ""}
                  disabled={editMode}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const recipe = recipesUser.find(r => r._id === selectedId);
                    if (recipe) {
                      setRecipeSalePrice(recipe.price);
                      setRecipeTVA(recipe.TVA);
                      setSelectedRecipe(recipe);
                      setEditMode(false);
                    }
                  }}>
                  <option value="" disabled>
                    -- choisir une recette --
                  </option>
                  {recipesUser.map((recipe) => (
                    <option key={recipe._id} value={recipe._id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.priceFrame}>
                <div className={styles.priceRecipe}>Prix de vente total : <span>{recipeSalePrice}€</span> dont TVA : <span>{recipeTVA}€</span></div>
                <div className={styles.priceSale}>Prix de revient total : <span>{recipeCostPrice}€</span> dont TVA : <span>{totalTVA}€</span></div>
              </div>
              <div className={styles.photoFrame}>
              {/* IMAGE */}
              <div className={styles.imageWrapper}>
                {currentRecipeCard?.image ? (
                  <img
                    src={currentRecipeCard.image}
                    alt="Photo recette"
                    className={styles.recipeImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    Aucune photo
                  </div>
                )}
              </div>
              {/* UPLOAD */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderTop: "1px solid #463F32",
                  padding: "4px",
                }}
              >
                <label
                  htmlFor="recipe-image-input"
                  style={{ fontSize: 15, cursor: "pointer" }}
                >
                  Photo recette
                </label>

                <input
                  key={currentRecipeCard?._id}   // 👈 IMPORTANT
                  id="recipe-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file || !currentRecipeCard?._id) return;

                    const formData = new FormData();
                    formData.append("image", file);

                    console.log("🔥 onChange fired");
                    const res = await fetch(
                      `http://localhost:3000/recipeCards/${currentRecipeCard._id}/image`,
                      {
                        method: "PUT",
                        body: formData,
                      }
                    );
                    e.target.value = ""; // reset input (important)
                    const data = await res.json();
                    console.log("✅ backend data");

                    if (data.result) {
                      setRecipeCardsUser((prev) =>
                        prev.map((rc) =>
                          rc._id === currentRecipeCard._id
                            ? { ...rc, image: data.image }
                            : rc
                        )
                      );
                    console.log("🧠 state update requested");
                    setPhotoUploaded(true); 
                    }
                  }}
                />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: "20px", marginBottom: "4px"}}>
                  {photoUploaded && (<div className={styles.fadeIn} style={{ color: "green", fontSize: 13, width:"20px", height:"10px"}}>photo✅</div>)}
                </div>
                <FaImage
                  size={16}
                  style={{
                    cursor: currentRecipeCard ? "pointer" : "not-allowed",
                    opacity: currentRecipeCard ? 1 : 0.4,
                  }}
                  onClick={() => {
                    if (!currentRecipeCard) {
                      alert("Veuillez créer une fiche recette avant d’ajouter une photo");
                      return;
                    }
                    document.getElementById("recipe-image-input")?.click();
                  }}
                />
              </div>
            </div>
              <div className={styles.stepsFrame}>
                <h3 style={{marginLeft: "4%"}}>Étapes de préparation</h3>
                <RecipeSteps steps={recipeCardSteps} editMode={editMode} newSteps={newSteps} setNewSteps={setNewSteps}/>
                <div className={styles.adaptableButtonContainer}>
                  <button className={styles.adaptableButton} onClick={handleRecipeCard}>{buttonContent}</button>
                  {existingRecipeCard && !editMode && (<button className={styles.adaptableButton} onClick={handleExportPDF}>Export PDF</button>)}
                </div>
              </div>
              <div className={styles.ingredientsFrame} >
                {selectedRecipe && <RecipeTable ingredients={selectedRecipe.ingredients} setRecipeCostPrice={setRecipeCostPrice} setTotalTVA={setTotalTVA}/>}
              </div>
            </div>
            </div>
            </div>
            </div>
          </div>
      </div>
    )
}

export default RecipeCard;