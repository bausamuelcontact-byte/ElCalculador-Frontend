import styles from "../styles/Signin_Signup.module.css";
import ReactModal from "react-modal";
import { FaTimes } from "react-icons/fa"; 

function Signup(props) {

  return (
    <ReactModal isOpen={props.signUpVisible} 
      style={{
    overlay: {
      position: 'fixed',
      top: '5%',
      left: '25%',
      right: '25%',
      bottom: '5%',
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '20px',
      left: '40px',
      right: '40px',
      bottom: '20px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  }} >
    <div className={styles.cross}>
        <FaTimes size={20} color="#0a0a0aff" onClick={()=>(props.setSignUpVisible(false))}/>
    ​</div>
    <div className={styles.modalContent}>
        <h1>Bienvenue</h1>
        <input className={styles.inputs} type="text" placeholder="Nom" onChange={()=>{}}/> 
        <input className={styles.inputs} type="text" placeholder="Prénom" onChange={()=>{}}/> 
        <input className={styles.inputs} type="text" placeholder="Adresse e-mail" onChange={()=>{}}/>
        <input className={styles.inputs} type="text" placeholder="Numéro de téléphone" onChange={()=>{}}/> 
        <input className={styles.inputs} type="text" placeholder="Nom de l'enseigne" onChange={()=>{}}/>
        <input className={styles.inputs} type="text" placeholder="Mot de passe" onChange={()=>{}}/>
        <input className={styles.inputs} type="text" placeholder="Confirmation mot de passe" onChange={()=>{}}/>
        <button className={styles.buttonSignin}>Créer un compte</button>
    </div>

      
    </ReactModal>
  );
}

export default Signup;
