// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const validatePassword = (password) => {
    return password.length >= 6;
};

// Issue title validation
export const validateTitle = (title) => {
    return title.trim().length >= 3;
};

// Issue description validation
export const validateDescription = (description) => {
    return description.trim().length >= 10;
};

// Assigned to validation
export const validateAssignedTo = (assignedTo) => {
    return assignedTo.trim().length >= 2;
};

// Status transition validation
export const canTransitionStatus = (currentStatus, newStatus) => {
    // Prevent direct transition from Open to Done
    if (currentStatus === 'Open' && newStatus === 'Done') {
        return {
            allowed: false,
            message: 'Cannot move an issue directly from "Open" to "Done". Please move it to "In Progress" first.',
        };
    }

    return {
        allowed: true,
        message: '',
    };
};
