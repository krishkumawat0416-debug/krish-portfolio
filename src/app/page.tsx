'use client'

import { motion } from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa'

async function getRepos() {
  const res = await fetch(
    'https://api.github.com/users/krishkumawat0416-debug/repos'
  )

  return res.json()
}

export default async function Home() {
  const repos = await getRepos()

  return (
    <main className="bg-black text-white min-h-screen overflow-hidden">

      {/* Animated Top Line */}
      <div className="w-full overflow-hidden border-b border-gray-800">
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: 'linear',
          }}
          className="h-[2px] w-40 bg-cyan-400"
        />
      </div>

      {/* Bubble Effect */}
      <div className="fixed w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full top-20 left-10 animate-pulse" />

      <section className="max-w-7xl mx-auto px-6 py-20">

        {/* HERO */}
        <div className="mb-24">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold mb-6"
          >
            Krish Kumawat
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-cyan-400 mb-8"
          >
            Aspiring Data Engineer
          </motion.p>

          <p className="max-w-4xl text-gray-400 text-lg leading-9">
            Passionate about building scalable data pipelines,
            cloud-based analytics systems, ETL workflows,
            and big data processing using Python, SQL,
            Snowflake, Databricks, Hadoop, AWS and PySpark.
          </p>

          <div className="flex gap-5 mt-10 flex-wrap">

            <a
              href="https://github.com/krishkumawat0416-debug"
              target="_blank"
              className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="border border-gray-700 px-6 py-3 rounded-2xl hover:border-cyan-400 transition"
            >
              LinkedIn
            </a>

          </div>
        </div>

        {/* ABOUT */}
        <section className="mb-24">

          <h2 className="text-5xl font-bold mb-10">
            About Me
          </h2>

          <div className="border border-gray-800 rounded-3xl p-10 bg-white/5 backdrop-blur">

            <p className="text-gray-300 leading-9 text-lg">
              I am a fresher Data Engineer focused on building
              practical and scalable data solutions.
              I work with ETL pipelines, SQL analytics,
              cloud storage, big data tools,
              and modern data engineering workflows.

              Currently learning and building projects using
              Snowflake, Databricks, Hadoop,
              AWS, PySpark, Power BI and Python.
            </p>

          </div>
        </section>

        {/* SKILLS */}
        <section className="mb-24">

          <h2 className="text-5xl font-bold mb-10">
            Skills & Tools
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              'Python',
              'SQL',
              'Snowflake',
              'Databricks',
              'PySpark',
              'ETL',
              'ELT',
              'Power BI',
              'Hadoop',
              'AWS',
              'GitHub',
              'Data Warehousing',
              'Data Pipelines',
              'Pandas',
              'MySQL',
              'PostgreSQL',
            ].map((skill) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={skill}
                className="border border-gray-800 rounded-2xl p-6 bg-white/5"
              >
                <h3 className="text-xl font-semibold">
                  {skill}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="mb-24">

          <h2 className="text-5xl font-bold mb-10">
            GitHub Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {repos.map((repo: any) => (

              <motion.div
                whileHover={{ y: -5 }}
                key={repo.id}
                className="border border-gray-800 rounded-3xl p-8 bg-white/5"
              >

                <h3 className="text-3xl font-bold mb-4">
                  {repo.name}
                </h3>

                <p className="text-gray-400 mb-6 leading-8">
                  {repo.description || 'Data Engineering Project'}
                </p>

                <div className="flex gap-5 mb-6 text-sm text-cyan-300">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>{repo.language}</span>
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  className="inline-block bg-cyan-400 text-black px-5 py-3 rounded-2xl font-semibold"
                >
                  View Project
                </a>

              </motion.div>
            ))}

          </div>
        </section>

        {/* CONTACT */}
        <section>

          <h2 className="text-5xl font-bold mb-10">
            Connect With Me
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <a
              href="mailto:yourmail@gmail.com"
              className="border border-gray-800 rounded-3xl p-8 hover:border-cyan-400 transition"
            >
              <FaEnvelope className="text-4xl mb-4 text-cyan-400" />

              <h3 className="text-2xl font-semibold mb-3">
                Email
              </h3>

              <p className="text-gray-400">
                yourmail@gmail.com
              </p>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="border border-gray-800 rounded-3xl p-8 hover:border-cyan-400 transition"
            >
              <FaLinkedin className="text-4xl mb-4 text-cyan-400" />

              <h3 className="text-2xl font-semibold mb-3">
                LinkedIn
              </h3>

              <p className="text-gray-400">
                Connect professionally
              </p>
            </a>

            <a
              href="https://github.com/krishkumawat0416-debug"
              target="_blank"
              className="border border-gray-800 rounded-3xl p-8 hover:border-cyan-400 transition"
            >
              <FaGithub className="text-4xl mb-4 text-cyan-400" />

              <h3 className="text-2xl font-semibold mb-3">
                GitHub
              </h3>

              <p className="text-gray-400">
                View my repositories
              </p>
            </a>

          </div>
        </section>

      </section>
    </main>
  )
}