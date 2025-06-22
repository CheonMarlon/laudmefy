import React, { useState, useEffect, useRef } from 'react';

const SemesterTable = ({ title, onUpdate }) => {
  const [rows, setRows] = useState([{ grade: '', units: '' }]);
  const [errors, setErrors] = useState([]);

  // Refs for each input field (2D array: row -> [unitsRef, gradeRef])
  const inputRefs = useRef([]);

  useEffect(() => {
    const validRows = rows
      .filter((r) => isValidGrade(r.grade) && isValidUnits(r.units))
      .map((r) => ({
        grade: parseFloat(r.grade),
        units: parseFloat(r.units),
      }));

    const currentErrors = rows.map((r) => ({
      grade: r.grade && !isValidGrade(r.grade),
      units: r.units && !isValidUnits(r.units),
    }));

    setErrors(currentErrors);
    onUpdate(validRows);
  }, [rows, onUpdate]);

  const isValidGrade = (value) =>
    value !== '' && !isNaN(value) && value >= 1 && value <= 4;

  const isValidUnits = (value) =>
    value !== '' && !isNaN(value) && value > 0;

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { grade: '', units: '' }]);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isLastRow = rowIndex === rows.length - 1;

      if (isLastRow) {
        addRow();
        setTimeout(() => {
          inputRefs.current[rowIndex + 1]?.[colIndex]?.focus();
        }, 0);
      } else {
        inputRefs.current[rowIndex + 1]?.[colIndex]?.focus();
      }
    }
  };

  // Ensure inputRefs has the correct structure
  useEffect(() => {
    inputRefs.current = rows.map((_, i) => inputRefs.current[i] || []);
  }, [rows.length]);

  return (
    <div className="semester">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Units</th>
            <th>Grade (1.00 - 4.00)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="number"
                  value={row.units}
                  placeholder="e.g. 3"
                  min="0.5"
                  step="0.5"
                  className={errors[i]?.units ? 'invalid' : ''}
                  ref={(el) => (inputRefs.current[i] = inputRefs.current[i] || [], inputRefs.current[i][0] = el)}
                  onChange={(e) => updateRow(i, 'units', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i, 0)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.grade}
                  placeholder="e.g. 1.75"
                  min="1"
                  max="4"
                  step="0.01"
                  className={errors[i]?.grade ? 'invalid' : ''}
                  ref={(el) => (inputRefs.current[i] = inputRefs.current[i] || [], inputRefs.current[i][1] = el)}
                  onChange={(e) => updateRow(i, 'grade', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i, 1)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>+ Add Subject</button>
    </div>
  );
};

export default SemesterTable;
