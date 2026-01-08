import styles from './FilterBar.module.css';

const FilterBar = ({ filters, onFilterChange, totalIssues, filteredCount }) => {
    const handleStatusChange = (e) => {
        onFilterChange({ ...filters, status: e.target.value });
    };

    const handlePriorityChange = (e) => {
        onFilterChange({ ...filters, priority: e.target.value });
    };

    const handleClearFilters = () => {
        onFilterChange({ status: 'All', priority: 'All' });
    };

    const hasActiveFilters = filters.status !== 'All' || filters.priority !== 'All';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>All Issues</h2>
                <div className={styles.count}>
                    {filteredCount === totalIssues ? (
                        <span>
                            {totalIssues} {totalIssues === 1 ? 'issue' : 'issues'}
                        </span>
                    ) : (
                        <span>
                            Showing {filteredCount} of {totalIssues} issues
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label htmlFor="statusFilter" className={styles.label}>
                        Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={filters.status}
                        onChange={handleStatusChange}
                        className={styles.select}
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="priorityFilter" className={styles.label}>
                        Priority:
                    </label>
                    <select
                        id="priorityFilter"
                        value={filters.priority}
                        onChange={handlePriorityChange}
                        className={styles.select}
                    >
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button onClick={handleClearFilters} className={styles.clearButton}>
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
