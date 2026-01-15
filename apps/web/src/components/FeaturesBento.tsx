export function FeaturesBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      
      {/* LARGE */}
      <div className="md:col-span-6 lg:col-span-3 bento-card p-10 rounded-3xl bg-zinc-950">
        <h3 className="text-2xl font-semibold mb-4 text-neutral-200">
          Real-time polling
        </h3>
        <p className="text-neutral-400 text-lg leading-relaxed">
          Get instant responses from your audience with live polls and questions.
        </p>
      </div>

      {/* MEDIUM */}
      <div className="md:col-span-3 lg:col-span-3 bento-card p-8 rounded-2xl ">
        <h3 className="text-xl font-semibold mb-3 text-neutral-200">
          Live analytics
        </h3>
        <p className="text-neutral-400">
          Watch results update in real-time with clear visualizations.
        </p>
      </div>

      {/* MEDIUM */}
      <div className="md:col-span-3 lg:col-span-2 bento-card p-8 rounded-2xl">
        <h3 className="text-xl font-semibold mb-3 text-neutral-200">
          Interactive quizzes
        </h3>
        <p className="text-neutral-400">
          Create engaging quiz contests that keep participants engaged.
        </p>
      </div>

      {/* SMALL */}
      <div className="md:col-span-3 lg:col-span-2 bento-card p-8 rounded-2xl">
        <h3 className="text-xl font-semibold mb-3 text-neutral-200">
          Instant setup
        </h3>
        <p className="text-neutral-400">
          Create and launch your contest in seconds.
        </p>
      </div>

      {/* SMALL */}
      <div className="md:col-span-6 lg:col-span-2 bento-card p-8 rounded-2xl">
        <h3 className="text-xl font-semibold mb-3 text-neutral-200">
          Secure & private
        </h3>
        <p className="text-neutral-400">
          Participants can join securely without accounts.
        </p>
      </div>
    </div>
  );
}
