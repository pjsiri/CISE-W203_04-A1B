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
  claim: string;
  evidenceResult: string;
  researchType: string;
  participantType: string;
}

const AnalystPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
  const [claims, setClaims] = useState<{ [key: number]: string }>({});
  const [evidenceResults, setEvidenceResults] = useState<{ [key: number]: string }>({});
  const [researchTypes, setResearchTypes] = useState<{ [key: number]: string }>({});
  const [participantTypes, setParticipantTypes] = useState<{ [key: number]: string }>({});
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
          const sortedArticles = data.sort((a, b) => {
            const aHasSummary = a.summary?.trim().length > 0;
            const bHasSummary = b.summary?.trim().length > 0;
            return aHasSummary === bHasSummary ? 0 : aHasSummary ? 1 : -1;
          });
          setArticles(sortedArticles);
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

  const submitAnalysis = async (id: number, newSummary: string, newClaim: string, newEvidenceResult: string, newResearchType: string, newParticipantType: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, {
        summary: newSummary,
        claim: newClaim,
        evidenceResult: newEvidenceResult,
        researchType: newResearchType,
        participantType: newParticipantType,
      });

      setArticles(
        articles.map((article) =>
          article._id === id
            ? { ...article, summary: newSummary, claim: newClaim, evidenceResult: newEvidenceResult, researchType: newResearchType, participantType: newParticipantType }
            : article
        )
      );

      const newSummaries = { ...summaries };
      delete newSummaries[id];
      setSummaries(newSummaries);

      const newClaims = { ...claims };
      delete newClaims[id];
      setClaims(newClaims);

      const newEvidenceResults = { ...evidenceResults };
      delete newEvidenceResults[id];
      setEvidenceResults(newEvidenceResults);

      const newResearchTypes = { ...researchTypes };
      delete newResearchTypes[id];
      setResearchTypes(newResearchTypes);

      const newParticipantTypes = { ...participantTypes };
      delete newParticipantTypes[id];
      setParticipantTypes(newParticipantTypes);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error(`Error submitting analysis for article ID ${id}:`, error);
    }
  };

  const removeAnalysis = async (id: number) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, {
        summary: '',
        claim: '',
        evidenceResult: '',
        researchType: '',
        participantType: '',
      });

      setArticles(
        articles.map((article) =>
          article._id === id ? { ...article, summary: '', claim: '', evidenceResult: '', researchType: '', participantType: '' } : article
        )
      );

      const newSummaries = { ...summaries };
      delete newSummaries[id];
      setSummaries(newSummaries);

      const newClaims = { ...claims };
      delete newClaims[id];
      setClaims(newClaims);

      const newEvidenceResults = { ...evidenceResults };
      delete newEvidenceResults[id];
      setEvidenceResults(newEvidenceResults);

      const newResearchTypes = { ...researchTypes };
      delete newResearchTypes[id];
      setResearchTypes(newResearchTypes);

      const newParticipantTypes = { ...participantTypes };
      delete newParticipantTypes[id];
      setParticipantTypes(newParticipantTypes);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error(`Error removing analysis for article ID ${id}:`, error);
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
            <th>Claim</th>
            <th>Evidence Result</th>
            <th>Research Type</th>
            <th>Participant Type</th>
            <th>Analysis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td colSpan={11} className={formStyles.noArticles}>
                No articles ready for analysis
              </td>
            </tr>
          ) : (
            articles.map((article) => {
              const summaryText = summaries[article._id] ?? article.summary ?? '';
              const claimText = claims[article._id] ?? article.claim ?? '';
              const evidenceResultText = evidenceResults[article._id] ?? article.evidenceResult ?? '';
              const researchTypeText = researchTypes[article._id] ?? article.researchType ?? '';
              const participantTypeText = participantTypes[article._id] ?? article.participantType ?? '';
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
                    <input
                      type="text"
                      value={claimText}
                      onChange={(e) => setClaims({
                        ...claims,
                        [article._id]: e.target.value
                      })}
                      placeholder="Enter claim"
                      className={formStyles.analysisInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={evidenceResultText}
                      onChange={(e) => setEvidenceResults({
                        ...evidenceResults,
                        [article._id]: e.target.value
                      })}
                      placeholder="Enter evidence result"
                      className={formStyles.analysisInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={researchTypeText}
                      onChange={(e) => setResearchTypes({
                        ...researchTypes,
                        [article._id]: e.target.value
                      })}
                      placeholder="Enter research type"
                      className={formStyles.analysisInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={participantTypeText}
                      onChange={(e) => setParticipantTypes({
                        ...participantTypes,
                        [article._id]: e.target.value
                      })}
                      placeholder="Enter participant type"
                      className={formStyles.analysisInput}
                    />
                  </td>
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
                          : submitAnalysis(article._id, summaryText, claimText, evidenceResultText, researchTypeText, participantTypeText)
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