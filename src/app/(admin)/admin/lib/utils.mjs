const formatDateTime = (value) => {
  const reg = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})Z$/;
  let d;
  if (!reg.test(value)) {
    if (!isNaN(parseInt(value))) {
      d = new Date(parseInt(value));
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }
    return value;
  }
  const [, year, month, day, hour, minute, second, ms] = reg.exec(value);
  d = new Date(Date.UTC(year, parseInt(month) - 1, day, hour, minute, second, ms));
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}
const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;

export { formatDateTime, formatCurrency };
