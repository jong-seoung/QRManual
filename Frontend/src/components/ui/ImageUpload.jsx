import { useEffect, useRef, useState } from "react";

const ImageUpload = ({ value, onChange, maxSizeMB = 5, width, height }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const onSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`이미지는 ${maxSizeMB}MB 이하만 업로드 가능합니다.`);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);

    onChange?.(selectedFile);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onSelectFile}
      />

      <div
        style={{ width, height }}
        className="border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
        onClick={() => fileInputRef.current.click()}
      >
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">이미지</span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
