import { useState } from 'react';
import { useIssues } from '../../hooks/useIssues';
import { canTransitionStatus } from '../../utils/validators';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import styles from './IssueCard.module.css';

const IssueCard = ({ issue }) => {
    const { updateIssue } = useIssues();
    const [statusError, setStatusError] = useState({ show: false, message: '' });

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        const validation = canTransitionStatus(issue.status, newStatus);

        if (!validation.allowed) {
            setStatusError({ show: true, message: validation.message });
            return;
        }

        await updateIssue(issue.id, { status: newStatus });
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown';

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{issue.title}</h3>
                    <div className={styles.badges}>
                        <span
                            className={`${styles.badge} ${styles[issue.priority.toLowerCase()]
                                }`}
                        >
                            {issue.priority}
                        </span>
                    </div>
                </div>

                <p className={styles.description}>{issue.description}</p>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Assigned to:</span>
                        <span className={styles.metaValue}>👤 {issue.assignedTo}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Created by:</span>
                        <span className={styles.metaValue}>{issue.createdBy}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Created:</span>
                        <span className={styles.metaValue}>
                            {formatDate(issue.createdAt)}
                        </span>
                    </div>
                </div>

                <div className={styles.statusControl}>
                    <label htmlFor={`status-${issue.id}`} className={styles.statusLabel}>
                        Status:
                    </label>
                    <select
                        id={`status-${issue.id}`}
                        value={issue.status}
                        onChange={handleStatusChange}
                        className={`${styles.statusSelect} ${styles[issue.status.toLowerCase().replace(' ', '')]
                            }`}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>

            {/* Status Error Modal */}
            <Modal
                isOpen={statusError.show}
                onClose={() => setStatusError({ show: false, message: '' })}
                title="Invalid Status Transition"
                size="small"
                footer={
                    <Button onClick={() => setStatusError({ show: false, message: '' })}>
                        Got it
                    </Button>
                }
            >
                <p className={styles.errorMessage}>{statusError.message}</p>
            </Modal>
        </>
    );
};

export default IssueCard;
