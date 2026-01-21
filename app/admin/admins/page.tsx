"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const baseFormState = {
  email: "",
  name: "",
  password: "",
  isActive: true,
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({ ...baseFormState });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCurrentAdmin();
    fetchAdmins();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.admin) {
          setCurrentAdminId(data.admin.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch current admin:', err);
    }
  };

  const activeCount = useMemo(() => admins.filter(a => a.isActive).length, [admins]);

  const fetchAdmins = async (options?: { background?: boolean }) => {
    const isBackground = options?.background ?? false;
    try {
      if (!isBackground) {
        setLoading(true);
      }
      const res = await fetch('/api/admin/admins');
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load administrators');
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  const openModal = (admin?: AdminUser) => {
    setError(null);
    setSuccess(null);

    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        email: admin.email,
        name: admin.name,
        password: "",
        isActive: admin.isActive,
      });
    } else {
      setEditingAdmin(null);
      setFormData({ ...baseFormState });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({ ...baseFormState });
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (editingAdmin && currentAdminId === editingAdmin.id && formData.isActive === false) {
      setError('You cannot disable your own admin account');
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingAdmin) {
        setUpdatingIds(prev => new Set(prev).add(editingAdmin.id));
      }

      const url = editingAdmin ? `/api/admin/admins/${editingAdmin.id}` : '/api/admin/admins';
      const method = editingAdmin ? 'PUT' : 'POST';
      const payload = editingAdmin
        ? {
            name: formData.name,
            isActive: formData.isActive,
            ...(formData.password ? { password: formData.password } : {}),
          }
        : formData;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save admin');
      }

      setSuccess(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully');
      
      await fetchAdmins({ background: true });
      
      setTimeout(() => {
        closeModal();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
      if (editingAdmin) {
        setUpdatingIds(prev => {
          const next = new Set(prev);
          next.delete(editingAdmin.id);
          return next;
        });
      }
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!window.confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
      return;
    }

    setConfirmDeleteId(admin.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete admin');
      }

      setSuccess('Admin deleted successfully');
      await fetchAdmins();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setTimeout(() => setError(null), 5000);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-1">Add, update, or remove admin accounts</p>
          </div>
          <Button onClick={() => openModal()} className="bg-[#1F302B] hover:bg-[#2C3E3A] text-white">
            <Plus className="w-4 h-4 mr-2" /> New Admin
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Total Admins</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{admins.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Active Admins</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {admins[0] ? new Date(admins[0].updatedAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" /> {success}
          </div>
        )}

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No administrators yet. Use "New Admin" to create one.
                  </td>
                </tr>
              ) : (
                admins.map(admin => {
                  const isUpdating = updatingIds.has(admin.id);
                  const isDeleting = confirmDeleteId === admin.id;
                  const isCurrentAdmin = currentAdminId === admin.id;
                  
                  return (
                    <tr key={admin.id} className={`transition-opacity duration-200 ${
                      isUpdating || isDeleting ? 'opacity-50' : 'opacity-100'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                              {isCurrentAdmin && (
                                <span className="ml-2 text-xs text-emerald-600 font-semibold">(You)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">ID: {admin.id.slice(0, 8)}...</div>
                          </div>
                          {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-40 transition-colors" 
                          onClick={() => openModal(admin)}
                          disabled={isUpdating || isDeleting}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 disabled:opacity-40 transition-colors"
                          onClick={() => handleDelete(admin)}
                          disabled={isDeleting || isUpdating}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Create Admin'}
                </h2>
                <p className="text-gray-500 text-sm">Credentials can be updated anytime</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingAdmin && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {editingAdmin ? 'New Password (optional)' : 'Password *'}
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    required={!editingAdmin}
                    placeholder={editingAdmin ? 'Leave blank to keep current password' : 'Minimum 6 characters'}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => handleInputChange('isActive', e.target.checked)}
                    disabled={!!(editingAdmin && currentAdminId === editingAdmin.id)}
                    className="h-4 w-4 text-[#1F302B] border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active account
                    {editingAdmin && currentAdminId === editingAdmin.id && (
                      <span className="ml-2 text-xs text-gray-500">(You cannot disable yourself)</span>
                    )}
                  </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeModal} className="px-6">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#1F302B] hover:bg-[#2C3E3A] text-white px-6 disabled:opacity-60"
                >
                  {isSaving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : editingAdmin ? (
                    'Save Changes'
                  ) : (
                    'Create Admin'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
