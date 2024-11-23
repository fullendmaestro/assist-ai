"use client";

import { Attachment } from "ai";
import { X } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ScrollArea } from "../ui/scroll-area";

export const PannelAttachment = ({
  panelattachments,
  togglePanel,
}: {
  panelattachments: Array<Attachment>;
  togglePanel: (attachments: Attachment[] | any) => any;
}) => {
  const handleClose = () => {
    togglePanel([]);
  };
  return (
    <div className="relative flex justify-center items-center h-full p-10">
      <button
        className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full shadow-md"
        onClick={handleClose}
      >
        <X />
      </button>
      <Carousel className="size-full">
        <CarouselContent>
          {panelattachments.map((attachment, index) => (
            <CarouselItem key={index} className="size-full">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <ScrollArea>
                      <Image
                        src={attachment.url}
                        alt={attachment.name || "Attachment"}
                        width={500}
                        height={500}
                        className="w-full h-auto"
                      />
                    </ScrollArea>
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
