export default function Gradient() {
  return (
    <div className="fixed inset-0 w-full h-full opacity-50 z-[-1]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#9b59b6] to-[#8e44ad] opacity-80 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2980b9] to-[#2c3e50] opacity-80 animate-pulse-slow delay-[4500ms]" />
    </div>
  );
}
