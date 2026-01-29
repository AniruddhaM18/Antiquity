import Link from "next/link";

//text-6xl text-neutral-700 text-shadow-black/10 text-shadow-lg tracking-tight
export function HeroSection() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-inter font-medium mb-6 leading-tight text-neutral-200">
                    Listen, learn and talk
                    <br />
                    <span className="text-orange-100">together</span>
                </h1>
                <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                    Create interactive contests, quizzes, and polls
                    <br />
                    that captivate your audience.
                    <br />
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/auth/signup">
                        <button className="px-8 py-5 rounded-md text-base font-medium neo-blue">
                            Get started for free
                        </button>
                    </Link>

                    <button className="px-8 py-5 rounded-md text-base font-medium neo-neutral">
                        Fu~k Around
                    </button>

                </div>
            </div>
        </section>
    )
}