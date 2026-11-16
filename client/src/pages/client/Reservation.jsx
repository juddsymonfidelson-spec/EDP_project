import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import API, { ClientAPI } from "../../services/api";
import "../../App.css";

function Reservation({ onLogout }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    API.get('/items')
      .then((res) => {
        const activeItems = res.data.filter(item => item.is_available === 1);
        setItems(activeItems);
        const defaults = {};
        activeItems.forEach(item => { defaults[item.id] = 1; });
        setQuantities(defaults);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`Could not load inventory: ${err.message}`);
        setLoading(false);
      });
  }, []);

  function toggleItem(itemId) {
    setSelectedItems((selected) =>
      selected.includes(itemId) ? selected.filter((id) => id !== itemId) : [...selected, itemId]
    );
  }

  function handleQuantityChange(itemId, inputVal, maxStock) {
    const numericVal = parseInt(inputVal) || 1;
    const clampedVal = Math.max(1, Math.min(numericVal, maxStock));
    setQuantities(prev => ({ ...prev, [itemId]: clampedVal }));
  }

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Please check at least one piece of equipment before submitting!");
      return;
    }
    if (!reservationDate || !startTime || !endTime) {
      alert("Please select a date, start time, and end time.");
      return;
    }
    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser || !savedUser.id) {
      alert("Session expired. Please log in again.");
      return;
    }

    setSubmitMessage("");
    try {
      const requests = selectedItems.map(itemId =>
        ClientAPI.post('/reservations', {
          user_id: savedUser.id,
          item_id: itemId,
          quantity: quantities[itemId] || 1,
          reservation_date: reservationDate,
          start_time: startTime,
          end_time: endTime
        })
      );

      await Promise.all(requests);
      setSubmitMessage('✅ Request sent successfully! Waiting for Admin approval.');
      setSelectedItems([]);
      setReservationDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      setSubmitMessage(`❌ Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">
        <h2>Make a Reservation</h2>
        <h3>Equipment Catalog</h3>

        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Select Date & Time:</h4>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>
        </div>

        {loading && <p>Loading items...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {submitMessage && <p style={{ color: submitMessage.includes('✅') ? 'green' : 'red' }}>{submitMessage}</p>}

        {!loading && items.length > 0 && (
          <ul className="item-list">
            {items.map((item) => {
              const isChecked = selectedItems.includes(item.id);
              return (
                <li key={item.id} className="item-card">
                  <label className="item-label">
                    <input type="checkbox" checked={isChecked} onChange={() => toggleItem(item.id)} />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <br />
                      <span className="item-meta">Category: {item.category} | Stock: <b>{item.stock}</b></span>
                    </div>
                  </label>
                  {isChecked && (
                    <div className="quantity-counter-wrapper">
                      <label>
                        Quantity:
                        <input type="number" min="1" max={item.stock}
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value, item.stock)} />
                      </label>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <button onClick={handleSubmit} className="submit-btn" disabled={loading || items.length === 0}>
          Submit Reservation Request
        </button>
      </main>
    </div>
  );
}

export default Reservation;