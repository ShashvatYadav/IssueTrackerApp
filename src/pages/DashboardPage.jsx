import Navbar from '../components/Layout/Navbar';
import IssueForm from '../components/Issues/IssueForm';
import IssueList from '../components/Issues/IssueList';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <aside className={styles.sidebar}>
                        <IssueForm />
                    </aside>
                    <main className={styles.main}>
                        <IssueList />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
