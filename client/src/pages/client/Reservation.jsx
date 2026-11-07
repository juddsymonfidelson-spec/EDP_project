import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

function Reservation({ onLogout }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  // 1. Fetch live equipment inventory catalog from your backend server
  useEffect(() => {
    setLoading(true);
    setErrorMessage("");
    
    fetch('http://localhost:5000/api/users/items')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Database payload received safely:", data);
        const itemsArray = Array.isArray(data) ? data : [];
        const activeItems = itemsArray.filter(item => item.is_available === 1);
        setItems(activeItems);

        const defaultQuantities = {};
        activeItems.forEach(item => {
          defaultQuantities[item.id] = 1;
        });
        setQuantities(defaultQuantities);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Network fetch breakdown:", err);
        setErrorMessage(`Could not load inventory: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // 2. Toggle checkbox tracking based on unique database item IDs
  function toggleItem(itemId) {
    setSelectedItems((selected) =>
      selected.includes(itemId)
        ? selected.filter((id) => id !== itemId)
        : [...selected, itemId]
    );
  }

  // 3. Handle live manual quantity value corrections per box
  function handleQuantityChange(itemId, inputVal, maxStock) {
    const numericVal = parseInt(inputVal) || 1;
    const clampedVal = Math.max(1, Math.min(numericVal, maxStock));
    
    setQuantities(prev => ({
      ...prev,
      [itemId]: clampedVal
    }));
  }

  // 4. Submit booking request package to server API endpoints
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Please check at least one piece of equipment before submitting!");
      return;
    }

    const savedUserSession = localStorage.getItem("user");
    const loggedInUser = savedUserSession ? JSON.parse(savedUserSession) : null;

    if (!loggedInUser || !loggedInUser.id) {
      alert("Session Error: Please log out and sign back in to establish your authenticated user session context.");
      return;
    }

    setSubmitMessage("");

    try {
      const requests = selectedItems.map(itemId => 
        fetch('http://localhost:5000/api/users/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: loggedInUser.id, 
            item_id: itemId,
            quantity: quantities[itemId] || 1, 
            start_date: "2026-11-06",
            end_date: "2026-11-07"
          })
        })
      );

      await Promise.all(requests);
      setSubmitMessage('Booking request packet sent successfully to the Admin Dashboard!');
      setSelectedItems([]); 
    } catch (error) {
      setSubmitMessage('Failed to route reservation packets down to server.');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />

      <main className="main-content">
        <h2>Reservations</h2>
        <h3>Equipment Catalog Inventory</h3>

        {/* LOADING SCREEN LOGIC INDICATOR */}
        {loading && (
          <p className="loading-text">
            Connecting to backend system database pool...
          </p>
        )}

        {/* CONNECTION TRACE ERROR SCREEN BLOCK */}
        {errorMessage && (
          <div className="error-container">
            Connection Blocked: {errorMessage}
            <br />
            <span>
              Verify your server console is open and running at http://localhost:5000
            </span>
          </div>
        )}

        {/* SUCCESS/FAILURE POPUP FOR ACTIONS */}
        {submitMessage && (
          <p className="status-message">
            {submitMessage}
          </p>
        )}

        {/* DYNAMIC CHECKBOX GRID INVENTORY BLOCK */}
        {!loading && !errorMessage && items.length === 0 && (
          <p className="empty-text">No active items found inside the 'items' database table.</p>
        )}

        {!loading && items.length > 0 && (
          <ul className="item-list"> 
            {items.map((item) => {
              const isItemChecked = selectedItems.includes(item.id);
              return (
                <li key={item.id} className="item-card">
                  <label className="item-label">
                    <input 
                      type="checkbox" 
                      checked={isItemChecked} 
                      onChange={() => toggleItem(item.id)}
                    />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span> 
                      <br />
                      <span className="item-meta">
                        Category: {item.category} | Stock: <b>{item.stock}</b> available
                      </span>
                    </div>
                  </label>

                  {/* CONDITIONAL SELECTOR ROW INPUT FIELD: ONLY SHOWS IF CHECKED */}
                  {isItemChecked && (
                    <div className="quantity-counter-wrapper">
                      <label>
                        Quantity needed: 
                        <input 
                          type="number" 
                          min="1"
                          max={item.stock}
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value, item.stock)}
                        />
                      </label>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <button 
          onClick={handleSubmit} 
          className="submit-btn" 
          disabled={loading || items.length === 0}
        >
          Submit Reservation Request
        </button> 
      </main>
    </div>
  );
}

export default Reservation;
