export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="animate-float absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl" />

      <div
        className="animate-float absolute bottom-[-10%] right-[-10%] h-[450px] w-[450px] rounded-full bg-green-400/20 blur-3xl"
        style={{
          animationDelay:
            "-10s",
        }}
      />
    </div>
  );
}