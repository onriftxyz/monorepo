import { Search, Notifications, Explore, ArrowTopRight, Add } from "../icons";
import { Button } from "../ui/button";

interface CreatorNavProps {
  title: string;
}

export const CreatorTopNav = ({ title }: CreatorNavProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[28px]">{title}</div>
      <div className="flex gap-2">
        <Button variant="ghost" size={"icon"}>
          <Search size={20} />
        </Button>
        <Button variant="ghost" size={"icon"}>
          <Notifications size={20} />
        </Button>
        <Button variant="outline" className="flex items-center">
          <Explore />
          Visit site
          <ArrowTopRight />
        </Button>
        <Button>
          <Add />
          Create
        </Button>
      </div>
    </div>
  );
};
