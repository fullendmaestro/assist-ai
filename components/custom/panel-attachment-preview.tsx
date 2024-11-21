"use client";

import Image from "next/image";

import { Attachment } from "ai";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const PannelAttachment = ({
  panelattachments,
}: {
  panelattachments: Array<Attachment>;
}) => {
  return (
    <div className="flex justify-center items-center h-full p-10">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {panelattachments.map((attachment, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={attachment.url}
                      alt={attachment.name || "Attachment"}
                      width={500}
                      height={500}
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
