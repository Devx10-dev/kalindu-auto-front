"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect, useRef } from "react";
import InvoiceCard from "./InvoiceCard";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import Autoplay from "embla-carousel-autoplay";

const cards = [
  {
    title: "Beautiful Landscape",
    description:
      "A serene view of nature that calms the soul and inspires the mind.",
  },
  {
    title: "City Skyline",
    description:
      "Urban architecture at its finest, showcasing human ingenuity and progress.",
  },
  {
    title: "Beach Sunset",
    description:
      "Relaxing coastal scenery that paints the sky in vibrant hues of orange and pink.",
  },
  {
    title: "Mountain Peak",
    description:
      "Majestic heights and adventure await those who dare to climb to the top.",
  },
];

export function CardCarousel({
  creditInvoices,
}: {
  creditInvoices: CreditInvoice[];
}) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (creditInvoices.length > 0) {
      setCount(creditInvoices.length);
    }
  }, [creditInvoices]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {creditInvoices.map((invoice, index) => (
            <CarouselItem key={index}>
              <InvoiceCard invoice={invoice} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative mr-2 mt-4" />
          <span className="text-sm">
            {current} / {count}
          </span>
          <CarouselNext className="relative ml-2 mt-4" />
        </div>
      </Carousel>
    </div>
  );
}
