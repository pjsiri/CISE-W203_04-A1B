import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formStyles from './AnalystPage.module.scss';
import axios from 'axios';

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
    summary: string;
}

const AnalystPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [summaries, setSummaries] = useState<{ [key: number]: string }>({}); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const securePage = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/auth/signin');
            } else {
                setLoading(false);
            }
        };
        securePage();
    }, [router]);

    useEffect(() => {
        const fetchApprovedArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles?status=approved`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    console.error('Expected an array of articles, but got:', data);
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        if (!loading) {
            fetchApprovedArticles();
        }
    }, [loading]);

    const submitAnalysis = async (id: number, newSummary: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, { summary: newSummary });

            setArticles(
                articles.map((article) =>
                    article._id === id ? { ...article, summary: newSummary } : article
                )
            );

            const newSummaries = { ...summaries };
            delete newSummaries[id];
            setSummaries(newSummaries);

            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error(`Error submitting summary for article ID ${id}:`, error);
        }
    };

    if (loading) {
        return <div className={formStyles.loading}>Loading...</div>;
    }

    return (
        <div className={formStyles.container}>
            <h1 className={formStyles.title}>Analyst Dashboard</h1>
            <h2 className={formStyles.subtitle}>Approved Articles Ready for Analysis</h2>

            <table className={formStyles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Authors</th>
                        <th>Journal</th>
                        <th>Year</th>
                        <th>DOI</th>
                        <th>Analysis</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={formStyles.noArticles}>
                                No articles ready for analysis
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
                                <td>
                                    <textarea
                                        value={summaries[article._id] ?? article.summary ?? ''} 
                                        onChange={(e) => setSummaries({
                                            ...summaries,
                                            [article._id]: e.target.value
                                        })}
                                        placeholder="Enter your analysis here"
                                        className={formStyles.analysisInput}
                                    />
                                </td>
                                <td className={formStyles.actions}>
                                    <button
                                        className={formStyles.submitButton}
                                        onClick={() => submitAnalysis(article._id, summaries[article._id] || article.summary || '')}
                                        disabled={!summaries[article._id]?.trim() && !article.summary?.trim()}
                                    >
                                        {article.summary ? 'Edit Analysis' : 'Submit Analysis'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Success message positioned at the bottom */}
            {showSuccessMessage && (
                <div className={formStyles.successMessage}>
                    Analysis submitted successfully!
                </div>
            )}
        </div>
    );
};

export default AnalystPage;