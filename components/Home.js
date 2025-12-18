import styles from '../styles/Home.module.css';
import Signin from './Signin';
import Signup from './Signup';
import { useState } from 'react';

function Home() {

  const [signInVisible, setSignInVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);

  return (
    <div className={styles.main} >
      <div className={styles.header}>
        <span style={{ color: "#f5eadfde", fontFamily: "Poiret One, cursive", fontWeight: "lighter"}} className={styles.elCalculador}>El Calculador</span>
      </div>
        <div className={styles.container}>
          <img className={styles.cover} src='cook.jpg'/>
          <div className={styles.sign}>
            <div className={styles.slogan}>
              <div className={styles.sloganText}>
                <div>Calculez. Cuisinez. Vendez.</div>
              </div>
            </div>
            <div className={styles.actions}>
              <span className={styles.titles}>Déjà membre?</span>
              <button className={styles.signInButton} onClick={()=>(setSignInVisible(true))}>Connexion</button>
              <span className={styles.titles}>Première visite?</span>
              <button className={styles.signUpButton} onClick={()=>(setSignUpVisible(true))}>S'inscrire</button>
            </div>
          </div>
        </div>
        <Signin signInVisible={signInVisible} setSignInVisible={setSignInVisible} />
        <Signup signUpVisible={signUpVisible} setSignUpVisible={setSignUpVisible}/>
    </div>

  );
}

export default Home;
