const YearSelector = ({ onSelect }) => {
  const yearSuffix = (y) => {
    if (y === 1) return '1st';
    if (y === 2) return '2nd';
    if (y === 3) return '3rd';
    return `${y}th`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Select Your Year Level</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
        {[1, 2, 3, 4].map((y) => (
          <button key={y} onClick={() => onSelect(y)}>
            {yearSuffix(y)} Year
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
