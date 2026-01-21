"use client";

import { useMemo, useState } from "react";
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
import {
  Loader2,
  Search,
  UserCircle,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";

interface User {
  id: string;
  name: string | null;
  mobileNumber: string;
  isVerified: boolean;
  createdAt: string;
  _count: {
    subscriptions: number;
    quizSubmissions: number;
  };
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
  const { data, loading, error, refresh } = useAdminFetch<User[]>("/api/admin/users", {
    selector: (res) => res.users ?? [],
  });

  const users = data ?? [];

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.mobileNumber.includes(searchTerm) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const isDialogDeleting = Boolean(
    userPendingDelete && deletingIds.has(userPendingDelete.id),
  );

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isDialogDeleting) {
      return;
    }
    setDeleteDialogOpen(open);
    if (!open) {
      setUserPendingDelete(null);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setActionMessage(null);
    setUserPendingDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userPendingDelete) return;
    const userId = userPendingDelete.id;

    setDeletingIds((prev) => new Set(prev).add(userId));
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      setActionMessage({
        type: "success",
        message:
          data.firebase?.reason === "firebase_user_not_found"
            ? "User deleted from backend (no matching Firebase account found)."
            : "User deleted from backend and Firebase.",
      });

      await refresh({ silent: true });
      setDeleteDialogOpen(false);
      setUserPendingDelete(null);
    } catch (err: any) {
      setActionMessage({
        type: "error",
        message: err.message || "Failed to delete user",
      });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage all registered users
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        {actionMessage && (
          <div
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
              actionMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>{actionMessage.message}</span>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by mobile number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total Users</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Verified</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {users.filter((u) => u.isVerified).length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Unverified</p>
            <p className="mt-2 text-2xl font-semibold text-orange-600">
              {users.filter((u) => !u.isVerified).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserCircle className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Mobile
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Subscriptions
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Quiz Submissions
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Joined
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isDeleting = deletingIds.has(user.id);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="py-4 text-sm text-slate-900">
                        {user.name || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-4 text-sm text-slate-900">{user.mobileNumber}</td>
                      <td className="py-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                            <XCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-slate-600">{user._count.subscriptions}</td>
                      <td className="py-4 text-sm text-slate-600">{user._count.quizSubmissions}</td>
                      <td className="py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(user)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 inline-flex items-center gap-1"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              {userPendingDelete
                ? `This will remove ${userPendingDelete.mobileNumber} from Lean Health, including Firebase login access. This action cannot be undone.`
                : "This will permanently remove the selected user."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDialogDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDialogDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDialogDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete user"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
