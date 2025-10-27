export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-[100vw] overflow-x-hidden ${className}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
}
