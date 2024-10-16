import { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from "axios";
import { Article, DefaultEmptyArticle } from "@/components/Article";
import formStyles from "./AdminPage.module.scss";

const AdminPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(DefaultEmptyArticle);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
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

  // Fetch all articles
  const fetchArticles = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`);
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

  // Select an article for editing
  const selectArticle = (article: Article) => {
    setSelectedArticle(article);
    setFormMode("edit");
  };

  // Clear the form
  const clearForm = () => {
    setSelectedArticle(DefaultEmptyArticle);
    setFormMode("add");
  };

  // Delete an article
  const deleteArticle = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`
      );
      fetchArticles(); // Refresh articles after deletion
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  // Handle form submission for adding/editing an article
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formMode === "edit" && selectedArticle) {
      // Handle update logic
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${selectedArticle._id}`,
          selectedArticle
        );
      } catch (error) {
        console.error("Error updating article:", error);
      }
    } else {
      // Handle add logic
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`,
          selectedArticle
        );
      } catch (error) {
        console.error("Error adding article:", error);
      }
    }

    // Reset form and fetch articles after submission
    setSelectedArticle(DefaultEmptyArticle);
    fetchArticles();
  };

  const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = event.target;
    
      // Update only the relevant fields without breaking the entire Article type
      setSelectedArticle((prev) => {
        if (!prev) return null;
    
        return { ...prev, [name]: value } as Article;
      });
    };
  
  
  useEffect(() => {
    fetchArticles(); // Fetch all articles on component load
  }, []);

  if (loading) {
    return <div className={formStyles.loading}>Loading...</div>;
  }

  return (
    <div className={formStyles.adminContainer}>
      <h1 className={formStyles.title}>Admin Dashboard</h1>

      {/* Form for Adding or Editing an Article */}
      <div className={formStyles.formContainer}>
        <h2>{formMode === "edit" ? "Edit Article" : "Add New Article"}</h2>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Title:
              <input
                className={formStyles.input}
                type="text"
                name="title"
                value={selectedArticle?.title || ""}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className={formStyles.label}>
              Authors:
              <input
                className={formStyles.input}
                type="text"
                name="authors"
                value={selectedArticle?.authors || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Journal:
              <input
                className={formStyles.input}
                type="text"
                name="source"
                value={selectedArticle?.source || ""}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className={formStyles.label}>
              Publication Year:
              <input
                className={formStyles.input}
                type="text"
                name="pubYear"
                value={selectedArticle?.pubYear || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Volume:
              <input
                className={formStyles.input}
                type="text"
                name="volume"
                value={selectedArticle?.volume || ""}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className={formStyles.label}>
              Number:
              <input
                className={formStyles.input}
                type="text"
                name="number"
                value={selectedArticle?.number || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Pages:
              <input
                className={formStyles.input}
                type="text"
                name="pages"
                value={selectedArticle?.pages || ""}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className={formStyles.label}>
              DOI:
              <input
                className={formStyles.input}
                type="text"
                name="doi"
                value={selectedArticle?.doi || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          
          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              SE Method:
              <input
                className={formStyles.input}
                type="text"
                name="seMethod"
                value={selectedArticle?.seMethod || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Summary:
              <input
                className={formStyles.input}
                type="text"
                name="summary"
                value={selectedArticle?.summary || ""}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <label className={formStyles.label}>
            Status:
            <select
              className={formStyles.select}
              name="status"
              value={selectedArticle?.status || "pending_moderation"}
              onChange={handleInputChange}
              required
            >
              <option value="pending_moderation">Pending Moderation</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <button className={formStyles.button} type="submit">
            {formMode === "edit" ? "Update Article" : "Add Article"}
          </button>
        </form>
        {formMode === "edit" && (
          <button className={formStyles.clearButton} onClick={clearForm}>
            Clear Form
          </button>
        )}
      </div>

      {/* Articles List */}
      <div className={formStyles.articlesList}>
        <h2>All Articles</h2>
        <table className={formStyles.table}>
          <thead className={formStyles.thead}>
            <tr>
              <th className={formStyles.th}>Title</th>
              <th className={formStyles.th}>Authors</th>
              <th className={formStyles.th}>Journal</th>
              <th className={formStyles.th}>Year</th>
              <th className={formStyles.th}>Status</th>
              <th className={formStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id} className={formStyles.tr}>
                <td className={formStyles.td}>{article.title}</td>
                <td className={formStyles.td}>{article.authors}</td>
                <td className={formStyles.td}>{article.source}</td>
                <td className={formStyles.td}>{article.pubYear}</td>
                <td className={formStyles.td}>{article.status}</td>
                <td className={formStyles.td}>
                  <button
                    className={formStyles.actionButton}
                    onClick={() => selectArticle(article)}
                  >
                    Edit
                  </button>
                  <button
                    className={formStyles.actionButton}
                    onClick={() => {
                        if (article._id) {
                          deleteArticle(article._id);
                        } else {
                          console.error("Article ID is undefined");
                        }
                      }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
