import styles from "../styles/Header.module.css";
import { IoMenuOutline } from "react-icons/io5";
import { PiChefHatThin } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Popover, Button } from 'antd';
import { logout } from "../reducers/user";

function Header(){
  const dispatch = useDispatch();
  // récupérer les infos utilisateur dans le store
  const userInfo = useSelector((state) => state.user.value);
  // récupérer le nom d'utilisateur pour la session en cours 
  const [fistNameDisplay, setFirstNameDisplay] = useState("");
  // récupérer le nom du restaurant
  const [restaurantName, setRestaurantName] = useState("");
  // état pour afficher ou non le popover
  const [visiblePopover, setVisiblePopover] = useState(false);
  // router pour redirection
  const router = useRouter();
  // fetch des infos utilisateur au chargement du composant
  useEffect(() => {
    fetch("http://localhost:3000/users/isConnected/" + userInfo.token)
      .then((response) => response.json())
      .then((data) => {
        setFirstNameDisplay(data.firstname);
        setRestaurantName(data.restaurantName);
      });
  }, [userInfo.token]);
  // fonction de déconnexion
  const LogOutBtn = () => {
    dispatch(logout());
    //   router.push("/Login");
  }
  // contenu du popover
  const popoverContent = (
    <div className={styles.popoverContent}>
      <Button onClick={LogOutBtn}>Log out</Button>
    </div>
  );
  // gestion de l'affichage du popover
  const handlePopoverChange = (visible) => {
    setVisiblePopover(visible);
  }

  return (
    <div className={styles.headerContainer}>
       <div className={styles.headerSection}>
          <IoMenuOutline className={styles.headerIcons} size={50}/>
          <h1 className={styles.headerText}>El Calculador</h1>
       </div>
       <div className={styles.headerSection}>
          <PiChefHatThin className={styles.headerIcons} size={50}/>
          <h1 className={styles.headerText}>{restaurantName}</h1>
       </div>    
       <div className={styles.headerSection}>
          <h4 className={styles.headerText}>{fistNameDisplay}</h4>
          <RxAvatar className={styles.headerIcons} size={50} onClick={()=>{}}/>
          <Popover 
             content={popoverContent} 
             className={styles.popover} 
             trigger="click" 
             placement="bottomRight" 
             open={visiblePopover} 
             onOpenChange={handlePopoverChange}>
            
          </Popover>
       </div>    
    </div>
  );
}
 
export default Header;