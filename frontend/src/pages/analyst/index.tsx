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
    pubYear: number;
    volume: string;
    number: string;
    pages: string;
    doi: string;
    summary: string;
    status: string; // New field to track status
}

const AnalystPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showAnalysed, setShowAnalysed] = useState(false); // Toggle between non-analysed and analysed
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
        const fetchArticles = async () => {
            try {
                // Fetch approved articles
                const approvedResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles?status=approved`);
                const approvedData = await approvedResponse.json();
    
                // Fetch analysed articles
                const analysedResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles?status=analysed`);
                const analysedData = await analysedResponse.json();
    
                if (Array.isArray(approvedData) && Array.isArray(analysedData)) {
                    const combinedArticles = [...approvedData, ...analysedData];
                    setArticles(combinedArticles);
                } else {
                    console.error('Expected an array of articles, but got:', approvedData, analysedData);
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };
    
        if (!loading) {
            fetchArticles();
        }
    }, [loading]);

    const submitAnalysis = async (id: number, newSummary: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, { summary: newSummary, status: 'analysed' });

            setArticles(
                articles.map((article) =>
                    article._id === id ? { ...article, summary: newSummary, status: 'analysed' } : article
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

    const removeAnalysis = async (id: number) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, { summary: '', status: 'approved' });

            setArticles(
                articles.map((article) =>
                    article._id === id ? { ...article, summary: '', status: 'approved' } : article
                )
            );

            const newSummaries = { ...summaries };
            delete newSummaries[id];
            setSummaries(newSummaries);

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error(`Error removing analysis for article ID ${id}:`, error);
        }
    };

    const toggleView = () => setShowAnalysed(!showAnalysed); // Toggle between the two views

    const filteredArticles = articles.filter(article => 
        showAnalysed ? article.status === 'analysed' : article.status === 'approved'
    );

    if (loading) {
        return <div className={formStyles.loading}>Loading...</div>;
    }

    return (
        <div className={formStyles.container}>
            <h1 className={formStyles.title}>Analyst Dashboard</h1>
            <td className={formStyles.actions}>
                <button onClick={toggleView} className={formStyles.submitButton}>
                    {showAnalysed ? 'View Non-Analysed Articles' : 'View Analysed Articles'}
                </button>
            </td>
            <h2 className={formStyles.subtitle}>
                {showAnalysed ? 'Analysed Articles for modification' : 'Approved Articles Ready for Analysis'}
            </h2>

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
                    {filteredArticles.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={formStyles.noArticles}>
                                No articles in this category
                            </td>
                        </tr>
                    ) : (
                        filteredArticles.map((article) => {
                            const summaryText = summaries[article._id] ?? article.summary ?? '';
                            const isEmpty = summaryText.trim() === '';
                            const hasExistingSummary = !!article.summary?.trim();

                            return (
                                <tr key={article._id} className={formStyles.tableRow}>
                                    <td>{article.title}</td>
                                    <td>{article.authors}</td>
                                    <td>{article.source}</td>
                                    <td>{article.pubYear}</td>
                                    <td>{article.doi}</td>
                                    <td>
                                        <textarea
                                            value={summaryText}
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
                                            className={
                                                isEmpty && hasExistingSummary
                                                    ? formStyles.removeButton
                                                    : formStyles.submitButton
                                            }
                                            onClick={() =>
                                                isEmpty && hasExistingSummary
                                                    ? removeAnalysis(article._id)
                                                    : submitAnalysis(article._id, summaryText)
                                            }
                                            disabled={!summaryText.trim() && !hasExistingSummary}
                                        >
                                            {isEmpty && hasExistingSummary ? 'Remove Analysis' : hasExistingSummary ? 'Edit Analysis' : 'Submit Analysis'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {showSuccessMessage && (
                <div className={formStyles.successMessage}>
                    Analysis updated successfully!
                </div>
            )}
        </div>
    );
};

export default AnalystPage;