function StatusCard({ label, emoji, detected, items }) {
  const status = detected ? 'detected' : 'clear';
  return (
    <div className={`status-card status-card--${status}`}>
      <div className="status-card-header">
        <span className="status-emoji">{emoji}</span>
        <div className="status-info">
          <span className="status-label">{label}</span>
          <span className={`status-badge status-badge--${status}`}>{detected ? 'Found' : 'Not Found'}</span>
        </div>
        <span className="status-check">{detected ? '✗' : '✓'}</span>
      </div>
      {detected && items.length > 0 && (
        <ul className="status-items">
          {items.map((item, i) => <li key={i} className="status-item">{item}</li>)}
        </ul>
      )}
    </div>
  );
}

function ResultsDisplay({ results, imageUrl }) {
  const { ingredients_found, ingredients_list, has_alcohol, alcohol_ingredients, has_pork, pork_ingredients, notes } = results;
  const isSafe = !has_alcohol && !has_pork;
  return (
    <div className="results-container">
      {imageUrl && <img src={imageUrl} alt="Scanned product" className="results-thumbnail" />}
      <div className={`overall-banner overall-banner--${isSafe ? 'safe' : 'warning'}`}>
        <span className="overall-icon">{isSafe ? '✅' : '⚠️'}</span>
        <span>{isSafe ? (ingredients_found ? 'No alcohol or pork detected' : 'Could not read ingredients') : 'Restricted ingredients detected'}</span>
      </div>
      {!ingredients_found && notes && <div className="notes-card"><p>{notes}</p></div>}
      {ingredients_found && (
        <>
          <div className="status-cards">
            <StatusCard label="Alcohol" emoji="🍷" detected={has_alcohol} items={alcohol_ingredients} />
            <StatusCard label="Pork" emoji="🥩" detected={has_pork} items={pork_ingredients} />
          </div>
          {ingredients_list?.length > 0 && (
            <div className="ingredients-section">
              <h3 className="ingredients-title">Ingredients Found ({ingredients_list.length})</h3>
              <div className="ingredients-list">
                {ingredients_list.map((ingredient, i) => {
                  const flagged = alcohol_ingredients?.some(a => a.toLowerCase() === ingredient.toLowerCase()) ||
                                  pork_ingredients?.some(p => p.toLowerCase() === ingredient.toLowerCase());
                  return <span key={i} className={`ingredient-tag ${flagged ? 'ingredient-tag--flagged' : ''}`}>{ingredient}</span>;
                })}
              </div>
            </div>
          )}
          {notes && <div className="notes-card"><strong>Note:</strong> {notes}</div>}
        </>
      )}
    </div>
  );
}
export default ResultsDisplay;
