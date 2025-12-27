/**
 * ShowtimesManagementPage
 * Admin page for managing movie showtimes
 */

import { useState } from "react";
import { Plus, Search, Trash2, Loader2, AlertCircle } from "lucide-react";
import { showtimeApi, type Showtime } from "../../api/endpoints/showtime.api";
import {
  ShowtimeTable,
  ShowtimeFormModal,
  ShowtimeDeleteModal,
  useShowtimeData,
} from "../../features/management/showtime";

export default function ShowtimesManagementPage() {
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
    selectedDate,
    setSelectedDate,
    loading,
    error,
    refetch,
    fetchRoomsByTheaterId,
  } = useShowtimeData();

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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
    refetch();
  };

  // Handle delete single
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await showtimeApi.deleteShowtime(deleteConfirmId);
      setDeleteConfirmId(null);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
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
      refetch();
    } catch (err) {
      console.error("Bulk delete failed:", err);
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
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              disabled
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
            />
          </div>
          <select
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Tất cả phim</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
          <select
            value={selectedTheaterId}
            onChange={(e) => setSelectedTheaterId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Tất cả rạp</option>
            {theaters.map((theater) => (
              <option key={theater._id} value={theater._id}>
                {theater.theaterName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

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
