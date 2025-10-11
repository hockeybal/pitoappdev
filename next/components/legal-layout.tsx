import React from 'react';
import { IconFileText } from '@tabler/icons-react';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  heroIcon: React.ReactNode;
  sections: Section[];
  tocTitle?: string;
}

export function LegalLayout({
  title,
  description,
  lastUpdated,
  heroIcon,
  sections,
  tocTitle = 'Inhoudsopgave',
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
              {heroIcon}
            </div>
            <span className="text-sm font-medium text-brand-blue">Legal Information</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600">
              {title}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-8 text-sm text-neutral-500">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200">
              Laatst bijgewerkt: {lastUpdated}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200">
              {sections.length} secties
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <IconFileText className="w-4 h-4" stroke={1.5} />
                  {tocTitle}
                </h3>
                <nav className="space-y-1 text-sm">
                  {sections.map((section, idx) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block py-2 px-3 rounded-lg text-neutral-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors group"
                    >
                      <span className="text-neutral-400 group-hover:text-brand-blue mr-2">
                        {idx + 1}.
                      </span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 group"
              >
                <div className="flex items-start gap-4 mb-6">
                  {section.icon && (
                    <div className="p-3 rounded-xl bg-white border border-neutral-200 shrink-0 group-hover:border-neutral-300 transition-colors shadow-sm">
                      {section.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                      {idx + 1}. {section.title}
                    </h2>
                    <div className="prose prose-neutral max-w-none">
                      {section.content}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable components for content
export function LegalParagraph({ children }: { children: React.ReactNode }) {
  return <p className="text-neutral-700 leading-relaxed mb-4">{children}</p>;
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3 my-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-neutral-700">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalHighlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 my-6">
      <div className="text-neutral-700 leading-relaxed">{children}</div>
    </div>
  );
}

export function LegalSubtitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">{children}</h3>;
}

export function LegalContact({ 
  company, 
  email, 
  additionalInfo 
}: { 
  company: string; 
  email: string; 
  additionalInfo?: string;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 my-6 shadow-sm">
      <p className="text-neutral-900 font-semibold mb-2">{company}</p>
      <p className="text-neutral-600 mb-1">E-mail: <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700 transition-colors underline">{email}</a></p>
      {additionalInfo && <p className="text-neutral-600">{additionalInfo}</p>}
    </div>
  );
}
