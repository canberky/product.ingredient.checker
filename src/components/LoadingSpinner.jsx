function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-text">Analyzing ingredients...</p>
      <p className="loading-subtext">This may take a few seconds</p>
    </div>
  );
}
export default LoadingSpinner;
