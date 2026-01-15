import Beams from "@/src/components/Beams";

export default function TestPage() {
  return (
    <div className="h-screen bg-black">
      <Beams beamNumber={10} rotation={0} />
    </div>
  );
}
