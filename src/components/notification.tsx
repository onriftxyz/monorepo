import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Notifications as NotificationsIcon, ThreeDots } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Image from "next/image";
import { matter } from "./fonts";

interface NotificationProps {
  title: string;
  description: string;
  image: string;
  time: number;
}

const NotificationItem = ({
  title,
  description,
  image,
  time,
}: NotificationProps) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={image}
        alt="avatar"
        width={48}
        height={48}
        className="h-12 w-12 rounded-md"
      />
      <div className="flex flex-col gap-0.5">
        <div className="line-clamp-1">{title}</div>
        <div className="line-clamp-1 text-sm text-secondary-foreground">
          {description}
        </div>
      </div>
      <div className="shrink-0 text-sm text-secondary-foreground">
        {time} mins ago
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <ThreeDots size={20} />
      </Button>
    </div>
  );
};

const NotificationList = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array(4)
        .fill("notification")
        .map(() => (
          <NotificationItem
            key={Math.random()}
            title="Notitifcation title"
            description="Notification description which is a bit long"
            image={`https://picsum.photos/64?random=${Math.random() * 10}`}
            time={Math.round(Math.random() * 59)}
          />
        ))}
    </div>
  );
};

export const Notifications = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size={"icon"}>
          <NotificationsIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className={matter.className}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1">
            <span className="text-secondary-foreground">
              <NotificationsIcon />
            </span>
            Notifications
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="all" className="pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <NotificationList />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList />
          </TabsContent>
          <TabsContent value="archived">
            <NotificationList />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
