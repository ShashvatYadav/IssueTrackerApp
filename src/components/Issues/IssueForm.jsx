import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../hooks/useIssues';
import {
    validateTitle,
    validateDescription,
    validateAssignedTo,
} from '../../utils/validators';
import { findSimilarIssues } from '../../utils/similarityDetection';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import styles from './IssueForm.module.css';

const IssueForm = () => {
    const { user } = useAuth();
    const { issues, createIssue } = useIssues();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [similarIssuesModal, setSimilarIssuesModal] = useState({
        isOpen: false,
        similarIssues: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title) {
            newErrors.title = 'Title is required';
        } else if (!validateTitle(formData.title)) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.description) {
            newErrors.description = 'Description is required';
        } else if (!validateDescription(formData.description)) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.assignedTo) {
            newErrors.assignedTo = 'Assigned to is required';
        } else if (!validateAssignedTo(formData.assignedTo)) {
            newErrors.assignedTo = 'Must be at least 2 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Check for similar issues
        const similarIssues = findSimilarIssues(formData, issues);

        if (similarIssues.length > 0) {
            setSimilarIssuesModal({
                isOpen: true,
                similarIssues,
            });
            return;
        }

        await submitIssue();
    };

    const submitIssue = async () => {
        setLoading(true);
        const result = await createIssue({
            ...formData,
            createdBy: user.email,
        });
        setLoading(false);

        if (result.success) {
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                status: 'Open',
                assignedTo: '',
            });
            setSimilarIssuesModal({ isOpen: false, similarIssues: [] });
        }
    };

    const handleProceedAnyway = () => {
        setSimilarIssuesModal({ isOpen: false, similarIssues: [] });
        submitIssue();
    };

    const handleCancelCreate = () => {
        setSimilarIssuesModal({ isOpen: false, similarIssues: [] });
    };

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.heading}>Create New Issue</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                            placeholder="Enter issue title"
                        />
                        {errors.title && <span className={styles.error}>{errors.title}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>
                            Description <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                            placeholder="Describe the issue in detail"
                        />
                        {errors.description && (
                            <span className={styles.error}>{errors.description}</span>
                        )}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="priority" className={styles.label}>
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="status" className={styles.label}>
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="assignedTo" className={styles.label}>
                            Assigned To <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="assignedTo"
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.assignedTo ? styles.inputError : ''}`}
                            placeholder="Enter name or email"
                        />
                        {errors.assignedTo && (
                            <span className={styles.error}>{errors.assignedTo}</span>
                        )}
                    </div>

                    <Button type="submit" loading={loading} fullWidth>
                        Create Issue
                    </Button>
                </form>
            </div>

            {/* Similar Issues Modal */}
            <Modal
                isOpen={similarIssuesModal.isOpen}
                onClose={handleCancelCreate}
                title="Similar Issues Found"
                size="large"
                footer={
                    <>
                        <Button variant="outline" onClick={handleCancelCreate}>
                            Cancel
                        </Button>
                        <Button onClick={handleProceedAnyway}>Proceed Anyway</Button>
                    </>
                }
            >
                <div className={styles.modalContent}>
                    <p className={styles.modalText}>
                        We found {similarIssuesModal.similarIssues.length} similar issue(s). You
                        may want to review them before creating a new one:
                    </p>
                    <div className={styles.similarIssuesList}>
                        {similarIssuesModal.similarIssues.map((issue) => (
                            <div key={issue.id} className={styles.similarItem}>
                                <div className={styles.similarHeader}>
                                    <span className={styles.similarTitle}>{issue.title}</span>
                                    <span className={styles.similarityBadge}>
                                        {issue.similarityScore}% match
                                    </span>
                                </div>
                                <p className={styles.similarDescription}>
                                    {issue.description}
                                </p>
                                <div className={styles.similarMeta}>
                                    <span
                                        className={`${styles.badge} ${styles[issue.priority.toLowerCase()]
                                            }`}
                                    >
                                        {issue.priority}
                                    </span>
                                    <span
                                        className={`${styles.badge} ${styles[issue.status.toLowerCase().replace(' ', '')]
                                            }`}
                                    >
                                        {issue.status}
                                    </span>
                                    <span className={styles.assignee}>👤 {issue.assignedTo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default IssueForm;
