import { Search, Explore, ArrowTopRight, Add } from "../icons";
import { Notifications } from "../notification";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface CreatorNavProps {
  title: string;
}

export const CreatorTopNav = ({ title }: CreatorNavProps) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[28px]">{title}</div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size={"icon"}
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Search has not yet been implemented!",
            })
          }
        >
          <Search size={20} />
        </Button>
        <Notifications />
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Preview sites have not yet been implemented!",
            })
          }
        >
          <Explore />
          Visit site
          <ArrowTopRight />
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Post creation has not yet been implemented!",
            })
          }
        >
          <Add />
          Create
        </Button>
      </div>
    </div>
  );
};
