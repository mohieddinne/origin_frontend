export default function timeToDecimal(t) {
  if (!t) {
    t = "0";
  }
  const arr = t.toString().split(":");
  const dec = parseInt((arr[1] / 6) * 10, 10);

  return parseFloat(
    parseInt(arr[0], 10) + "." + (dec < 10 ? "0" : "") + dec
  );
}
