import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExploreNextProps {
  nextPath: string;
  nextLabel: string;
  saved: boolean;
  saving: boolean;
  onSave: () => Promise<boolean>;
  buttonLabel?: string;
}

export default function ExploreNext({ nextPath, nextLabel, saved, saving, onSave, buttonLabel }: ExploreNextProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const goNext = () => {
    if (saved) {
      navigate(nextPath);
    } else {
      setOpen(true);
    }
  };

  const handleSave = async () => {
    setOpen(false);
    const ok = await onSave();
    if (ok) navigate(nextPath);
  };

  const handleSkip = () => {
    setOpen(false);
    navigate(nextPath);
  };

  return (
    <>
      <button
        onClick={goNext}
        className="mystic-btn-gold text-sm justify-center cursor-pointer whitespace-nowrap"
      >
        <i className="ri-arrow-right-line" />
        {buttonLabel || `Tiếp theo · ${nextLabel}`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 modal-backdrop">
          <div className="mystic-card rounded-2xl w-full max-w-md p-6 md:p-8 text-center modal-pop border-mystic-gold-500/30">
            <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">
              Lưu Kết Quả
            </h3>
            <p className="mystic-text text-sm opacity-80 mb-6">
              Bạn có muốn lưu kết quả vào hồ sơ của mình không?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="mystic-btn-primary text-sm justify-center flex-1 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" /> Đang Lưu...
                  </>
                ) : (
                  <>Lưu</>
                )}
              </button>
              <button
                onClick={handleSkip}
                className="mystic-btn-outline text-sm justify-center flex-1 whitespace-nowrap"
              >
                <i className="ri-close-line" /> Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}