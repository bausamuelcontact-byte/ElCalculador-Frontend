import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import styles from "../styles/Dashboard.module.css";

function DashboardPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <Dashboard />
    </div>
  );
}

export default DashboardPage;