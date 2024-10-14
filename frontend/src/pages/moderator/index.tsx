import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formStyles from "./ModeratorPage.module.scss"; // We'll create this CSS module

interface Article {
    _id: number;
    title: string;
    authors: string;
    source: string;
    pubYear: string;
    volume: string;
    number: string;
    pages: string;
    doi: string;
    status: string; // 'pending_moderation', 'approved', 'rejected'
    seMethod: string;
}

const ModeratorPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [seMethods, setSeMethods] = useState<string[]>([]);
    const [selectedSeMethod, setSelectedSeMethod] = useState<string>("");
    const [newSeMethod, setNewSeMethod] = useState<string>("");
    const router = useRouter();

    // Check if the user is authenticated
    useEffect(() => {
        const securePage = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/auth/signin'); // Redirect to sign-in if not authenticated
            } else {
                setLoading(false); // Allow access if authenticated
            }
        };
        securePage();
    }, [router]);

    // Fetch articles with "pending_moderation" status from the backend API
    useEffect(() => {
        const fetchPendingArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles?status=pending_moderation`);
                const data = await response.json();
        
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    console.error("Expected an array of articles, but got:", data);
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        if (!loading) {
            fetchPendingArticles(); // Fetch articles only after session check
        }
    }, [loading]);

    // Fetch distinct SE Methods from the backend API
    useEffect(() => {
        const fetchSeMethods = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/distinct-se-methods`);
                const data = await response.json();
        
                if (Array.isArray(data)) {
                    setSeMethods(data);
                } else {
                    console.error("Expected an array of SE Methods, but got:", data);
                }
            } catch (err) {
                console.error('Error fetching SE Methods:', err);
                alert('Failed to fetch SE Methods. Please try again later.');
            }
        };

        fetchSeMethods();
    }, []);

    const updateArticleStatusAndSeMethod = async (id: number, newStatus: string, seMethod: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, { status: newStatus, seMethod });
            // Update the local state after the status is changed successfully
            setArticles(
                articles.map((article) =>
                    article._id === id ? { ...article, status: newStatus, seMethod } : article
                )
            );
        } catch (error) {
            console.error(`Error updating article status to ${newStatus}:`, error);
        }
    };

    const approveArticle = (id: number) => {
        const seMethod = newSeMethod || selectedSeMethod;
        if (!seMethod) {
            alert("Please select or enter an SE Method.");
            return;
        }
        updateArticleStatusAndSeMethod(id, "approved", seMethod);
    };

    const rejectArticle = (id: number) => {
        updateArticleStatusAndSeMethod(id, "rejected", "");
    };

    if (loading) {
        return <div className={formStyles.loading}>Loading...</div>; // Display a loading indicator while checking authentication
    }

    return (
        <div className={formStyles.container}>
            <h1 className={formStyles.title}>Moderator Dashboard</h1>
            <h2 className={formStyles.subtitle}>Articles Pending Moderation</h2>
            <table className={formStyles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Authors</th>
                        <th>Journal</th>
                        <th>Year</th>
                        <th>DOI</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={formStyles.noArticles}>
                                No articles pending moderation
                            </td>
                        </tr>
                    ) : (
                        articles.map((article) => (
                            <tr key={article._id} className={formStyles.tableRow}>
                                <td>{article.title}</td>
                                <td>{article.authors}</td>
                                <td>{article.source}</td>
                                <td>{article.pubYear}</td>
                                <td>{article.doi}</td>
                                <td className={formStyles.status}>
                                    {article.status.replace("_", " ").toUpperCase()}
                                </td>
                                <td className={formStyles.actions}>
                                    {article.status === "pending_moderation" ? (
                                        <div className={formStyles.buttonGroup}>
                                            <select
                                                value={selectedSeMethod}
                                                onChange={(e) => setSelectedSeMethod(e.target.value)}
                                                className={formStyles.formItem}
                                            >
                                                <option value="">Select SE Method</option>
                                                {seMethods.map((method) => (
                                                    <option key={method} value={method}>
                                                        {method}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Or enter new SE Method"
                                                value={newSeMethod}
                                                onChange={(e) => setNewSeMethod(e.target.value)}
                                                className={formStyles.formItem}
                                            />
                                            <button
                                                className={formStyles.approveButton}
                                                onClick={() => approveArticle(article._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className={formStyles.rejectButton}
                                                onClick={() => rejectArticle(article._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={formStyles.statusText}>
                                            {article.status.replace("_", " ").toUpperCase()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ModeratorPage;
