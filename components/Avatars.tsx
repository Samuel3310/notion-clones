"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const Avatars = () => {
  const self = useSelf();
  const others = useOthers();
  const all = [self, ...others];
  return (
    <div className="flex gap-2 flex-col items-center">
      <p className="font-light text-sm">Users currently editing this page</p>
      <div className="flex -space-x-5">
        {all.map((other, i) => (
          <TooltipProvider key={other.id + i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage src={other?.info.info.avatar} />
                  <AvatarFallback>{other.info.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === other?.id ? "You" : other?.info.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Avatars;
