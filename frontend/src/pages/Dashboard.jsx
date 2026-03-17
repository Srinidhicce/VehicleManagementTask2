import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000";

function Dashboard({ token, onLogout }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState(null);

  const [editDriver, setEditDriver] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/drivers/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      showMessage("Failed to load drivers");
    }
    setLoading(false);
  }

  async function handleAddDriver() {
    if (!driverId || !driverName || !phoneNumber) {
      showMessage("Please fill Driver ID, Name, and Phone Number");
      return;
    }

    const formData = new FormData();
    formData.append("driverId", driverId);
    formData.append("driverName", driverName);
    formData.append("phoneNumber", phoneNumber);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/drivers/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data._id) {
        showMessage("Driver added successfully!");
        setShowAddForm(false);
        clearAddForm();
        fetchDrivers();
      } else {
        showMessage("Failed to add driver");
      }
    } catch (error) {
      showMessage("Something went wrong");
    }
  }

  async function handleUpdateDriver() {
    if (!editName || !editPhone) {
      showMessage("Name and phone cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/drivers/update/${editDriver._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ driverName: editName, phoneNumber: editPhone }),
      });

      const data = await response.json();

      if (data._id) {
        showMessage("Driver updated!");
        setEditDriver(null);
        fetchDrivers();
      }
    } catch (error) {
      showMessage("Update failed");
    }
  }

  async function handleDeleteDriver(id) {
    const confirmed = window.confirm("Delete Driver");
    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/api/drivers/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      showMessage(data.message || "Driver deleted");
      fetchDrivers();
    } catch (error) {
      showMessage("Delete failed");
    }
  }

  function openEditModal(driver) {
    setEditDriver(driver);
    setEditName(driver.driverName);
    setEditPhone(driver.phoneNumber);
  }

  function clearAddForm() {
    setDriverId("");
    setDriverName("");
    setPhoneNumber("");
    setPhoto(null);
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
  
          <span style={styles.navTitle}>Driver Management</span>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>


      <div style={styles.content}>
        {message && (
          <div style={styles.toast}>{message}</div>
        )}

        <div style={styles.headerRow}>
          <h2 style={styles.pageTitle}>All Drivers</h2>
          <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "+ Add Driver"}
          </button>
        </div>

        
        {showAddForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Driver</h3>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Driver ID</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="D001"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Driver Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Contact Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Photo</label>
                <input
                  style={styles.input}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
            </div>
            <button style={styles.submitBtn} onClick={handleAddDriver}>
              Add Driver
            </button>
          </div>
        )}

     
        {loading ? (
          <p style={styles.loadingText}>Loading drivers...</p>
        ) : drivers.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>Add Drivers</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Photo</th>
                  <th style={styles.th}>Driver ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      {driver.photo ? (
                        <img
                          src={`${BASE_URL}/uploads/driverPhotos/${driver.photo}`}
                          alt="driver"
                          style={styles.driverPhoto}
                        />
                      ) : (
                        <div style={styles.photoPlaceholder}>
                          {driver.driverName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>{driver.driverId}</td>
                    <td style={styles.td}>{driver.driverName}</td>
                    <td style={styles.td}>{driver.phoneNumber}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.editBtn}
                        onClick={() => openEditModal(driver)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteDriver(driver._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

   
      {editDriver && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Edit Driver</h3>
            <div style={styles.field}>
              <label style={styles.label}>Driver Name</label>
              <input
                style={styles.input}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input
                style={styles.input}
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.submitBtn} onClick={handleUpdateDriver}>
                Save Changes
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditDriver(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  navbar: {
    backgroundColor: "#2563eb",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navTitle: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: "6px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px 16px",
  },
  toast: {
    backgroundColor: "#d1fae5",
    border: "1px solid #6ee7b7",
    borderRadius: "6px",
    padding: "10px 16px",
    marginBottom: "16px",
    color: "#065f46",
    fontSize: "14px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#1a1a1a",
  },
  addBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: "14px",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  formTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    color: "#333",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  field: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    color: "#444",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "8px",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    padding: "40px",
  },
  emptyBox: {
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "60px",
    color: "#666",
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    backgroundColor: "#f8fafc",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#666",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#333",
    verticalAlign: "middle",
  },
  driverPhoto: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  photoPlaceholder: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
  },
  editBtn: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fcd34d",
    borderRadius: "4px",
    padding: "4px 12px",
    cursor: "pointer",
    fontSize: "13px",
    marginRight: "8px",
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fca5a5",
    borderRadius: "4px",
    padding: "4px 12px",
    cursor: "pointer",
    fontSize: "13px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    color: "#1a1a1a",
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Dashboard;
