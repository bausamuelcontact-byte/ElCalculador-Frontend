import styles from "../styles/Header.module.css";
import { IoMenuOutline } from "react-icons/io5";
import { PiChefHatThin } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Popover, Button } from 'antd';
import { logout } from "../reducers/user";


function Header(props){
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.value);

  // récupérer les infos utilisateur pour la session en cours 
  const [fistNameDisplay, setFirstNameDisplay] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  // état pour afficher ou non le popover
  const [visiblePopover, setVisiblePopover] = useState(false);

  // router pour redirection
  const router = useRouter();

  // fetch des infos utilisateur au chargement du composant
  useEffect(() => {
    if (!userInfo.token) return;

    fetch(`http://localhost:3000/users/isConnected/${userInfo.token}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data user info", data.userInfo);
        setFirstNameDisplay(data.userInfo.firstname);
        setRestaurantName(data.userInfo.restaurantName);
      });
  }, [userInfo.token]);

  // fonction de déconnexion
  const LogOutBtn = () => {
    dispatch(logout());
    router.push("/Signin");
  };

  // contenu du popover
  const popoverContent = (
    <div className={styles.popoverContent}>
      <Button onClick={LogOutBtn}>Log out</Button>
    </div>
  );

  // gestion de l'affichage du popover
  const handlePopoverChange = () => {
    setVisiblePopover(prev => !prev);
  }

  const handleMenuChange = () => {
    props.onToggleMenu();
  }

  return (
    <div className={styles.headerContainer}>
       <div className={styles.headerSection}>
          <IoMenuOutline className={styles.headerIcons} size={50} onClick={handleMenuChange}/>
                    <h1 className={styles.headerText}>El Calculador</h1>
       </div>
       <div className={styles.headerSection}>
          <PiChefHatThin className={styles.headerIcons} size={50}/>
          <h1 className={styles.headerText}>{restaurantName}</h1>
       </div>    
       <div className={styles.headerSection}>
          <h4 className={styles.headerText}>{fistNameDisplay}</h4>
          
          <Popover 
             content={popoverContent} 
             className={styles.popover} 
             placement="bottomRight" 
             open={visiblePopover} 
             onOpenChange={(open) => setVisiblePopover(open)} >
            <RxAvatar className={styles.headerIcons} size={50} onClick={handlePopoverChange} />
          </Popover>
       </div>    
    </div>
  );
}
 
export default Header;