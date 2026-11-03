import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Reservation({ onLogout }) {
  
  
    const items = [ /**/
    "Projector",
    "Small whiteboard",
    "Whiteboard markers",
    "Speakers",
    "Microphone",
  ];
  const [selectedItems, setSelectedItems] = useState([]);
  
  {/*hard coded muna ang Items_available, mag cchang lang ito na value if na aprove san admin ang request*/}
  const Items_available = 5

    function toggleItem(item) {
    setSelectedItems((selected) =>
      selected.includes(item)
        ? selected.filter((name) => name !== item)
        : [...selected, item]);
    }
  
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />

      <main className="main-content">

        <h2>Reservations</h2>

        <h3>Equipment</h3>

        <ul> {/* hardcoded muna ang mga numbers but lets say 5 ang nasa storage the numbers should go down when (selected) submitted na ang request*/}
          {items.map((item) => (
            <li key={item}>
              <label><input type="checkbox" 
                checked={selectedItems.includes(item)} 
                onChange={() => toggleItem(item)}></input>
              </label>
                {item} ({Items_available})
            </li>))}
        </ul>

        <button>Submit</button> {/*send request then dapat ma approve san Admin*/}

      </main>

    </div>
  );
}

export default Reservation;
