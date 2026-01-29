// 3. Delete Confirmation Modal (NEW)
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100">
                <h3 className="text-xl font-bold text-gray-100 mb-2">Delete Transaction?</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Are you sure you want to remove this transaction? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/50 font-bold hover:bg-red-500 hover:text-white transition-all text-sm shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};