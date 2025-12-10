import styles from "../styles/Dashboard.module.css";
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function Dashboard(){
  const[visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };
  const userInfo = useSelector((state) => state.user.value);
  const[recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    console.log("userInfo dans dashboard:", userInfo.id);
    fetch(`http://localhost:3000/recipes/6936e4807da7893fdf4791e9`)
      .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setRecipeList(data.recipe);
        });
  }, []);

  const dropOptions =  
    { Overview: [] ,
      Recipes: recipeList } 
;
  
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
      <div className={styles.pageContainer}>
        <Header onToggleMenu={toggleMenu}/>
         {visibleMenu && <Menu/>}
        <div className={styles.dashboardContent}>
          <h1 className={styles.dashboardTitle}>DASHBOARD</h1>
          <div>
            <p>Welcome to your dashboard! </p>
            <select className={styles.selectRecipe} onChange={handleOptionChange} value={selectedOption}
              style={{ fontStyle: selectedOption === "" ? 'italic' : 'normal' }}>
              <option value="">Select an option</option>
              {Object.keys(dropOptions).map((n)=>{ return (<option key={n} value={n} >{n}</option>); })}
               </select>
               <div>
                 {selectedOption==="Recipes" && recipeList.map((data, i) =>( 
                        <li key={i} className={styles.recipesDisplay}>{data.name}</li>))}
                 {selectedOption==="Overview" && <div className={styles.overviewDisplay}>No data available</div>}
           </div>

          </div>
        </div>
      </div>)
}

export default Dashboard;