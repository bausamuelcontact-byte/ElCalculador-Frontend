import styles from '../styles/Home.module.css';
import Link from 'next/link';

function Home() {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
         <Link href="/dashboard">Go to Dashboard</Link>
      </main>
    </div>
  );
}

export default Home;
