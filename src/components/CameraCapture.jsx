import { useRef } from 'react';

function CameraCapture({ onImageCapture, image }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onImageCapture({ file, preview: URL.createObjectURL(file) });
    e.target.value = '';
  };

  if (image) return (
    <div className="image-preview-container">
      <img src={image.preview} alt="Product to scan" className="image-preview" />
      <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>Change Photo</button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden-input" />
    </div>
  );

  return (
    <div className="capture-container">
      <div className="capture-card">
        <div className="capture-icon">📷</div>
        <h2 className="capture-title">Scan a Product</h2>
        <p className="capture-subtitle">Take a clear photo of the ingredients label or upload an existing image</p>
        <div className="capture-buttons">
          <button className="btn btn-primary" onClick={() => cameraInputRef.current?.click()}>
            <span className="btn-icon">📸</span>Take Photo
          </button>
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
            <span className="btn-icon">🖼️</span>Upload Image
          </button>
        </div>
        <p className="capture-tip">Tip: Make sure the ingredients list is in focus and well-lit</p>
      </div>
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden-input" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden-input" />
    </div>
  );
}
export default CameraCapture;
