import React, { useState, useEffect } from "react";
import { Send, MessageSquare, Users, AlertCircle, CheckCircle, Clock, User, Search, Filter, Trash2, RefreshCw, Star, BarChart, Eye } from "lucide-react";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [form, setForm] = useState({
    sender: "",
    recipient_team: "",
    content: "",
    category: "positif",
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ganti dengan IP Ubuntu Anda yang sebenarnya
  const API_URL = "http://localhost:5000"; // Sesuaikan dengan IP Anda

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, filterCategory, filterTeam]);

  const fetchFeedbacks = async () => {
    try {
      console.log("🔄 Fetching feedbacks...");
      const response = await fetch(`${API_URL}/api/feedback`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Feedbacks loaded:", data);
      setFeedbacks(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load feedbacks: " + err.message);
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (feedback) => feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) || feedback.sender.toLowerCase().includes(searchTerm.toLowerCase()) || feedback.recipient_team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((feedback) => feedback.category === filterCategory);
    }

    // Team filter
    if (filterTeam !== "all") {
      filtered = filtered.filter((feedback) => feedback.recipient_team === filterTeam);
    }

    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  const getUniqueTeams = () => {
    return [...new Set(feedbacks.map((f) => f.recipient_team))];
  };

  const getStats = () => {
    const total = feedbacks.length;
    const positif = feedbacks.filter((f) => f.category === "positif").length;
    const saran = feedbacks.filter((f) => f.category === "saran").length;
    const keluhan = feedbacks.filter((f) => f.category === "keluhan").length;
    const anonymous = feedbacks.filter((f) => f.anonymous).length;

    return { total, positif, saran, keluhan, anonymous };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log("📝 Form updated:", { [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("📤 Submitting form:", form);

      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`, "message: ${errorText}");
      }

      const result = await response.json();
      console.log("✅ Submission successful:", result);

      setSuccess("Feedback berhasil dikirim!");

      // Reset form
      setForm({
        sender: "",
        recipient_team: "",
        content: "",
        category: "positif",
        anonymous: false,
      });

      // Reload feedbacks
      await fetchFeedbacks();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Submit error:", error);
      setError("Failed to submit feedback: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "positif":
        return <CheckCircle size={16} style={{ color: "#22c55e" }} />;
      case "saran":
        return <MessageSquare size={16} style={{ color: "#3b82f6" }} />;
      case "keluhan":
        return <AlertCircle size={16} style={{ color: "#ef4444" }} />;
      default:
        return <MessageSquare size={16} style={{ color: "#6b7280" }} />;
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case "positif":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        };
      case "saran":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #93c5fd",
        };
      case "keluhan":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #d1d5db",
        };
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "32px 16px",
  };

  const mainContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "32px",
  };

  const titleStyle = {
    fontSize: "42px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    textShadow: "0 4px 8px rgba(0,0,0,0.3)",
  };

  const subtitleStyle = {
    color: "rgba(255,255,255,0.9)",
    fontSize: "18px",
    fontWeight: "300",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "32px",
    marginBottom: "32px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const alertStyle = (type) => ({
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: type === "error" ? "#fef2f2" : "#f0fdf4",
    border: `1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}`, // <-- perbaikan di sini
    color: type === "error" ? "#991b1b" : "#166534",
    animation: "slideIn 0.3s ease-out",
  });

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    transition: "all 0.3s",
    outline: "none",
    backgroundColor: "#fafafa",
  };

  const labelStyle = {
    display: "block",
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  };

  const buttonStyle = {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transform: loading ? "scale(0.98)" : "scale(1)",
  };

  const statsCardStyle = {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  const filterButtonStyle = (active) => ({
    padding: "8px 16px",
    border: active ? "2px solid #667eea" : "2px solid transparent",
    borderRadius: "8px",
    backgroundColor: active ? "rgba(102, 126, 234, 0.1)" : "transparent",
    color: active ? "#667eea" : "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
    fontWeight: "500",
  });

  const feedbackItemStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    transition: "all 0.3s",
    cursor: "pointer",
    backgroundColor: "#fafafa",
    position: "relative",
    overflow: "hidden",
  };

  const stats = getStats();

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .feedback-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
          }
          input:focus, textarea:focus, select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          .stat-card:hover {
            transform: translateY(-4px);
            transition: all 0.3s;
          }
        `}
      </style>

      <div style={mainContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <MessageSquare size={48} style={{ color: "white" }} />
            Feedback System Pro
          </h1>
          <p style={subtitleStyle}>Platform feedback modern untuk meningkatkan kolaborasi tim</p>
        </div>

        {/* Statistics Cards */}
        {showStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div style={statsCardStyle} className="stat-card">
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea", marginBottom: "8px" }}>{stats.total}</div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Total Feedback</div>
            </div>
            <div style={statsCardStyle} className="stat-card">
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#22c55e", marginBottom: "8px" }}>{stats.positif}</div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Feedback Positif</div>
            </div>
            <div style={statsCardStyle} className="stat-card">
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6", marginBottom: "8px" }}>{stats.saran}</div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Saran</div>
            </div>
            <div style={statsCardStyle} className="stat-card">
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ef4444", marginBottom: "8px" }}>{stats.keluhan}</div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Keluhan</div>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div style={alertStyle("error")}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={alertStyle("success")}>
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Card */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
              <Send size={28} style={{ color: "#667eea" }} />
              Kirim Feedback
            </h2>
            <button
              onClick={() => setShowStats(!showStats)}
              style={{
                padding: "8px 12px",
                backgroundColor: showStats ? "#667eea" : "transparent",
                color: showStats ? "white" : "#667eea",
                border: "2px solid #667eea",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              <BarChart size={16} />
              {showStats ? "Sembunyikan" : "Tampilkan"} Stats
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", marginRight: "30px" }}>
              <div>
                <label style={labelStyle}>Nama Pengirim</label>
                <input name="sender" value={form.sender} placeholder="Masukkan nama Anda" onChange={handleChange} required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Tim Tujuan</label>
                <input name="recipient_team" value={form.recipient_team} placeholder="Untuk tim..." onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginRight: "30px" }}>
              <label style={labelStyle}>Pesan Feedback</label>
              <textarea
                name="content"
                value={form.content}
                placeholder="Tulis feedback Anda di sini..."
                onChange={handleChange}
                required
                rows="4"
                style={{
                  ...inputStyle,
                  resize: "none",
                  minHeight: "120px",
                  width: "100%",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", alignItems: "end" }}>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                  <option value="positif">✅ Feedback Positif</option>
                  <option value="saran">💡 Saran Perbaikan</option>
                  <option value="keluhan">⚠ Keluhan</option>
                </select>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "14px 0" }}>
                  <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#667eea" }} />
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>🕶 Kirim secara anonim</span>
                </label>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
              {loading ? (
                <>
                  <Clock size={20} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Mengirim feedback...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Kirim Feedback</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedbacks List */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
              <Users size={28} style={{ color: "#667eea" }} />
              Semua Feedback ({filteredFeedbacks.length})
            </h2>

            <button
              onClick={fetchFeedbacks}
              style={{
                padding: "8px 12px",
                backgroundColor: "transparent",
                color: "#667eea",
                border: "2px solid #667eea",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* Search and Filters */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px", marginBottom: "16px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <Search size={20} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" placeholder="Cari feedback..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: "48px", width: "100%" }} />
              </div>

              <div style={{ marginLeft: "70px" }}>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={inputStyle}>
                  <option value="all">Semua Kategori</option>
                  <option value="positif">✅ Positif</option>
                  <option value="saran">💡 Saran</option>
                  <option value="keluhan">⚠ Keluhan</option>
                </select>
              </div>

              <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} style={inputStyle}>
                <option value="all">Semua Tim</option>
                {getUniqueTeams().map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <MessageSquare size={80} style={{ color: "#d1d5db", margin: "0 auto 24px" }} />
              <p style={{ color: "#6b7280", fontSize: "20px", marginBottom: "8px", fontWeight: "500" }}>
                {searchTerm || filterCategory !== "all" || filterTeam !== "all" ? "Tidak ada feedback yang sesuai filter" : "Belum ada feedback yang masuk"}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "16px" }}>{searchTerm || filterCategory !== "all" || filterTeam !== "all" ? "Coba ubah kriteria pencarian atau filter" : "Jadilah yang pertama memberikan feedback!"}</p>
            </div>
          ) : (
            <>
              <div>
                {paginatedFeedbacks.map((feedback, index) => (
                  <div key={index} style={feedbackItemStyle} className="feedback-item">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: feedback.anonymous ? "#e5e7eb" : "#dbeafe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {feedback.anonymous ? <User size={24} style={{ color: "#6b7280" }} /> : <span style={{ color: "#667eea", fontWeight: "700", fontSize: "18px" }}>{feedback.sender?.charAt(0)?.toUpperCase() || "U"}</span>}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: "700", color: "#1f2937", fontSize: "16px" }}>{feedback.anonymous ? "🕶 Anonim" : feedback.sender}</span>
                          <span style={{ color: "#6b7280", fontSize: "14px" }}>untuk</span>
                          <span style={{ fontWeight: "600", color: "#667eea", fontSize: "15px" }}>{feedback.recipient_team}</span>
                          <div
                            style={{
                              ...getCategoryStyle(feedback.category),
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {getCategoryIcon(feedback.category)}
                            <span style={{ textTransform: "capitalize" }}>{feedback.category}</span>
                          </div>
                        </div>

                        <p
                          style={{
                            color: "#374151",
                            lineHeight: "1.7",
                            marginBottom: "12px",
                            fontSize: "15px",
                            backgroundColor: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {feedback.content}
                        </p>

                        {feedback.created_at && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
                            <Clock size={14} />
                            {new Date(feedback.created_at).toLocaleString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "32px" }}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      border: "2px solid #667eea",
                      borderRadius: "8px",
                      backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                      color: currentPage === 1 ? "#9ca3af" : "#667eea",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Sebelumnya
                  </button>

                  <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>
                    Halaman {currentPage} dari {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 16px",
                      border: "2px solid #667eea",
                      borderRadius: "8px",
                      backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
                      color: currentPage === totalPages ? "#9ca3af" : "#667eea",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
