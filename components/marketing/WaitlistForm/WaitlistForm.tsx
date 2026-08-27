"use client";

import { Handshake, Trophy, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { PlayerWaitlistForm } from "./PlayerFields";
import { FacilityWaitlistForm } from "./FacilityFields";
import { PartnerWaitlistForm } from "./PartnerFields";

export function WaitlistForm() {
  return (
    <Tabs defaultValue="player" className="w-full">
      <TabsList className="mb-8 flex w-full flex-wrap justify-center gap-1 sm:inline-flex sm:w-auto">
        <TabsTrigger value="player" className="flex items-center gap-2">
          <Trophy className="size-4" /> I&apos;m a Player
        </TabsTrigger>
        <TabsTrigger value="facility" className="flex items-center gap-2">
          <Building2 className="size-4" /> I Represent a Facility
        </TabsTrigger>
        <TabsTrigger value="partner" className="flex items-center gap-2">
          <Handshake className="size-4" /> I&apos;m an Industry Partner
        </TabsTrigger>
      </TabsList>

      <TabsContent value="player">
        <PlayerWaitlistForm />
      </TabsContent>
      <TabsContent value="facility">
        <FacilityWaitlistForm />
      </TabsContent>
      <TabsContent value="partner">
        <PartnerWaitlistForm />
      </TabsContent>
    </Tabs>
  );
}
