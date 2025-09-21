import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQ_DATA } from "@/data/marketing";

interface FAQSectionProps {
  title: string;
  icon?: string;
  faqs:
    | typeof FAQ_DATA.general
    | typeof FAQ_DATA.technical
    | typeof FAQ_DATA.billing;
  className?: string;
}

export function FAQSection({ title, icon, faqs, className }: FAQSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SimpleFAQProps {
  faqs: FAQItem[];
  className?: string;
}

export function SimpleFAQ({ faqs, className }: SimpleFAQProps) {
  return (
    <div className={className}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
