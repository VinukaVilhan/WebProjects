import CustomBackgroundDiv from "./dottedSection";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
      <main className="flex flex-col gap-8 items-center">
        <p>Hello, this is a section with animated dots:</p>
        
        {/* This div will have the animated dotted effect */}
        <CustomBackgroundDiv />

      </main>
    </div>
  );
}
