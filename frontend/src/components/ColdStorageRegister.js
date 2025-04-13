import { useState } from 'react';
import axios from 'axios';

const ColdStorageRegister = () => {
  const [form, setForm] = useState({
    location: '',
    capacity: '',
    available: '',
    contact: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/cold-storages', form);
      alert("Storage registered successfully!");
      setForm({ location: '', capacity: '', available: '', contact: '' });
    } catch (error) {
      alert("Error registering storage");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Register Cold Storage</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 w-full" />
        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" className="border p-2 w-full" />
        <input type="number" name="available" value={form.available} onChange={handleChange} placeholder="Available" className="border p-2 w-full" />
        <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default ColdStorageRegister;
