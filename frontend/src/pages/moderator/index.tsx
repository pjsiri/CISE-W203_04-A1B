import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Article {
    id: number;
    title: string;
    authors: string[];
    journal: string;
    pubYear: number;
    volume: number;
    number: number;
    pages: string;
    doi: string;
    status: string; // 'pending_moderation', 'approved', 'rejected'
}

const ModeratorPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/article?status=pending_moderation`);
                const data = await response.json();

                // Check if the response is an array
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

    const updateArticleStatus = async (id: number, newStatus: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, { status: newStatus });
            // Update the local state after the status is changed successfully
            setArticles(
                articles.map((article) =>
                    article.id === id ? { ...article, status: newStatus } : article
                )
            );
        } catch (error) {
            console.error(`Error updating article status to ${newStatus}:`, error);
        }
    };

    const approveArticle = (id: number) => {
        updateArticleStatus(id, "approved");
    };

    const rejectArticle = (id: number) => {
        updateArticleStatus(id, "rejected");
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while checking authentication
    }

    return (
        <div className="container">
            <h1>Moderator Page</h1>
            <h2>Submitted Articles</h2>
            <table>
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
                            <td colSpan={7}>No articles pending moderation</td>
                        </tr>
                    ) : (
                        articles.map((article) => (
                            <tr key={article.id}>
                                <td>{article.title}</td>
                                <td>{article.authors.join(", ")}</td>
                                <td>{article.journal}</td>
                                <td>{article.pubYear}</td>
                                <td>{article.doi}</td>
                                <td>
                                    {/* Display user-friendly status */}
                                    {article.status.replace("_", " ").toUpperCase()}
                                </td>
                                <td>
                                    {article.status === "pending_moderation" && (
                                        <>
                                            <button
                                                onClick={() => approveArticle(article.id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectArticle(article.id)}
                                                style={{ marginLeft: "1rem" }}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {article.status !== "pending_moderation" && (
                                        <span>{article.status.replace("_", " ").toUpperCase()}</span>
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
