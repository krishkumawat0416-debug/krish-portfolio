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
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="mb-20">
          <h1 className="text-6xl font-bold mb-4">
            Krish Kumawat
          </h1>

          <p className="text-2xl text-gray-300 mb-6">
            Aspiring Data Engineer
          </p>

          <p className="max-w-3xl text-gray-400 text-lg leading-8">
            Skilled in Python, SQL, Snowflake,
            Databricks, Hadoop, AWS and ETL pipelines.
            Passionate about building scalable
            data workflows and analytics systems.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">

            <a
              href="https://github.com/krishkumawat0416-debug"
              target="_blank"
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="border border-gray-700 px-6 py-3 rounded-xl"
            >
              LinkedIn
            </a>

          </div>
        </div>

        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8">
            Skills
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Languages
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>Python</li>
                <li>SQL</li>
              </ul>
            </div>

            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Data Engineering
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>Snowflake</li>
                <li>Databricks</li>
                <li>Hadoop</li>
                <li>ETL Pipelines</li>
              </ul>
            </div>

            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Cloud & Tools
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>AWS</li>
                <li>GitHub</li>
                <li>VS Code</li>
              </ul>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-4xl font-bold mb-10">
            GitHub Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {repos.map((repo: any) => (

              <div
                key={repo.id}
                className="border border-gray-800 rounded-2xl p-6 hover:border-gray-500 transition"
              >

                <h3 className="text-2xl font-semibold mb-3">
                  {repo.name}
                </h3>

                <p className="text-gray-400 mb-6 leading-7">
                  {repo.description || 'Data Engineering Project'}
                </p>

                <div className="flex gap-4 mb-6 text-sm text-gray-300">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>{repo.language}</span>
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  className="inline-block bg-white text-black px-5 py-2 rounded-xl font-medium"
                >
                  View Project
                </a>

              </div>

            ))}

          </div>
        </section>

      </section>
    </main>
  )
}