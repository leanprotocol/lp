"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface InsuranceProvider {
  id: string;
  name: string;
  coveragePercentage: number;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    quizSubmissions: number;
  };
}

export default function InsuranceProvidersPage() {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<InsuranceProvider | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    coveragePercentage: 0,
    description: "",
    isActive: true,
    displayOrder: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/insurance-providers');
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to fetch insurance providers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (provider?: InsuranceProvider) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name,
        coveragePercentage: provider.coveragePercentage,
        description: provider.description || "",
        isActive: provider.isActive,
        displayOrder: provider.displayOrder,
      });
    } else {
      setEditingProvider(null);
      setFormData({
        name: "",
        coveragePercentage: 0,
        description: "",
        isActive: true,
        displayOrder: providers.length,
      });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProvider(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = editingProvider
        ? `/api/admin/insurance-providers/${editingProvider.id}`
        : '/api/admin/insurance-providers';
      
      const method = editingProvider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingProvider ? 'Provider updated successfully' : 'Provider created successfully');
        fetchProviders();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setError(data.error || 'Failed to save provider');
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      setError('An error occurred while saving');
    }
  };

  const handleDelete = async (provider: InsuranceProvider) => {
    if (!confirm(`Are you sure you want to delete "${provider.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/insurance-providers/${provider.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Provider deleted successfully');
        fetchProviders();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || 'Failed to delete provider');
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      setError('An error occurred while deleting');
      setTimeout(() => setError(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Providers</h1>
            <p className="text-gray-600 mt-2">Manage insurance providers and their coverage details</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#1F302B] hover:bg-[#2C3E3A] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Providers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No insurance providers found. Click "Add Provider" to create one.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{provider.coveragePercentage}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {provider.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        provider.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.displayOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider._count?.quizSubmissions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(provider)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(provider)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!!(provider._count?.quizSubmissions && provider._count.quizSubmissions > 0)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProvider ? 'Edit Provider' : 'Add New Provider'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full"
                      placeholder="e.g., Blue Cross Blue Shield"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coverage Percentage *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.coveragePercentage}
                      onChange={(e) => setFormData({ ...formData, coveragePercentage: parseFloat(e.target.value) || 0 })}
                      required
                      className="w-full"
                      placeholder="e.g., 80"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the percentage of treatment cost covered (0-100)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full"
                      placeholder="Optional details about the provider or coverage"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full"
                      placeholder="e.g., 0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the dropdown</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-[#1F302B] focus:ring-[#1F302B] border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active (Show in dropdown)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={handleCloseModal}
                      variant="outline"
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#1F302B] hover:bg-[#2C3E3A] text-white px-6"
                    >
                      {editingProvider ? 'Update' : 'Create'} Provider
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
