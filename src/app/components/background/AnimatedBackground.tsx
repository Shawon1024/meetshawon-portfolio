export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl animate-float"/>
      <div className="absolute right-[-10%] bottom-[-10%] h-[450px] w-[450px] rounded-full bg-green-400/20 blur-3xl animate-float"/>
    </div>
  );
}
