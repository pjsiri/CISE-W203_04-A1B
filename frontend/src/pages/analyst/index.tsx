import React, { useState, useEffect, FormEvent } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AnalystForm = () => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [source, setSource] = useState('');
  const [pubYear, setPubYear] = useState('');
  const [doi, setDoi] = useState('');
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
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

  // Handle form submission to the backend
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newArticle = {
      title,
      authors,
      source,
      pubYear,
      doi,
      claim,
      evidence,
    };

    try {
      // Send data to the backend API
      const response = await axios.post('http://localhost:8082/articles', newArticle);
      console.log('Article saved:', response.data);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
  <div>
    <h1>Welcome Analyst</h1>
    <h2>Enter New Article Information</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Authors:
          <input value={authors} onChange={(e) => setAuthors(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Source:
          <input value={source} onChange={(e) => setSource(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Publication Year:
          <input value={pubYear} onChange={(e) => setPubYear(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          DOI:
          <input value={doi} onChange={(e) => setDoi(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Claim:
          <input value={claim} onChange={(e) => setClaim(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Evidence:
          <input value={evidence} onChange={(e) => setEvidence(e.target.value)} required />
        </label>
      </div>
      <button type="submit">Save Article</button>
    </form>
  </div>
  );
}

export default AnalystForm;