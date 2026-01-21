"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { Loader2, Plus, Edit, Trash2, GripVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
  allowMultiplePurchase: boolean;
  isRefundable: boolean;
  allowAutoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  durationDays: string;
  features: string[];
  isActive: boolean;
  allowMultiplePurchase: boolean;
  isRefundable: boolean;
  allowAutoRenew: boolean;
}

export default function PlansPage() {
  const { data, loading, error, refresh } = useAdminFetch<{ plans: SubscriptionPlan[] }>(
    "/api/admin/plans",
    { immediate: true }
  );

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    price: "",
    durationDays: "",
    features: [""],
    isActive: true,
    allowMultiplePurchase: false,
    isRefundable: false,
    allowAutoRenew: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    if (data?.plans) {
      setPlans([...data.plans].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [data]);

  const handleOpenForm = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || "",
        price: plan.price.toString(),
        durationDays: plan.durationDays.toString(),
        features: plan.features,
        isActive: plan.isActive,
        allowMultiplePurchase: plan.allowMultiplePurchase,
        isRefundable: plan.isRefundable,
        allowAutoRenew: plan.allowAutoRenew,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        durationDays: "",
        features: [""],
        isActive: true,
        allowMultiplePurchase: false,
        isRefundable: false,
        allowAutoRenew: false,
      });
    }
    setFormErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      durationDays: "",
      features: [""],
      isActive: true,
      allowMultiplePurchase: false,
      isRefundable: false,
      allowAutoRenew: false,
    });
    setFormErrors({});
    setFeatureInput("");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Plan name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Plan name must be at least 3 characters";
    }

    const price = parseFloat(formData.price);
    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number";
    }

    const duration = parseInt(formData.durationDays);
    if (!formData.durationDays.trim()) {
      errors.durationDays = "Duration is required";
    } else if (isNaN(duration) || duration <= 0) {
      errors.durationDays = "Duration must be a positive integer";
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      errors.features = "At least one feature is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const validFeatures = formData.features.filter(f => f.trim());
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays),
        features: validFeatures,
        isActive: formData.isActive,
        allowMultiplePurchase: formData.allowMultiplePurchase,
        isRefundable: formData.isRefundable,
        allowAutoRenew: formData.allowAutoRenew,
      };

      const url = editingPlan
        ? `/api/admin/plans/${editingPlan.id}`
        : "/api/admin/plans";
      const method = editingPlan ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save plan");
      }

      await refresh({ silent: true });
      handleCloseForm();
    } catch (err: any) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/plans/${planToDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to deactivate plan");
      }

      await refresh({ silent: true });
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPlans = [...plans];
    const draggedPlan = newPlans[draggedIndex];
    newPlans.splice(draggedIndex, 1);
    newPlans.splice(index, 0, draggedPlan);

    setPlans(newPlans);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setReordering(true);

    try {
      const planIds = plans.map(p => p.id);
      const res = await fetch("/api/admin/plans/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planIds }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to reorder plans");
      }

      await refresh({ silent: true });
    } catch (err: any) {
      alert(err.message);
      if (data?.plans) {
        setPlans([...data.plans].sort((a, b) => a.displayOrder - b.displayOrder));
      }
    } finally {
      setDraggedIndex(null);
      setReordering(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features.filter(f => f.trim()), featureInput.trim(), ""]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const durationInMonths = (days: number) => {
    return Math.round(days / 30);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {reordering && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Saving new order...
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlan ? "Edit Plan" : "Add New Plan"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Basic Plan"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Plan description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, durationDays: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="30"
                  />
                  {formErrors.durationDays && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.durationDays}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features *
                </label>
                <div className="space-y-2">
                  {formData.features.filter(f => f.trim()).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Feature description"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add new feature..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      disabled={!featureInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {formErrors.features && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.features}</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRefundable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRefundable: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Refundable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowAutoRenew}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowAutoRenew: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Auto-Renew</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowMultiplePurchase}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowMultiplePurchase: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Multiple Purchases</span>
                </label>
              </div>

              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formErrors.submit}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingPlan ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingPlan ? "Update Plan" : "Create Plan"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No plans yet. Create your first plan to get started.</p>
          </div>
        ) : (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white border rounded-xl p-6 cursor-move transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              } ${!plan.isActive ? "bg-gray-50 border-gray-300" : "border-gray-200"}`}
            >
              <div className="flex items-start gap-4">
                <GripVertical className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {plan.name}
                        {!plan.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </h3>
                      {plan.description && (
                        <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{plan.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {durationInMonths(plan.durationDays)} {durationInMonths(plan.durationDays) === 1 ? "month" : "months"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {plan.isRefundable && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Refundable
                      </span>
                    )}
                    {plan.allowAutoRenew && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Auto-Renew
                      </span>
                    )}
                    {plan.allowMultiplePurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Multiple Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(plan)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(plan)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {plan.isActive ? "Deactivate" : "Deactivate"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Plan</AlertDialogTitle>
            <AlertDialogDescription>
              {planToDelete
                ? `This will deactivate "${planToDelete.name}" and prevent new users from purchasing it. Existing subscriptions will remain unaffected.`
                : "This will deactivate the selected plan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                "Deactivate Plan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
