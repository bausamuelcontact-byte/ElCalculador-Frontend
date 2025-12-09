import styles from "../styles/Signin_Signup.module.css";
import ReactModal from "react-modal";
import { FaTimes } from "react-icons/fa"; 

function Signin(props) {

  return (
    <ReactModal isOpen={props.signInVisible} closeTimeoutMS={250}
      style={{
    overlay: {
      position: 'fixed',
      top: '10%',
      left: '25%',
      right: '25%',
      bottom: '35%',
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
        <FaTimes size={20} color="#0a0a0aff" onClick={()=>(props.setSignInVisible(false))}/>
    ​</div>
    <div className={styles.modalContent}>
        <h1>Identification</h1>
        <input className={styles.inputs} type="text" placeholder="adresse e-mail" onChange={()=>{}}/> 
        <input className={styles.inputs} type="text" placeholder="mot de passe" onChange={()=>{}}/> 
        <button className={styles.buttonSignin}>Se connecter</button>
    </div>

      
    </ReactModal>
  );
}

export default Signin;
