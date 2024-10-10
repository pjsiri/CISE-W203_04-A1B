import React, { useState, useEffect, FormEvent } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formStyles from "../../styles/Form.module.scss";
// import axios from 'axios';

const AnalystForm = () => {
  // const [title, setTitle] = useState("");
  // const [authors, setAuthors] = useState<string[]>([]);
  // const [source, setSource] = useState("");
  // const [pubYear, setPubYear] = useState<number>(0);
  // const [volume, setVolume] = useState<number>(0);
  // const [number, setNumber] = useState<number>(0);
  // const [pages, setPages] = useState("");
  // const [doi, setDoi] = useState("");
  const [summary, setSummary] = useState("");
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

    // const newArticle = {
    //   title,
    //   authors,
    //   source,
    //   publication_year: pubYear,
    //   volume,
    //   number,
    //   pages,
    //   doi,
    //   summary,
    // };

    // try {
    //   // Send data to the backend API
    //   const response = await axios.post('http://localhost:8082/articles', newArticle);
    //   console.log('Article saved:', response.data);
    // } catch (error) {
    //   console.error('Error saving article:', error);
    // }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>Welcome Analyst</h1>
      <h2>Enter New Article Information</h2>

      <form className={formStyles.form} onSubmit={handleSubmit}>
      <label htmlFor="summary">Summary:</label>
      <textarea
          className={formStyles.formTextArea}
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
      />

      <button className={formStyles.formItem} type="submit">
        Submit
      </button>
      </form>
    </div>
  );
}

export default AnalystForm;