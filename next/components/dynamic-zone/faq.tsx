import { IconHelpHexagonFilled } from '@tabler/icons-react';

import { FeatureIconContainer } from './features/feature-icon-container';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
}: {
  heading: string;
  sub_heading: string;
  faqs: any[];
}) => {
  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      <div className="relative z-20 py-10 md:pt-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconHelpHexagonFilled className="h-7 w-7 text-brand-orange" />
        </FeatureIconContainer>
        <Heading as="h1" className="mt-6">
          {heading}
        </Heading>
        {sub_heading && (
          <p className="text-center text-neutral-600 mt-4 max-w-2xl mx-auto text-lg">
            {sub_heading}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 max-w-6xl mx-auto w-full">
        {faqs &&
          faqs.map((faq: { question: string; answer: string }, index: number) => (
            <div 
              key={faq.question}
              className="group p-6 rounded-2xl border border-neutral-200 bg-white hover:border-brand-blue/30 hover:shadow-[0_12px_32px_rgba(12,111,249,0.15)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-[#ff9a56] flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,126,29,0.3)]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-neutral-900 group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                    {faq.question}
                  </h4>
                  <p className="mt-3 text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};
