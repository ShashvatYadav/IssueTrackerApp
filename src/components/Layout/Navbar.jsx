import { useAuth } from '../../context/AuthContext';
import Button from '../Common/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.icon}>📋</span>
                    <span className={styles.title}>Smart Issue Board</span>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <span className={styles.userIcon}>👤</span>
                        <span className={styles.userEmail}>{user?.email}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
