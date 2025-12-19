import styles from "../styles/Dashboard.module.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { addRecipe } from "../reducers/recipe";
import { useRouter } from "next/router";
import EmptyDashboard from "../components/EmptyDashboard";
import { unitConvertion } from "../modules/Calcul";
import ExportExcel from "./ExportExcel";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.value);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedRecipeName, setSelectedRecipeName] = useState("");
  const [selectedRecipePrice, setSelectedRecipePrice] = useState(null);
  const [selectedRecipeTVA, setSelectedRecipeTVA] = useState(null);
  // const [ingredientCost, setIngredientCost] = useState(null);
  const [ingredientList, setIngredientList] = useState([]);
  const [selectedRecipeCost, setSelectedRecipeCost] = useState(null);
  // Etat pour stockage des données du coût de la recette
  const [recipeCostData, setRecipeCostData] = useState([]);

  useEffect(() => {
    // Récupération de l'ensemble des recettes d'un utilisateur
    fetch(
      `https://el-calculador-backend.vercel.app/recipes/search/${userInfo.id}`
    )
      .then((response) => response.json())
      .then((data) => setRecipeList(data.recipe));
    // Récupération de l'ensemble des catégories de recettes d'un utilisateur
    fetch(`https://el-calculador-backend.vercel.app/categories/${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => setCategoryList(data.categories));
  }, [userInfo.id]);

  // Options de la liste déroulante
  const dropOptions = { Overview: categoryList, Recipes: recipeList };

  // calcul des prix des recettes par catégorie (Overview)
  const categoryPrices = categoryList.map((cat) => {
    console.log("recipeList", recipeList);
    console.log("categoryList", categoryList);
    const recipesInCategory = recipeList.filter((rec) =>
      cat.recipes.some((catRecId) => catRecId === rec._id)
    );
    const totalPrices = recipesInCategory.reduce(
      (sum, rec) => sum + rec.price + rec.tva,
      0
    );
    const averagePrice = totalPrices / recipesInCategory.length;
    return {
      category: cat.name,
      averagePrice: averagePrice.toFixed(2),
      TVA: (averagePrice * 0.2).toFixed(2),
    };
  });

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // Eviter l'affichage d'un pieChart à la sélection d'un autre champ
    if (e.target.value !== "Recipes") {
      setSelectedRecipe(null);
      setSelectedRecipeName("");
    }
  };

  //Envoie la recette sur reducer et va dans le composant recette pour la modifier
  const handleChangeRecipe = (recipe) => {
    dispatch(addRecipe(recipe));
    router.push("/recipe");
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedRecipeName(recipe.name);
    setSelectedRecipePrice(recipe.price);
    setSelectedRecipeTVA(recipe.tva);
    // fetch des ingrédients pour la recette sélectionnée
    fetch(
      `https://el-calculador-backend.vercel.app/ingredients/search/${userInfo.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        const allIngredients = data.ingredient;

        // filtrage des ingrédients utilisés dans la recette
        const filteredIngredients = allIngredients.filter((ing) =>
          recipe.ingredients.some((recIng) => recIng.ingredient === ing._id)
        );
        setIngredientList(filteredIngredients);
        // calcul du prix des ingrédients pour la recette sélectionnée
        const cost = ingredientPriceCalcul(
          recipe.ingredients,
          filteredIngredients
        );
        console.log(cost);
        setRecipeCostData(cost);
        const totalCost = cost.reduce((sum, i) => sum + i.value, 0);
        setSelectedRecipeCost(totalCost.toFixed(2));
      });
  };

  // Calcul du prix des ingrédients pour la recette sélectionnée
  const ingredientPriceCalcul = (recipeIngredients, ingredientList) => {
    const recipeCost = [];
    recipeIngredients.forEach((recIng) => {
      if (!recIng || !recIng.ingredient) return;
      const ingrDetail = ingredientList.find(
        (ing) => ing._id.toString() === recIng.ingredient.toString()
      );
      console.log("ing", ingrDetail);
      if (!ingrDetail) return;
      // Conversion de l'unité de mesure de l'ingrédient si nécessaire
      const adjustedQuantity = unitConvertion(
        ingrDetail.unit,
        recIng.unit,
        recIng.quantity
      );
      // calcul du prix de l'ingrédient pour la quantité utilisée dans la recette
      const ingrCost =
        (ingrDetail.price * adjustedQuantity) / ingrDetail.quantity;
      console.log("price", ingrCost);
      recipeCost.push({
        name: ingrDetail.name,
        quantity: recIng.quantity,
        unit: recIng.unit,
        value: ingrCost,
      });
    });
    console.log("recipeCost", recipeCost);
    return recipeCost;
  };

  // Afficher les labels personnalisés pour le BarChart
  const averagePriceLabel = "Prix moyen";

  // Données pour le PieChart
  const pieData = recipeCostData.map((e) => ({ name: e.name, value: e.value }));
  const RADIAN = Math.PI / 180;
  const COLORS = ["#f9d27eff", "#58190ebf", "#e2d6adb5", "#70643bb5"];
  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    if (cx == null || cy == null || innerRadius == null || outerRadius == null)
      return null;
    const radius = outerRadius + 20;
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
        {/*  Afficher les labels personnalisés pour le BarChart      */}
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
          {recipeList.length === 0 && (
            <p className={styles.emptyDescription}>
              Cette zone vous permettra de naviguer entre les statistiques
              globales et celles de vos recettes, dès qu’elles seront créées.
            </p>
          )}
          {selectedOption === "Overview" && (
            <>
              <h4
                className={styles.h4}
                onClick={() => setCatModalVisible(true)}
              >
                Modifier ou ajouter une catégorie
              </h4>
              <Category
                catModalVisible={catModalVisible}
                setCatModalVisible={setCatModalVisible}
              />
            </>
          )}
          <div className={styles.recipescroll}>
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
                    <MdOutlineRestaurant
                      onClick={() => {
                        handleChangeRecipe(data);
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.verticalSeparator}></div>
        <div className={styles.dashboardRight}>
          {recipeList.length === 0 && <EmptyDashboard />}
          {selectedOption !== "Recipes" && recipeList.length > 0 && (
            <div className={styles.overviewDisplay}>
              <h3> Moyenne des prix par catégorie </h3>
              <BarChart
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  maxHeight: "100vh",
                  aspectRatio: 1.618,
                }}
                data={categoryPrices}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                barSize={70}
                barCategoryGap="30%"
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="averagePrice"
                  name={averagePriceLabel}
                  stackId="a"
                  fill="#60190cc4"
                  background
                />
                <Bar dataKey="TVA" stackId="a" fill="#fada7180" background />
              </BarChart>
            </div>
          )}
          {selectedOption === "Recipes" && selectedRecipe && (
            <div className={styles.recipePrice}>
              <h3 className={styles.pieTitle}>
                {" "}
                Composition du coût de {selectedRecipeName}{" "}
              </h3>
              <PieChart
                style={{
                  width: "100%",
                  maxWidth: "720px",
                  maxHeight: "40vh",
                  aspectRatio: 1,
                  marginTop: "50px",
                  marginLeft: "-80px",
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
                  labelLine={{ stroke: "#999", strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className={styles.tables}>
                <div className={styles.costTableContainer}>
                  <h3 className={styles.costTableTitle}>
                    {" "}
                    Détail du coût par ingrédient{" "}
                  </h3>
                  <table className={styles.table}>
                    <thead className={styles.tableHead}>
                      <tr className={styles.theadTR}>
                        <td className={styles.theadTD}>Ingrédient</td>
                        <td className={styles.theadTD}>Quantité</td>
                        <td className={styles.theadTD}>Prix</td>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeCostData.map((data, i) => (
                        <tr key={i}>
                          <td className={styles.tableRow}>{data.name}</td>
                          <td className={styles.tableRow}>
                            {data.quantity} {data.unit}
                          </td>
                          <td className={styles.tableRow}>
                            {data.value.toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className={styles.totalRow}>Coût Total</td>
                        <td></td>
                        <td> {selectedRecipeCost} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.priceTableContainer}>
                  <h3 className={styles.priceTableTitle}>
                    {" "}
                    Prix de vente & Marge{" "}
                  </h3>
                  <table className={styles.table}>
                    <tr>
                      <td className={styles.tableColumn}>Prix HT</td>
                      <td>{selectedRecipePrice}€</td>
                    </tr>
                    <tr>
                      <td className={styles.tableColumn}>TVA</td>
                      <td> {selectedRecipeTVA} %</td>
                    </tr>
                    <tr>
                      <td className={styles.tableColumn}>Marge brute</td>
                      <td className={styles.totalRow}>
                        {" "}
                        {(selectedRecipePrice - selectedRecipeCost).toFixed(
                          2
                        )}{" "}
                        €
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.tableColumn}>Taux de la marge </td>
                      <td className={styles.totalRow}>
                        {" "}
                        {(
                          (selectedRecipeCost / selectedRecipePrice) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <ExportExcel
                recipeList={recipeList}
                ingredientList={ingredientList}
                unitConvertion={unitConvertion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
