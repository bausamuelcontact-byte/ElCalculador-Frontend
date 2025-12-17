import styles from "../styles/Dashboard.module.css";
import { useRouter } from "next/router";

function EmptyDashboard() {
    const router = useRouter();
    const handlefirstRecipe = ()=>{router.push("/recipe")}
  return (
            <div className={styles.dashboardRight}>
            <h1 className={styles.emptyTitle}>Bienvenue sur El Calculador </h1>
            <p className={styles.emptySubtitle}>
            Pour afficher des statistiques, commencez par créer votre première recette.
            </p>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <p>Ajoutez vos ingrédients</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <p>Créez votre première recette</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <p>Analysez vos coûts et marges</p>
              </div>
            </div>
            <button className={styles.createButton} onClick={handlefirstRecipe}>
              Créer ma première recette
            </button>
        </div>
   );
}

export default EmptyDashboard;