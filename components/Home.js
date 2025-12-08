import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <span className={styles.elCalculador}>El Calculador</span>
      </div>
        <div className={styles.container}>
          <img className={styles.cover} src='cook.jpg'/>
          <div className={styles.sign}>
            <div className={styles.slogan}>
              <h1>Calculez. Cuisinez. Vendez.</h1>
            </div>
            <div className={styles.actions}>
              <h2>Déjà membre?</h2>
              <button className={styles.signButtons}>Connectez vous</button>
              <h2>Première visite?</h2>
              <button className={styles.signButtons}>S'inscrire</button>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Home;
