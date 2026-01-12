import { useEffect, useRef, useState } from "react";
import axios from "axios";

const FileUpload = ({
  uploadDir = "file",
  value,
  onChange,
  maxSizeMB = 20,
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [originFileName, setOriginFileName] = useState(null);
  const [uploadedPath, setUploadedPath] = useState(value || null);

  useEffect(() => {
    if (value) {
      setUploadedPath(value);
      setOriginFileName(value.split("/").pop());
    }
  }, [value]);

  const onSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`파일은 ${maxSizeMB}MB 이하만 업로드 가능합니다.`);
      return;
    }

    setFile(selectedFile);
    setOriginFileName(selectedFile.name);
    onChange?.(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setOriginFileName(null);
    setUploadedPath(null);
    onChange?.(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileInputRef} type="file" hidden onChange={onSelectFile} />

      {/* 파일 선택 영역 */}
      <div
        className="flex items-center justify-between px-3 py-2 border border-background-light rounded cursor-pointer bg-slate-50 hover:bg-slate-100"
        onClick={() => fileInputRef.current.click()}
      >
        {originFileName ? (
          <span className="text-sm text-slate-700 truncate">
            {originFileName}
          </span>
        ) : (
          <span className="text-sm text-slate-400">파일 선택</span>
        )}

        {originFileName && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="text-slate-400 hover:text-red-500 ml-2"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
