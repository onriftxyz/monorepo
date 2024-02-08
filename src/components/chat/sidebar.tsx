import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";

interface ItemProps {
  avatar: string;
  name: string;
  message: string;
  count?: number;
  amount?: number;
}

const ChatItem = ({ avatar, name, message, count, amount }: ItemProps) => {
  return (
    <button className="flex items-center gap-3.5 rounded-lg p-4 hover:bg-secondary">
      <Image
        src={avatar}
        alt="pfp"
        width={64}
        height={64}
        className="h-12 w-12 flex-shrink-0 rounded-full"
      />
      <div className="flex w-full flex-col gap-1 text-left">
        <div className="flex gap-2">
          {name}
          {amount ? <Badge variant="success">${amount}</Badge> : null}
        </div>
        <span className="line-clamp-1 text-sm text-secondary-foreground">
          {message}
        </span>
      </div>
      {count ? <Badge>{count}</Badge> : null}
    </button>
  );
};

const ChatList = () => {
  return (
    <div className="flex flex-col divide-y divide-muted">
      <ChatItem
        avatar={"https://picsum.photos/64" + "?random=" + Math.random() * 10}
        name="User Name"
        message="This is a random message sent from some imaginary user which has been made long intentionally to test the ellipsis functionality."
        count={Math.round(Math.random() * 10)}
      />
      <ChatItem
        avatar={"https://picsum.photos/64" + "?random=" + Math.random() * 10}
        name="User Name"
        message="This is a random message sent from some imaginary user which has been made long intentionally to test the ellipsis functionality."
        amount={Math.round(Math.random() * 1000) / 100}
      />
      <ChatItem
        avatar={"https://picsum.photos/64" + "?random=" + Math.random() * 10}
        name="User Name"
        message="This is a random message sent from some imaginary user which has been made long intentionally to test the ellipsis functionality."
        count={Math.round(Math.random() * 10)}
      />
    </div>
  );
};

export const ChatSidebar = () => {
  return (
    <div className="col-span-1 min-h-[calc(100vh-82px)]">
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ChatList />
        </TabsContent>
        <TabsContent value="incoming">
          <ChatList />
        </TabsContent>
        <TabsContent value="archived">
          <ChatList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
