// import { redirect } from 'next/navigation';

// export default function Home() {
//   redirect('/dashboard');
// }
'use client';

import { useState } from 'react';
import { Menu, X, ArrowRight, TrendingUp, BarChart3, Users, Globe, Lock, Zap, CheckCircle, Calendar, Settings, Database, LineChart, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Nexus</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">Modules</a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">Industries</a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">Enterprise</a>
            <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">Sign in</Link>
            <Link href="/signup" className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition">
              Get started
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section - Creative Award-Winning Design */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-32 relative overflow-hidden bg-white">
        {/* Animated background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-border/20 rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto">
          {/* Main Content - Center aligned */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
            <div className="space-y-6">
              {/* Main Headline with styled elements */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                <span className="block">Run your business</span>
                <span className="relative inline-block">
                  <span className="text-foreground">like never</span>
                  <span className="inline-block ml-3 relative">
                    <span className="text-accent">before.</span>
                    <svg className="absolute -bottom-4 left-0 w-full text-accent" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
                      <path d="M 0 6 Q 50 2 100 6 T 200 6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-3xl mx-auto font-light">
                All-in-one ERP platform designed for Kenya's enterprises. Manage finances, supply chain, and operations in one unified system.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup" className="group relative px-8 py-4 bg-primary text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start free trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition duration-300" />
                </span>
              </Link>
              <button className="px-8 py-4 border-2 border-foreground text-foreground font-semibold rounded-xl hover:bg-foreground/5 transition-all duration-300">
                Book demo
              </button>
            </div>
          </div>

          {/* Visual Showcase - Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {/* Card 1 */}
            <div className="group p-8 rounded-2xl border border-border/30 bg-gradient-to-br from-white via-white to-primary/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/25 transition-colors">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Control</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Real-time accounting, multi-currency support, and KRA-compliant tax reporting. Full financial visibility at your fingertips.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-2xl border border-border/30 bg-gradient-to-br from-white via-white to-accent/5 hover:border-accent/30 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent/15 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-colors">
                <Globe className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Supply Chain</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                End-to-end visibility across procurement, logistics, and inventory management. Optimize every link in your chain.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-2xl border border-border/30 bg-gradient-to-br from-white via-white to-secondary/5 hover:border-secondary/30 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/15 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/25 transition-colors">
                <Lock className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Bank-grade encryption, audit trails, and compliance built-in. Your data stays secure and private, always.
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-20 pt-12 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider mb-4">Trusted by African enterprises</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-foreground">250+</p>
                  <p className="text-xs text-foreground/60">Active users</p>
                </div>
                <div className="w-px bg-border/30"></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">10x</p>
                  <p className="text-xs text-foreground/60">Faster workflows</p>
                </div>
                <div className="w-px bg-border/30"></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">99.9%</p>
                  <p className="text-xs text-foreground/60">Uptime</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/70 mb-3">Used by leading organizations</p>
              <div className="flex gap-2 justify-end">
                <div className="text-xs font-semibold px-3 py-1 rounded-full border border-border/30 bg-muted/30">KRA</div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full border border-border/30 bg-muted/30">Standard Bank</div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full border border-border/30 bg-muted/30">Safaricom</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Bento Grid - Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Comprehensive modules.{' '}
              <span className="text-foreground/50">Unified platform.</span>
            </h2>
            <p className="text-lg text-foreground/60 max-w-3xl">
              Enterprise-grade applications for every function. Designed to work together seamlessly.
            </p>
          </div>

          {/* Large Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 auto-rows-[200px]">
            {/* Large Featured Item - Spans 2x2 */}
            <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 group rounded-2xl bg-white border border-border hover:border-primary/30 transition-all duration-500 p-8 hover:shadow-2xl cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 group-hover:from-primary/3 group-hover:to-accent/3 transition-all duration-500"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors duration-300">
                      <BarChart3 className="text-primary" size={24} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Financial Management</h3>
                  </div>
                  <p className="text-foreground/60 text-sm md:text-base leading-relaxed max-w-md">
                    Complete accounting, budgeting, and multi-currency support with KRA compliance built-in.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg group-hover:bg-primary/15 transition-colors">Accounting</span>
                  <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-medium rounded-full">Budgeting</span>
                </div>
              </div>
            </div>

            {/* Regular Item 1 */}
            <div className="group rounded-xl bg-white border border-border hover:border-primary/30 transition-all duration-300 p-6 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 bg-secondary/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/25 transition-colors">
                <Users className="text-secondary" size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-1">Human Capital</h3>
              <p className="text-foreground/60 text-xs">Payroll & talent</p>
            </div>

            {/* Regular Item 2 */}
            <div className="group rounded-xl bg-white border border-border hover:border-primary/30 transition-all duration-300 p-6 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/25 transition-colors">
                <Globe className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-1">Supply Chain</h3>
              <p className="text-foreground/60 text-xs">Procurement & logistics</p>
            </div>

            {/* Large Featured Item 2 - Security */}
            <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 group rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all duration-500 p-8 hover:shadow-2xl cursor-pointer overflow-hidden relative text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-transparent to-slate-900/50 group-hover:from-slate-800/40 transition-all duration-500"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                    <Lock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Enterprise Security</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Bank-grade encryption, role-based access, audit trails. GDPR & ISO certified for Kenya compliance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap pt-4">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg group-hover:bg-white/15 transition-colors">Encryption</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg group-hover:bg-white/15 transition-colors">Compliance</span>
                </div>
              </div>
            </div>

            {/* Regular Item 3 */}
            <div className="group rounded-xl bg-white border border-border hover:border-primary/30 transition-all duration-300 p-6 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Database className="text-blue-600" size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-1">Data & Analytics</h3>
              <p className="text-foreground/60 text-xs">Real-time insights</p>
            </div>

            {/* Regular Item 4 */}
            <div className="group rounded-xl bg-white border border-border hover:border-primary/30 transition-all duration-300 p-6 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Zap className="text-emerald-600" size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-1">Integrations</h3>
              <p className="text-foreground/60 text-xs">500+ connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Visibility Section - Bento Style */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Real-time visibility across your entire operation
              </h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Track inventory, monitor cash flow, oversee production, and manage teams from one unified dashboard. Make faster decisions with live data.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Live Dashboard</p>
                    <p className="text-sm text-foreground/60">Monitor KPIs in real-time</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Custom Reports</p>
                    <p className="text-sm text-foreground/60">Export to any format</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">Mobile Access</p>
                    <p className="text-sm text-foreground/60">Manage on the go</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 px-8 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition">
                Explore more
              </button>
            </div>

            {/* Right - Image Card with Overlay */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted">
                <Image
                  src="/feature-analytics.jpg"
                  alt="Real-time analytics dashboard"
                  width={550}
                  height={500}
                  className="w-auto h-auto object-cover"
                />
              </div>

              {/* Overlay stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-border p-6 max-w-xs">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LineChart className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Real-time Sync</p>
                    <p className="text-xs text-foreground/50">Updated every 30 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Works with tools you already use</h2>
            <p className="text-lg text-foreground/60">Seamless integration with 500+ applications</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Stripe', 'M-Pesa', 'Safaricom', 'Excel', 'Slack', 'Google Workspace',
              'QuickBooks', 'Wave', 'PayPal', 'Xero', 'FreshBooks', 'Zoho'
            ].map((tool) => (
              <div
                key={tool}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-center hover:bg-primary/5"
              >
                <span className="font-medium text-sm text-foreground/70 group-hover:text-foreground transition">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Industry-specific solutions</h2>
            <p className="text-lg text-foreground/60">Purpose-built configurations for Kenya's key sectors</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Manufacturing',
                features: ['Production planning', 'Quality control', 'Inventory mgmt'],
                icon: Settings
              },
              {
                name: 'Retail & Commerce',
                features: ['POS integration', 'Multi-branch', 'Customer analytics'],
                icon: BarChart3
              },
              {
                name: 'Agriculture',
                features: ['Crop management', 'Supply chain', 'Pricing analysis'],
                icon: Globe
              },
              {
                name: 'Financial Services',
                features: ['Risk mgmt', 'Compliance', 'Audit trails'],
                icon: Shield
              },
              {
                name: 'Healthcare',
                features: ['Patient mgmt', 'Inventory', 'Billing'],
                icon: CheckCircle
              },
              {
                name: 'Logistics',
                features: ['Fleet tracking', 'Route optimization', 'Customer portal'],
                icon: TrendingUp
              },
            ].map((industry, idx) => {
              const Icon = industry.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{industry.name}</h3>
                  <ul className="space-y-2">
                    {industry.features.map((feature, fidx) => (
                      <li key={fidx} className="text-sm text-foreground/60 flex gap-2">
                        <span className="text-accent">•</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-foreground/60">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for small teams',
                features: ['Up to 5 users', 'Basic modules', 'Community support']
              },
              {
                name: 'Professional',
                price: '50,000',
                period: 'KES/month',
                description: 'For growing businesses',
                features: ['Unlimited users', 'All modules', 'Email support', 'Custom workflows'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: '200,000+',
                period: 'KES/month',
                description: 'For large organizations',
                features: ['Dedicated account manager', 'Custom integrations', 'Priority support', 'SLA guarantee']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${plan.highlighted
                    ? 'border-primary bg-primary/5 shadow-lg scale-105 p-8'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-lg p-8'
                  }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-foreground/60 text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  {typeof plan.price === 'string' && plan.price !== 'Free' ? (
                    <>
                      <p className="text-4xl font-bold">{plan.price}</p>
                      <p className="text-foreground/50 text-sm mt-1">{plan.period}</p>
                    </>
                  ) : (
                    <p className="text-4xl font-bold">{plan.price}</p>
                  )}
                </div>
                <button className={`w-full py-3 rounded-xl font-semibold mb-6 transition ${plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-2 border-foreground/20 text-foreground hover:border-foreground/40'
                  }`}>
                  Get started
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="text-sm text-foreground/70 flex gap-2">
                      <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold">Ready to transform your business?</h2>
          <p className="text-xl text-foreground/60">Join leading enterprises across Kenya and Africa</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
              Start free trial
              <ArrowRight size={18} />
            </Link>
            <button className="px-8 py-4 border-2 border-foreground/20 text-foreground rounded-xl font-semibold hover:border-foreground/40 transition">
              Schedule a demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <p className="font-bold text-lg mb-4">Nexus</p>
            <p className="text-sm text-foreground/60">Enterprise ERP for Africa</p>
          </div>
          <div>
            <p className="font-semibold mb-4">Product</p>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">Modules</a></li>
              <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition">Security</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4">Company</p>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">About</a></li>
              <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/50">
          <p>2024 Nexus. All rights reserved.</p>
          <p>Built for businesses across Africa</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
