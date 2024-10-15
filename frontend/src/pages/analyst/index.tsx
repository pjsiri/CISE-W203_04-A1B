import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formStyles from "./AnalystPage.module.scss";
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
  summary: string; // This field holds the summary/analysis from the analyst
}

const AnalystPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({}); // Track summaries for each article
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null); // Track selected article ID
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

  // Fetch articles that have been approved and are in the analysis queue
  useEffect(() => {
      const fetchApprovedArticles = async () => {
          try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles?status=approved`);
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
          fetchApprovedArticles(); // Fetch articles only after session check
      }
  }, [loading]);

  const submitAnalysis = async (id: number) => {
    try {
        const summary = summaries[id]; // Get the summary for the specific article
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}/summary`, { summary }); // Use the new endpoint
        // Clear the analysis input after submitting
        setSummaries((prev) => ({ ...prev, [id]: '' })); // Clear the submitted summary
        setSelectedArticleId(null); // Deselect the article after submission
    } catch (error) {
        console.error(`Error submitting summary for article ID ${id}:`, error);
    }
  };

  const handleSummaryChange = (id: number, value: string) => {
    setSummaries((prev) => ({ ...prev, [id]: value })); // Update the specific article's summary
  };

  if (loading) {
      return <div className={formStyles.loading}>Loading...</div>; // Display a loading indicator while checking authentication
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
                                      value={summaries[article._id] || ''} // Use individual summaries for each article
                                      onChange={(e) => handleSummaryChange(article._id, e.target.value)} // Update specific article summary
                                      placeholder="Enter your analysis here"
                                      className={formStyles.analysisInput}
                                  />
                              </td>
                              <td className={formStyles.actions}>
                                  <button
                                      className={formStyles.submitButton}
                                      onClick={() => submitAnalysis(article._id)}
                                      disabled={!summaries[article._id]?.trim()} // Disable button if summary is empty
                                  >
                                      Submit Analysis
                                  </button>
                              </td>
                          </tr>
                      ))
                  )}
              </tbody>
          </table>
      </div>
  );
};

export default AnalystPage;