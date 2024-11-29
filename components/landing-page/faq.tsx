import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const Faq = () => {

  return (
    <section className="py-16 2xl:py-[120px] bg-default-100">
      <div className="container">

        <div className="max-w-[670px] mx-auto mb-14">
          <h2 className="text-center text-xl xl:text-3xl xl:leading-[46px] font-semibold text-default-900 mb-3">
            <span className="text-primary">FAQs</span>
          </h2>
          <p className="text-base xl:leading-7 text-center text-default-700 ">
            <strong> Got Questions?</strong> We've compiled a list of answers to your frequently asked questions. If you can't find what you're looking for here, don't hesitate to reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <Accordion type="single" collapsible className="space-y-6" >
              <AccordionItem
                value="item-1"
                className="bg-background"
              >
                <AccordionTrigger className="text-base xl:text-lg text-left font-medium text-default-900">
                  Beta test
                </AccordionTrigger>
                <AccordionContent className="text-sm xl:text-base text-default-700">
                  Beta test
                </AccordionContent>
              </AccordionItem>


            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible className="space-y-6" >


            </Accordion>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Faq;