import { useState, useEffect } from "react";

// Fetch cold storages data from backend API
const fetchColdStorages = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/coldstorages');
    
    // Check if the response is not okay (i.e., 404, 500, etc.)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cold storages:", error);
    return [];
  }
};

const ColdStorageFinder = () => {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch cold storages data when the component mounts
    const loadColdStorages = async () => {
      const storages = await fetchColdStorages();
      setResults(storages);
    };
    loadColdStorages();
  }, []);

  const handleSearch = () => {
    // If no location, return early
    if (!location) {
      setResults([]);
      return;
    }

    const filtered = results.filter((storage) =>
      storage.location.toLowerCase().includes(location.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Cold Storage Finder</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter location (e.g., Nashik)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500">No available cold storage found at this location.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((storage) => (
            <li key={storage.id} className="border p-4 rounded shadow">
              <p><strong>Location:</strong> {storage.location}</p>
              <p><strong>Available Space:</strong> {storage.available} units</p>
              <p><strong>Contact:</strong> {storage.contact}</p>
              <button
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => alert(`Connected with ${storage.contact}`)}
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColdStorageFinder;
