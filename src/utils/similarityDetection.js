/**
 * Calculate Levenshtein distance between two strings
 * This algorithm measures the minimum number of single-character edits
 * required to change one word into another
 */
const levenshteinDistance = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[len1][len2];
};

/**
 * Calculate similarity score between two strings (0-100%)
 */
const calculateSimilarity = (str1, str2) => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 100;

    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return ((maxLength - distance) / maxLength) * 100;
};

/**
 * Extract keywords from a text (simple implementation)
 * Removes common words and extracts meaningful terms
 */
const extractKeywords = (text) => {
    const commonWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    ]);

    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter((word) => word.length > 2 && !commonWords.has(word));
};

/**
 * Calculate keyword overlap between two texts
 */
const calculateKeywordOverlap = (text1, text2) => {
    const keywords1 = new Set(extractKeywords(text1));
    const keywords2 = new Set(extractKeywords(text2));

    if (keywords1.size === 0 || keywords2.size === 0) return 0;

    const intersection = new Set([...keywords1].filter((x) => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);

    return (intersection.size / union.size) * 100;
};

/**
 * Find similar issues based on title and description
 * @param {Object} newIssue - The new issue being created
 * @param {Array} existingIssues - Array of existing issues
 * @param {number} threshold - Similarity threshold (0-100)
 * @returns {Array} - Array of similar issues with similarity scores
 */
export const findSimilarIssues = (newIssue, existingIssues, threshold = 60) => {
    const similarIssues = [];

    existingIssues.forEach((issue) => {
        // Calculate title similarity
        const titleSimilarity = calculateSimilarity(newIssue.title, issue.title);

        // Calculate description keyword overlap
        const descriptionSimilarity = calculateKeywordOverlap(
            newIssue.description,
            issue.description
        );

        // Weighted average (title is more important)
        const overallSimilarity = titleSimilarity * 0.7 + descriptionSimilarity * 0.3;

        // Bonus for same priority and status
        let bonus = 0;
        if (newIssue.priority === issue.priority) bonus += 5;
        if (newIssue.status === issue.status) bonus += 5;

        const finalScore = Math.min(overallSimilarity + bonus, 100);

        if (finalScore >= threshold) {
            similarIssues.push({
                ...issue,
                similarityScore: Math.round(finalScore),
            });
        }
    });

    // Sort by similarity score (highest first)
    return similarIssues.sort((a, b) => b.similarityScore - a.similarityScore);
};
