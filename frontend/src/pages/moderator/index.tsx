import { useState, useEffect } from "react";
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
    status: string; // 'pending', 'approved', 'rejected'
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
            // If the user is not authenticated, redirect to sign-in page
            router.push('/auth/signin');
        } else {
            setLoading(false); // Allow access if the user is authenticated
        }
        };
        securePage();
    }, [router]);

    // Simulate fetching articles for moderation
    useEffect(() => {
        // Dummy data representing articles in moderation queue
        const fetchedArticles: Article[] = [
            {
                id: 1,
                title: "A Study on Test-Driven Development",
                authors: ["John Doe", "Jane Smith"],
                journal: "Software Engineering Journal",
                pubYear: 2020,
                volume: 45,
                number: 3,
                pages: "123-130",
                doi: "10.1000/xyz123",
                status: "pending",
            },
            {
                id: 2,
                title: "Agile Methodologies: A Case Study",
                authors: ["Alice Johnson"],
                journal: "Journal of Agile Research",
                pubYear: 2022,
                volume: 12,
                number: 2,
                pages: "45-58",
                doi: "10.1000/abc456",
                status: "pending",
            },
        ];
        setArticles(fetchedArticles);
    }, []);

    const approveArticle = (id: number) => {
        setArticles(
            articles.map((article) =>
                article.id === id ? { ...article, status: "approved" } : article
            )
        );
    };

    const rejectArticle = (id: number) => {
        setArticles(
            articles.map((article) =>
                article.id === id ? { ...article, status: "rejected" } : article
            )
        );
    };

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
                    {articles.map((article) => (
                        <tr key={article.id}>
                            <td>{article.title}</td>
                            <td>{article.authors.join(", ")}</td>
                            <td>{article.journal}</td>
                            <td>{article.pubYear}</td>
                            <td>{article.doi}</td>
                            <td>{article.status}</td>
                            <td>
                                {article.status === "pending" && (
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
                                {article.status !== "pending" && <span>{article.status}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModeratorPage;
