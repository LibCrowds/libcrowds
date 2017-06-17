export default function (n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
