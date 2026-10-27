import { MONTHS } from '../../utils/dates';

export function MonthYearPicker({ month, year, onMonthChange, onYearChange, years }) {
  return (
    <div className="month-year-picker">
      <label className="form-label mb-1">Month</label>
      <div className="d-flex gap-2 flex-wrap">
        <select className="form-select" value={month} onChange={(event) => onMonthChange(Number(event.target.value))}>
          {MONTHS.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <select className="form-select" value={year} onChange={(event) => onYearChange(Number(event.target.value))}>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
