import { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageCapture = (imageData) => { setImage(imageData); setResults(null); setError(null); };
  const handleReset = () => { setImage(null); setResults(null); setError(null); };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('image', image.file);
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <span className="header-icon">🔍</span>
          <div>
            <h1>Ingredient Scanner</h1>
            <p>Detect alcohol &amp; pork in any product</p>
          </div>
        </div>
      </header>
      <main className="main">
        {!results ? (
          <>
            <CameraCapture onImageCapture={handleImageCapture} image={image} />
            {error && <div className="error-banner"><span>⚠️</span><span>{error}</span></div>}
            {image && !loading && (
              <button className="btn btn-primary btn-scan" onClick={handleAnalyze}>
                <span className="btn-icon">🔬</span>Scan Ingredients
              </button>
            )}
            {loading && <LoadingSpinner />}
          </>
        ) : (
          <>
            <ResultsDisplay results={results} imageUrl={image?.preview} />
            <button className="btn btn-secondary" onClick={handleReset}>
              <span className="btn-icon">📷</span>Scan Another Product
            </button>
          </>
        )}
      </main>
      <footer className="footer">
        <p>AI-powered analysis. Always verify with official product labeling.</p>
      </footer>
    </div>
  );
}
export default App;
