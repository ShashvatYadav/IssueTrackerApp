import { useState, useMemo } from 'react';
import { useIssues } from '../../hooks/useIssues';
import IssueCard from './IssueCard';
import FilterBar from './FilterBar';
import styles from './IssueList.module.css';

const IssueList = () => {
    const { issues, loading, error } = useIssues();
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
    });

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            const statusMatch =
                filters.status === 'All' || issue.status === filters.status;
            const priorityMatch =
                filters.priority === 'All' || issue.priority === filters.priority;
            return statusMatch && priorityMatch;
        });
    }, [issues, filters]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading issues...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>⚠️ {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                totalIssues={issues.length}
                filteredCount={filteredIssues.length}
            />

            {filteredIssues.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3 className={styles.emptyTitle}>
                        {issues.length === 0 ? 'No issues yet' : 'No matching issues'}
                    </h3>
                    <p className={styles.emptyText}>
                        {issues.length === 0
                            ? 'Create your first issue to get started!'
                            : 'Try adjusting your filters to see more issues.'}
                    </p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default IssueList;
