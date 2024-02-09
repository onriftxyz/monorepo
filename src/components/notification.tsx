import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Notifications as NotificationsIcon } from "./icons";

export const Notifications = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size={"icon"}>
          <NotificationsIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Activity of the creators you follow appear here.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
