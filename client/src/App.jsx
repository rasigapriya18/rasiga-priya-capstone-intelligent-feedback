
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/feedback";

const emptyForm = {
  customerName: "",
  feedback: "",
  category: "Product",
  sentiment: "Neutral",
  priority: "Medium",
};

function App() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // GET - Read feedback from MongoDB
  const fetchFeedback = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load feedback");
      }

      setFeedbackList(result.data || []);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // POST - Create or PUT - Update feedback
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      setMessage(
        isEditing
          ? "Feedback updated successfully!"
          : "Feedback added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      await fetchFeedback();
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit button
  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      customerName: item.customerName || "",
      feedback: item.feedback || "",
      category: item.category || "Product",
      sentiment: item.sentiment || "Neutral",
      priority: item.priority || "Medium",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE - Remove feedback
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage("Feedback deleted successfully!");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await fetchFeedback();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Feedback Lens</h1>
        <p>Manage and organize customer feedback</p>
      </header>

      {message && (
        <div className="message" role="status">
          {message}
        </div>
      )}

      <section className="form-section">
        <h2>
          {editingId ? "Update Feedback" : "Add New Feedback"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            placeholder="Enter customer name"
            value={form.customerName}
            onChange={handleChange}
            required
          />

          <label>Feedback</label>
          <textarea
            name="feedback"
            placeholder="Enter customer feedback"
            value={form.feedback}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Product</option>
            <option>Service</option>
            <option>Support</option>
            <option>Other</option>
          </select>

          <label>Sentiment</label>
          <select
            name="sentiment"
            value={form.sentiment}
            onChange={handleChange}
          >
            <option>Positive</option>
            <option>Negative</option>
            <option>Neutral</option>
            <option>Mixed</option>
          </select>

          <label>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Feedback"
                  : "Add Feedback"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="feedback-section">
        <h2>Customer Feedback</h2>

        {feedbackList.length === 0 ? (
          <p>No feedback available yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbackList.map((item) => (
              <article className="feedback-card" key={item._id}>
                <h3>{item.customerName}</h3>

                <p>{item.feedback}</p>

                <div className="feedback-details">
                  <span>{item.category}</span>
                  <span>{item.sentiment}</span>
                  <span>{item.priority} Priority</span>
                </div>

                <div className="action-buttons">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(item)}
                    aria-label="Edit feedback"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(item._id)}
                    aria-label="Delete feedback"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
