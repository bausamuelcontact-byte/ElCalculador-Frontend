import Header from '../components/Header';
import Dashboard from '../components/Dashboard';

function Dashboard() {
  return (
    <div>
      <Header />
      <Dashboard className={styles.dashboardContent}/>
    </div>
  );
}

export default Dashboard;