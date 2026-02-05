export default function Card({ children, className = "" }) {
  return (
    <div className={"bg-white border border-line rounded-2xl shadow-soft " + className}>
      {children}
    </div>
  );
}
