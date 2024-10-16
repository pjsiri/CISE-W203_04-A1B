import { useState, useEffect } from "react";
import axios from "axios";
import { Article, DefaultEmptyArticle } from "@/components/Article"; // Import Article and DefaultEmptyArticle
import submitStyles from "./SubmitArticlePage.module.scss"; // Styling for the form
import { send, init } from "emailjs-com";

const SubmitArticlePage = () => {
  const [article, setArticle] = useState<Article>(DefaultEmptyArticle);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID!);
  }, []);

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  // Send email notification to moderators
  const sendEmailNotification = async (articleTitle: string, articleAuthors: string, submitterName: string, submitterEmail: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails?role=moderator`);
      const moderators = await response.json();
  
      if (Array.isArray(moderators)) {
        // Collect all promises for sending emails
        const emailPromises = moderators.map(async (moderator: { name: string; email: string }) => {
          const templateParams = {
            to_name: moderator.name,
            to_email: moderator.email,
            articleTitle: articleTitle,
            articleAuthors: articleAuthors,
            submitterName: submitterName,
            submitterEmail: submitterEmail,
          };
  
          return send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_MOD_TEMPLATE_ID!,
            templateParams
          );
        });
  
        // Wait for all email sending promises to complete
        await Promise.all(emailPromises);
      } else {
        console.error("Expected an array of moderators, but got:", moderators);
      }
    } catch (error) {
      console.error("Failed to fetch moderators or send email:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`, article);
      setSuccessMessage("Article submitted successfully!");
      await sendEmailNotification(article.title!, article.authors!, article.submitterName!, article.submitterEmail!);
      setArticle(DefaultEmptyArticle); // Reset the form after submission
    } catch (error) {
      setErrorMessage("Failed to submit the article. Please try again.");
      console.error("Error submitting article:", error);
    }
  };

  return (
    <div className={submitStyles.container}>
      <h1 className={submitStyles.title}>Submit an Article</h1>
      <form className={submitStyles.form} onSubmit={handleSubmit}>
        <h2>Submitter Information</h2>
        <div className={submitStyles.inputGroup}>
          <label className={submitStyles.label}>
            Name:
            <input
              className={submitStyles.input}
              type="text"
              name="submitterName"
              value={article.submitterName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className={submitStyles.label}>
            Email:
            <input
              className={submitStyles.input}
              type="email"
              name="submitterEmail"
              value={article.submitterEmail}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <h2>Article Information</h2>
        <div className={submitStyles.inputGroup}>
          <label className={submitStyles.label}>
            Title:
            <input
              className={submitStyles.input}
              type="text"
              name="title"
              value={article.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className={submitStyles.label}>
            Authors:
            <input
              className={submitStyles.input}
              type="text"
              name="authors"
              value={article.authors}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className={submitStyles.inputGroup}>
          <label className={submitStyles.label}>
            Journal/Source:
            <input
              className={submitStyles.input}
              type="text"
              name="source"
              value={article.source}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className={submitStyles.label}>
            Publication Year:
            <input
              className={submitStyles.input}
              type="text"
              name="pubYear"
              value={article.pubYear}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className={submitStyles.inputGroup}>
          <label className={submitStyles.label}>
            Volume:
            <input
              className={submitStyles.input}
              type="text"
              name="volume"
              value={article.volume}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className={submitStyles.label}>
            Number:
            <input
              className={submitStyles.input}
              type="text"
              name="number"
              value={article.number}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className={submitStyles.inputGroup}>
          <label className={submitStyles.label}>
            Pages:
            <input
              className={submitStyles.input}
              type="text"
              name="pages"
              value={article.pages}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className={submitStyles.label}>
            DOI:
            <input
              className={submitStyles.input}
              type="text"
              name="doi"
              value={article.doi}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <button className={submitStyles.button} type="submit">
          Submit Article
        </button>

        {successMessage && <p className={submitStyles.success}>{successMessage}</p>}
        {errorMessage && <p className={submitStyles.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SubmitArticlePage;
