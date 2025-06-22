import React, { useState } from 'react';
import YearSelector from './YearSelector';
import SemesterTable from './SemesterTable';
import CheckButton from './CheckButton';
import ResultCard from './ResultCard';
import '../App.css';

const yearMap = {
  1: [{ year: 1, sem: '1st' }, { year: 1, sem: '2nd' }],
  2: [{ year: 1, sem: '1st' }, { year: 1, sem: '2nd' }, { year: 2, sem: '1st' }, { year: 2, sem: '2nd' }],
  3: [{ year: 1, sem: '1st' }, { year: 1, sem: '2nd' }, { year: 2, sem: '1st' }, { year: 2, sem: '2nd' }, { year: 3, sem: '1st' }, { year: 3, sem: '2nd' }],
  4: [{ year: 1, sem: '1st' }, { year: 1, sem: '2nd' }, { year: 2, sem: '1st' }, { year: 2, sem: '2nd' }, { year: 3, sem: '1st' }, { year: 3, sem: '2nd' }, { year: 4, sem: '1st' }, { year: 4, sem: '2nd' }]
};

const getOrdinalYearLabel = (year) => {
  if (year === 1) return '1st Year';
  if (year === 2) return '2nd Year';
  if (year === 3) return '3rd Year';
  return `${year}th Year`;
};

const LauUdMefy = () => {
  const [year, setYear] = useState(null);
  const [semData, setSemData] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => setShowResult(true);
  const handleUpdate = (key, data) => setSemData((prev) => ({ ...prev, [key]: data }));

  const semList = year ? yearMap[year] : [];

  const groupedByYear = semList.reduce((acc, { year, sem }) => {
    const key = getOrdinalYearLabel(year);
    if (!acc[key]) acc[key] = [];
    acc[key].push({ year, sem });
    return acc;
  }, {});

  return (
    <>
      {!year ? (
        <div className="year-selector-box">
          <YearSelector onSelect={setYear} />
        </div>
      ) : (
        <div className="container">
          <p className='selected-year'>🎓 Selected Year Level: <strong>{getOrdinalYearLabel(year)}</strong></p>

          <div className="instructions">
            <p>📚 Enter your grades and units for each semester. Click "Check" to see your GWA and honor standing.</p>
            <p>🔍 You can add or remove semesters as needed.</p>
            <p>📊 The tool will calculate your GWA and provide insights on your academic standing.</p>
            <h5><strong>Reminder:</strong> Don't include PE and NSTP subjects in the input and computation.</h5>
          </div>

          {Object.entries(groupedByYear).map(([yearLabel, sems]) => (
            <div key={yearLabel}>
              <h3>{yearLabel}</h3>
              <div className="semester-grid">
                {sems.map(({ year, sem }) => {
                  const key = `${year}-${sem}`;
                  return (
                    <div className="semester-table" key={key}>
                      <SemesterTable
                        title={`${sem} Semester`}
                        onUpdate={(data) => handleUpdate(key, data)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <CheckButton onClick={handleCheck} />
          <ResultCard
            isOpen={showResult}
            onClose={() => setShowResult(false)}
            allSemData={semData}
          />
        </div>
      )}
    </>
  );
};

export default LauUdMefy;
