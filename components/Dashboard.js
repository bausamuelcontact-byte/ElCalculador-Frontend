import styles from "../styles/Dashboard.module.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Pie, PieChart, PieLabelRenderProps } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Category from "./Category";
import { MdOutlineRestaurant } from "react-icons/md";

function Dashboard() {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };
  const [catModalVisible, setCatModalVisible] = useState(false);

  const userInfo = useSelector((state) => state.user.value);

  const [selectedOption, setSelectedOption] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedRecipeName, setSelectedRecipeName] = useState("");
  const [selectedRecipePrice, setSelectedRecipePrice] = useState(null);
  const [selectedRecipeTVA, setSelectedRecipeTVA] = useState(null);

  const [ingredientList, setIngredientList] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  // Etat pour stockage des données du coût de la recette
  const [recipeCostData, setRecipeCostData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/recipes/search/${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipeList(data.recipe);
      });
    fetch(`http://localhost:3000/categories/${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryList(data.categories);
        console.log("Categories =>", data.categories);
      });
  }, [userInfo.id]);

  const dropOptions = { Overview: categoryList, Recipes: recipeList };
  // calcul des prix des recettes par catégorie
  const categoryPrices = categoryList?.map((cat) => {
    const recipesInCategory = recipeList.filter((rec) =>
      cat.recipes.some((catRecId) => catRecId === rec._id)
    );
    const totalPrices = recipesInCategory.reduce(
      (sum, rec) => sum + rec.price + rec.TVA,
      0
    );
    const averagePrice = totalPrices / recipesInCategory.length;
    return {
      category: cat.name,
      averagePrice: averagePrice.toFixed(2),
      TVA: (averagePrice * 0.2).toFixed(2),
    };
  });
  // données pour le Bar Chart
  const averageCatPrice = [
    { category: "Boisson", averagePrice: 10, TVA: 2 },
    { category: "Entrée", averagePrice: 12, TVA: 3 },
    { category: "Plat", averagePrice: 15, TVA: 4 },
    { category: "Dessert", averagePrice: 10, TVA: 2 },
  ];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // Eviter l'affichage d'un pieChart à la sélection d'un autre champ
    if (e.target.value !== "Recipes") {
      setSelectedRecipe(null);
      setSelectedRecipeName("");
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedRecipeName(recipe.name);
    setSelectedRecipePrice(recipe.price);
    setSelectedRecipeTVA(recipe.TVA);
    setRecipeIngredients(recipe.ingredients);
    // fetch des ingrédients pour la recette sélectionnée
    fetch(`http://localhost:3000/ingredients/search/${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => {
        const allIngredients = data.ingredient; // console.log("IDs de la recette :", recipe.ingredients.map(i => i.ingredient)); // console.log("IDs des ingrédients récupérés :", allIngredients.map(i => i._id));
        // filtrage des ingrédients utilisés dans la recette
        const filteredIngredients = allIngredients.filter((ing) =>
          recipe.ingredients.some(
            (recIng) => recIng.ingredient.toString() === ing._id.toString()
          )
        );
        setIngredientList(filteredIngredients); // console.log("filteredIngredients", filteredIngredients);
        // calcul du prix des ingrédients pour la recette sélectionnée
        const cost = ingredientPriceCalcul(
          recipe.ingredients,
          filteredIngredients
        );
        setRecipeCostData(cost);
      });
  };

  // Conversion des unités de mesure
  const unitConvertion = (ingrUnit, recipeUnit, quantity) => {
    if (ingrUnit === recipeUnit) {
      return quantity;
    } else if (ingrUnit === "kg" && recipeUnit === "gr") {
      return quantity / 1000;
    } else if (ingrUnit === "gr" && recipeUnit === "kg") {
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
      return quantity * 1000;
    } else if (ingrUnit === "mL" && recipeUnit === "L") {
      return quantity / 1000;
    } else if (ingrUnit === "Kg" && recipeUnit === "mg") {
      return quantity * 1e6;
    } else if (ingrUnit === "mg" && recipeUnit === "Kg") {
      return quantity / 1e6;
    } else if (ingrUnit === "gr" && recipeUnit === "mg") {
      return quantity * 1000;
    } else if (ingrUnit === "mg" && recipeUnit === "gr") {
      return quantity / 1000;
    } else {
      console.log("Pas de conversion disponible", ingrUnit, quantity);
      return quantity;
    }
  };

  // Calcul du prix des ingrédients pour la recette sélectionnée
  const ingredientPriceCalcul = (recipeIngredients, ingredientList) => {
    const recipeCost = [];

    recipeIngredients.forEach((recIng) => {
      const ingrDetail = ingredientList.find(
        (ing) => ing._id.toString() === recIng.ingredient.toString()
      );
      if (!ingrDetail) {
        console.warn("Ingredient introuvable pour", recIng);
        return;
      }
      // Conversion de l'unité de mesure de l'ingrédient si nécessaire
      const adjustedQuantity = unitConvertion(
        ingrDetail.unit,
        recIng.unit,
        recIng.quantity
      );
      // calcul du prix de l'ingrédient pour la quantité utilisée dans la recette
      const price = (ingrDetail.price * adjustedQuantity) / ingrDetail.quantity;
      // calcul de la TVA pour cet ingrédient
      const TVA = (ingrDetail.TVA * adjustedQuantity) / ingrDetail.quantity;
      const ingrCost = price + TVA;
      recipeCost.push({ name: ingrDetail.name, value: ingrCost });
    });
    return recipeCost;
  };

  // Données pour le PieChart
  const pieData = recipeCostData.map((e) => ({ name: e.name, value: e.value }));

  const RADIAN = Math.PI / 180;
  const COLORS = ["#e2d6adb5", "#2f0801a8", "#f9d27eff", "#70643bb5"];
  // Afficher les labels personnalisés
  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#222"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "13px", fontWeight: "500" }}
      >
        {`${name} —${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <Header onToggleMenu={toggleMenu} />
      {visibleMenu && <Menu />}

      <div className={styles.dashboardContent}>
        <div className={styles.dashboardLeft}>
          <h1 className={styles.dashboardTitle}>DASHBOARD</h1>
          <select
            className={styles.selectRecipe}
            onChange={handleOptionChange}
            value={selectedOption}
            style={{ fontStyle: selectedOption === "" ? "italic" : "normal" }}
          >
            <option value="">Select an option</option>
            {Object.keys(dropOptions).map((n) => {
              return (
                <option key={n} value={n}>
                  {n}
                </option>
              );
            })}
          </select>
          {selectedOption === "Overview" && (
            <>
              <h4
                className={styles.h4}
                onClick={() => setCatModalVisible(true)}
              >
                {" "}
                Modifier ou ajouter une catégorie{" "}
              </h4>
              <Category
                catModalVisible={catModalVisible}
                setCatModalVisible={setCatModalVisible}
              />
            </>
          )}

          {selectedOption === "Recipes" &&
            recipeList.map((data, i) => (
              <div
                key={i}
                className={styles.listItem}
                onClick={() => handleRecipeClick(data)}
                value={data}
              >
                <span className={styles.listLabel}> {data.name}</span>
                <div className={styles.listActions}>
                  <MdOutlineRestaurant />
                </div>
              </div>
            ))}
        </div>

        <div className={styles.verticalSeparator}></div>

        <div className={styles.dashboardRight}>
          {selectedOption === "Overview" && (
            <div className={styles.overviewDisplay}>
              <h3> Moyenne des prix par catégorie </h3>
              <BarChart
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "70vh",
                  aspectRatio: 1.618,
                }}
                responsive
                data={categoryPrices}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="averagePrice"
                  stackId="a"
                  fill="#2f0801a8"
                  background
                />
                <Bar dataKey="TVA" stackId="a" fill="#cebd84c3" background />
              </BarChart>
            </div>
          )}

          {selectedOption === "Recipes" && selectedRecipe && (
            <div className={styles.recipePrice}>
              <h3> Composition du prix de {selectedRecipeName} </h3>
              <PieChart
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  aspectRatio: 1,
                }}
                responsive
              >
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
          )}
        </div>
      </div>
      {selectedRecipe && (
        <div className={styles.recipePrice}>
          <h3> Composition du prix de {selectedRecipeName} </h3>
          <PieChart
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "80vh",
              aspectRatio: 1,
            }}
            responsive
          >
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
