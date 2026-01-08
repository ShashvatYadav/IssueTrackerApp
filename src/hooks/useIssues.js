import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

export const useIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Real-time listener for issues
        const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const issuesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Firestore timestamps to Date objects
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                }));
                setIssues(issuesData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error fetching issues:', err);
                setError('Failed to load issues');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const createIssue = async (issueData) => {
        try {
            const newIssue = {
                ...issueData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'issues'), newIssue);
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('Error creating issue:', err);
            return { success: false, error: 'Failed to create issue' };
        }
    };

    const updateIssue = async (issueId, updates) => {
        try {
            const issueRef = doc(db, 'issues', issueId);
            await updateDoc(issueRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (err) {
            console.error('Error updating issue:', err);
            return { success: false, error: 'Failed to update issue' };
        }
    };

    const deleteIssue = async (issueId) => {
        try {
            await deleteDoc(doc(db, 'issues', issueId));
            return { success: true };
        } catch (err) {
            console.error('Error deleting issue:', err);
            return { success: false, error: 'Failed to delete issue' };
        }
    };

    return {
        issues,
        loading,
        error,
        createIssue,
        updateIssue,
        deleteIssue,
    };
};
