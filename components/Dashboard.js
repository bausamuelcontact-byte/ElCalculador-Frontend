import styles from "../styles/Dashboard.module.css";
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useState } from "react";

function Dashboard(){
  const[visibleMenu, setVisibleMenu] = useState(false);
  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };
    return (
      <div className={styles.pageContainer}>
        <Header onToggleMenu={toggleMenu}/>
         {visibleMenu && <Menu/>}
      </div>)
}

export default Dashboard;