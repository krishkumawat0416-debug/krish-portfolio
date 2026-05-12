async function getRepos() {
  const res = await fetch(
    'https://api.github.com/users/krishkumawat0416-debug/repos',
    {
      next: { revalidate: 3600 },
    }
  )

  return res.json()
}

export default async function Home() {
  const repos = await getRepos()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 text-white">

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">

          <div>

            <p className="text-cyan-400 uppercase tracking-[6px] mb-5 font-semibold">
              DATA ENGINEER PORTFOLIO
            </p>

            <h1 className="text-7xl font-black leading-tight mb-6">
              Krish
              <span className="text-cyan-400"> Kumawat</span>
            </h1>

            <p className="text-2xl text-gray-300 mb-8">
              Aspiring Data Engineer
            </p>

            <p className="text-gray-400 text-lg leading-8 mb-10 max-w-2xl">
              Passionate about building scalable ETL pipelines,
              cloud workflows, SQL systems, and analytics solutions
              using Python, Snowflake, Databricks, Hadoop, and AWS.
            </p>

            <div className="flex gap-5 flex-wrap">

              <a
                href="https://github.com/krishkumawat0416-debug"
                target="_blank"
                className="bg-cyan-400 text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                className="border border-cyan-400 px-8 py-4 rounded-2xl hover:bg-cyan-400 hover:text-black transition"
              >
                LinkedIn
              </a>

            </div>
          </div>

          <div className="relative">

            <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">

              <h2 className="text-3xl font-bold mb-8 text-cyan-400">
                Tech Stack
              </h2>

              <div className="grid grid-cols-2 gap-5">

                {[
                  'Python',
                  'SQL',
                  'Snowflake',
                  'Databricks',
                  'Hadoop',
                  'AWS',
                  'ETL',
                  'GitHub',
                ].map((skill) => (

                  <div
                    key={skill}
                    className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-center hover:border-cyan-400 hover:scale-105 transition"
                  >
                    {skill}
                  </div>

                ))}

              </div>
            </div>
          </div>
        </div>

        <section>

          <div className="flex items-center justify-between mb-12">

            <h2 className="text-5xl font-black">
              GitHub Projects
            </h2>

            <div className="w-40 h-1 bg-cyan-400 rounded-full"></div>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {repos.map((repo: any) => (

              <div
                key={repo.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-3 hover:border-cyan-400 transition duration-300"
              >

                <div className="flex items-center justify-between mb-5">

                  <span className="bg-cyan-400/20 text-cyan-400 px-4 py-1 rounded-full text-sm">
                    Project
                  </span>

                  <span className="text-gray-400 text-sm">
                    ⭐ {repo.stargazers_count}
                  </span>

                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {repo.name}
                </h3>

                <p className="text-gray-400 leading-7 mb-8 min-h-[100px]">
                  {repo.description || 'Data Engineering Project'}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-cyan-400 text-sm">
                    {repo.language}
                  </span>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
                  >
                    View Project
                  </a>

                </div>

              </div>

            ))}

          </div>
        </section>

      </section>
    </main>
  )
}