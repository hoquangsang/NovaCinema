/**
 * ShowtimesManagementPage
 * Admin page for managing movie showtimes
 */

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Copy, Search } from "lucide-react";
import { showtimeApi, type Showtime } from "../../api/endpoints/showtime.api";
import {
  ShowtimeTable,
  ShowtimeFormModal,
  BulkShowtimeFormModal,
  ShowtimeDeleteModal,
  useShowtimeData,
} from "../../features/management/showtime";
import { SearchableMovieSelect } from "../../components/common/SearchableMovieSelect";
import { SearchableTheaterSelect } from "../../components/common/SearchableTheaterSelect";
import { useToast } from "../../components/common/ToastProvider";

export default function ShowtimesManagementPage() {
  const toast = useToast();

  // Use custom hook for data management
  const {
    showtimes,
    movies,
    theaters,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    selectedMovieId,
    setSelectedMovieId,
    selectedTheaterId,
    setSelectedTheaterId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    loading,
    error,
    refetch,
    search,
    fetchRoomsByTheaterId,
  } = useShowtimeData();

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.push(error, "error", 5000);
    }
  }, [error, toast]);

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Selected items for bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Handle create
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingShowtime(null);
    setIsFormModalOpen(true);
  };

  // Handle edit
  const handleOpenEditModal = (showtime: Showtime) => {
    setModalMode("edit");
    setEditingShowtime(showtime);
    setIsFormModalOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    toast.push("Thành công!", "success");
    refetch();
  };

  // Handle delete single
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await showtimeApi.deleteShowtime(deleteConfirmId);
      setDeleteConfirmId(null);
      toast.push("Xóa suất chiếu thành công", "success");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      toast.push(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      await showtimeApi.deleteShowtimes(selectedIds);
      setSelectedIds([]);
      toast.push(`Xóa ${selectedIds.length} suất chiếu thành công`, "success");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      toast.push(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  // Toggle select item
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === showtimes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(showtimes.map((s) => s._id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Suất chiếu</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch chiếu phim và suất chiếu</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              <Trash2 size={20} />
              Xóa ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Copy size={20} />
            Tạo hàng loạt
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            Thêm suất chiếu
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phim</label>
            <SearchableMovieSelect
              movies={movies}
              value={selectedMovieId}
              onChange={setSelectedMovieId}
              placeholder="Tất cả phim"
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rạp</label>
            <SearchableTheaterSelect
              theaters={theaters}
              value={selectedTheaterId}
              onChange={setSelectedTheaterId}
              placeholder="Tất cả rạp"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            onClick={search}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#10142C] font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            <Search size={18} />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-yellow-500" size={48} />
        </div>
      ) : (
        <ShowtimeTable
          showtimes={showtimes}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelectItem}
          onToggleSelectAll={toggleSelectAll}
          onEdit={handleOpenEditModal}
          onDelete={setDeleteConfirmId}
          page={page}
          onPageChange={setPage}
          onLimitChange={setLimit}
          limit={limit}
          total={total}
          totalPages={totalPages}
        />
      )}

      {/* Form Modal */}
      <ShowtimeFormModal
        isOpen={isFormModalOpen}
        mode={modalMode}
        showtime={editingShowtime}
        movies={movies}
        theaters={theaters}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        fetchRoomsByTheaterId={fetchRoomsByTheaterId}
      />

      {/* Bulk Form Modal */}
      <BulkShowtimeFormModal
        isOpen={isBulkModalOpen}
        movies={movies}
        theaters={theaters}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={handleFormSuccess}
        fetchRoomsByTheaterId={fetchRoomsByTheaterId}
      />

      {/* Delete Confirmation Modal */}
      <ShowtimeDeleteModal
        isOpen={!!deleteConfirmId}
        isDeleting={deleting}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
