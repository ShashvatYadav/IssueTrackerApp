import styles from './Button.module.css';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''
                } ${className}`}
        >
            {loading ? (
                <span className={styles.loader}></span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
