import React, { useState } from 'react';

interface FormData {
  name: string;
  type: string;
  description: string;
}

const AppGenerationOrderForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', type: 'web', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with app generation service
    console.log('Generating app:', formData);
    // Reset form
    setFormData({ name: '', type: 'web', description: '' });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">App Generation Order Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">App Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter app name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">App Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="web">Web Application</option>
            <option value="mobile">Mobile App</option>
            <option value="desktop">Desktop App</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your app requirements"
            className="w-full p-2 border rounded h-24"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Generate App
        </button>
      </form>
    </div>
  );
};

export default AppGenerationOrderForm;