import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Briefcase, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import GradientText from "@/components/GradientText";
import Masonry, { Item } from "@/components/Masonry";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function WelcomePage() {
  return (
    <div className="min-h-screen text-slate-50 selection:bg-indigo-500/30 font-sans">
      {/* Global Background overlay */}
      <div className="fixed inset-0 z-[-1] bg-black/40 pointer-events-none" />
      {/* Hero Section */}
      <header className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-8 max-w-7xl mx-auto gap-4" aria-label="Global">
          <div className="flex flex-1 min-w-0 items-center">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <GradientText className="text-xl sm:text-2xl font-bold tracking-tight truncate block">SAMARTH</GradientText>
            </Link>
          </div>

          <div className="flex flex-none justify-end items-center gap-1 sm:gap-4">
            <LanguageSelector />
            <Link href="/login" className="shrink-0">
              <Button variant="ghost" className="text-sm font-semibold leading-6 text-white h-10 px-2 sm:px-4">
                <span className="hidden xs:inline">Log in</span>
                <ArrowRight className="sm:ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl py-12 sm:py-24 lg:py-32 px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-6xl pb-4">
              <GradientText direction="vertical" colors={['#ffffff', '#64748b', '#ffffff']}>
                Empowering Citizens.<br />Strengthening Governance.
              </GradientText>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
              SAMARTH is a digital platform designed to connect citizens, contractors, and governance workers through transparency, accountability, and intelligent analytics.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-white flex items-center">
                Learn more <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Highlights Section */}
      <section id="features" className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Core Pillars</h2>
            <div className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              <GradientText colors={['#818cf8', '#c084fc', '#e879f9']}>Everything you need for smart governance</GradientText>
            </div>
          </div>

          <div className="w-full min-h-[500px]">
            <Masonry
              items={[
                {
                  id: 'citizen',
                  height: 480,
                  content: (
                    <Card className="h-full bg-[#0E0F17] border border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-shadow overflow-hidden flex flex-col">
                      <div className="h-44 w-full relative shrink-0 border-b border-blue-500/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F17] to-transparent z-10" />
                        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10" />
                        <img
                          src="/citizen-card-bg.png"
                          alt="Citizen Map Reporting"
                          className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col pt-2">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#1A1E2E] border border-blue-500/20 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <CardTitle className="text-white text-lg tracking-wide">Citizen Services</CardTitle>
                          </div>
                          <CardDescription className="text-slate-400 text-sm">Direct engagement for every citizen.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3.5">
                          {[
                            'File complaints with location tagging',
                            'Track issue resolution in real-time',
                            'Apply for government schemes',
                            'View local development projects'
                          ].map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                              <CheckCircle className="w-[18px] h-[18px] text-blue-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </CardContent>
                      </div>
                    </Card>
                  )
                },
                {
                  id: 'contractor',
                  height: 480,
                  content: (
                    <Card className="h-full bg-[#0E0F17] border border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-shadow overflow-hidden flex flex-col">
                      <div className="h-44 w-full relative shrink-0 border-b border-emerald-500/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F17] to-transparent z-10" />
                        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10" />
                        <img
                          src="/contractor-card-bg.png"
                          alt="Contractor Digital Services"
                          className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col pt-2">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#172421] border border-emerald-500/20 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-emerald-400" />
                            </div>
                            <CardTitle className="text-white text-lg tracking-wide">Contractor Services</CardTitle>
                          </div>
                          <CardDescription className="text-slate-400 text-sm">Transparent project management.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3.5">
                          {[
                            'Discover active government tenders',
                            'Submit project quotations digitally',
                            'Upload work progress reports',
                            'Document materials & timelines'
                          ].map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                              <CheckCircle className="w-[18px] h-[18px] text-emerald-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </CardContent>
                      </div>
                    </Card>
                  )
                },
                {
                  id: 'governance',
                  height: 480,
                  content: (
                    <Card className="h-full bg-[#0E0F17] border border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-shadow overflow-hidden flex flex-col">
                      <div className="h-44 w-full relative shrink-0 border-b border-amber-500/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F17] to-transparent z-10" />
                        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay z-10" />
                        <img
                          src="/governance-card-bg.png"
                          alt="Governance Data Analytics"
                          className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col pt-2">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#251A18] border border-amber-500/20 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 text-amber-400" />
                            </div>
                            <CardTitle className="text-white text-lg tracking-wide">Governance Intelligence</CardTitle>
                          </div>
                          <CardDescription className="text-slate-400 text-sm">Data-driven ground management.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3.5">
                          {[
                            'Booth-level analytics dashboard',
                            'Worker task management',
                            'Infrastructure monitoring',
                            'AI-powered sentiment analysis'
                          ].map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                              <CheckCircle className="w-[18px] h-[18px] text-amber-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </CardContent>
                      </div>
                    </Card>
                  )
                }
              ]}
            />
          </div>
        </div>
      </section>


      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-lg py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-slate-300">SAMARTH</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 SAMARTH Governance Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
