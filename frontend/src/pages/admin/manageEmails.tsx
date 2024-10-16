import { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from "axios";
import { Email, DefaultEmptyEmail } from "@/components/Email"; // Import Email and DefaultEmptyEmail
import formStyles from "./AdminPage.module.scss"; // Reuse the same styles

const AdminEmailsPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(DefaultEmptyEmail);
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

  // Fetch all emails
  const fetchEmails = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails`);
          const data = await response.json();
  
          if (Array.isArray(data)) {
              setEmails(data);
          } else {
              console.error("Expected an array of emails, but got:", data);
          }
      } catch (err) {
          console.error('Error fetching emails:', err);
      }
  };

  // Select an email for editing
  const selectEmail = (email: Email) => {
    setSelectedEmail(email);
    setFormMode("edit");
  };

  // Clear the form
  const clearForm = () => {
    setSelectedEmail(DefaultEmptyEmail);
    setFormMode("add");
  };

  // Delete an email
  const deleteEmail = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails/${id}`
      );
      fetchEmails(); // Refresh emails after deletion
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  };

  // Handle form submission for adding/editing an email
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formMode === "edit" && selectedEmail) {
      // Handle update logic
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails/${selectedEmail._id}`,
          selectedEmail
        );
        setFormMode("add");
      } catch (error) {
        console.error("Error updating email:", error);
      }
    } else {
      // Handle add logic
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails`,
          selectedEmail
        );
      } catch (error) {
        console.error("Error adding email:", error);
      }
    }

    // Reset form and fetch emails after submission
    setSelectedEmail(DefaultEmptyEmail);
    fetchEmails();
  };

  const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = event.target;
    
      // Update only the relevant fields without breaking the entire Email type
      setSelectedEmail((prev) => {
        if (!prev) return null;
    
        return { ...prev, [name]: value } as Email;
      });
    };
  
  useEffect(() => {
    fetchEmails(); // Fetch all emails on component load
  }, []);

  if (loading) {
    return <div className={formStyles.loading}>Loading...</div>;
  }

  return (
    <div className={formStyles.adminContainer}>
      <h1 className={formStyles.title}>Admin Roles Dashboard</h1>

      {/* Form for Adding or Editing an Email */}
      <div className={formStyles.formContainer}>
        <h2>{formMode === "edit" ? "Edit Role" : "Add New Role"}</h2>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Name:
              <input
                className={formStyles.input}
                type="text"
                name="name"
                value={selectedEmail?.name || ""}
                onChange={handleInputChange}
                required
              />
            </label>


            <label className={formStyles.label}>
              Role:
              <select
                className={formStyles.select}
                name="role"
                value={selectedEmail?.role || "moderator"}
                onChange={handleInputChange}
                required
              >
                <option value="moderator">Moderator</option>
                <option value="analyst">Analyst</option>
              </select>
            </label>
          </div>

          <div className={formStyles.inputGroup}>
            <label className={formStyles.label}>
              Email:
              <input
                className={formStyles.input}
                type="email"
                name="email"
                value={selectedEmail?.email || ""}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <button className={formStyles.button} type="submit">
            {formMode === "edit" ? "Update Email" : "Add Email"}
          </button>
        </form>
        {formMode === "edit" && (
          <button className={formStyles.clearButton} onClick={clearForm}>
            Clear Form
          </button>
        )}
      </div>

      {/* Emails List */}
      <div className={formStyles.articlesList}>
        <h2>All Roles</h2>
        <table className={formStyles.table}>
          <thead className={formStyles.thead}>
            <tr>
              <th className={formStyles.th}>Name</th>
              <th className={formStyles.th}>Role</th>
              <th className={formStyles.th}>Email</th>
              <th className={formStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email._id} className={formStyles.tr}>
                <td className={formStyles.td}>{email.name}</td>
                <td className={formStyles.td}>{email.role}</td>
                <td className={formStyles.td}>{email.email}</td>
                <td className={formStyles.td}>
                  <button
                    className={formStyles.actionButton}
                    onClick={() => selectEmail(email)}
                  >
                    Edit
                  </button>
                  <button
                    className={formStyles.actionButton}
                    onClick={() => {
                        if (email._id) {
                          deleteEmail(email._id);
                        } else {
                          console.error("Email ID is undefined");
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

export default AdminEmailsPage;
