import Modal from 'react-modal'

import {
  calculateGWA,
  getHonor,
  getNeededUnits,
  getHonorProjection,
  getTargetAverageGrade
} from '../utils/helpers'

Modal.setAppElement('#root')

const ResultCard = ({ isOpen, onClose, allSemData }) => {
  const allRows = Object.values(allSemData).flat()
  const overall = calculateGWA(allRows)
  const honor = getHonor(overall)
  const suggestion = getNeededUnits(allRows, overall)
  const progress = getHonorProjection(allRows)
  const targetGrades = getTargetAverageGrade(allRows)

  // Group sem data by year
  const grouped = {}
  Object.entries(allSemData).forEach(([key, rows]) => {
    const [year, sem] = key.split('-') // key format: "1-1st"
    const yearLabel = `${parseInt(year)}${['st', 'nd', 'rd', 'th'][Math.min(parseInt(year), 4) - 1]} Year`
    if (!grouped[yearLabel]) grouped[yearLabel] = []
    grouped[yearLabel].push({ sem, rows })
  })

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Result Summary"
      className="resultModal"
      overlayClassName="resultOverlay"
    >
      <div className="results">
        <button className="closeButton" onClick={onClose}>✖</button>
        <h3>📊 Result Summary</h3>

        {/* Grouped GWA Summary */}
        {Object.entries(grouped).map(([year, sems]) => (
          <div key={year} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#006600', marginBottom: '0.5rem' }}>{year}</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.5rem' }}>
              <thead>
                <tr style={{ background: '#e8f5e9', color: '#006600' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Semester</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>GWA</th>
                </tr>
              </thead>
              <tbody>
                {sems.map(({ sem, rows }) => (
                  <tr key={sem}>
                    <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{sem} Semester</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{calculateGWA(rows).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Overall */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <tbody>
            <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Overall GWA</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{overall.toFixed(2)}</td>
            </tr>
            <tr style={{ background: '#fffbe6' }}>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Honor Standing</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{honor}</td>
            </tr>
          </tbody>
        </table>

        {/* GWA Progress Section */}
        <div className="section">
          <h4>📈 GWA Progress</h4>
          <p>You’ve entered <strong>{progress.entered}</strong> out of <strong>145</strong> units.</p>
          <p>
            🎯 Based on this, you can still possibly achieve:
            <ul>
              {progress.possible.cum && <li>✅ Cum Laude</li>}
              {progress.possible.magna && <li>✅ Magna Cum Laude</li>}
              {progress.possible.summa && <li>✅ Summa Cum Laude</li>}
              {!progress.possible.cum && !progress.possible.magna && !progress.possible.summa && (
                <li>❌ None — not mathematically possible with 4.0s alone</li>
              )}
            </ul>
          </p>
        </div>

        {/* Target Grades Section */}
        {targetGrades && (
          <div className="section">
            <h4>📌 Suggested Target Grades</h4>
            <ul>
              {targetGrades.map(({ target, avgGrade, remainingUnits }) => (
                <li key={target}>
                  🎯 To achieve <strong>{target}</strong>, you must average <strong>{avgGrade}</strong> in the remaining <strong>{remainingUnits}</strong> units.
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestion Tip */}
        {suggestion && (
          <p className="tip">
            📚 You need about <strong>{suggestion.units}</strong> more units with grade <strong>{suggestion.grade}</strong> to reach <strong>{suggestion.target}</strong>.
          </p>
        )}
      </div>
    </Modal>
  )
}

export default ResultCard
