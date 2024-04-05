import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/router";
import {
  Home,
  Members,
  Settings,
  ChevronRight,
  Explore,
  Product,
  Creator,
  Chat,
  ChevronLeft,
} from "../icons";
import { Button } from "../ui/button";
import Image from "next/image";
import { useToast } from "../ui/use-toast";

export const CreatorSidebar = () => {
  const router = useRouter();

  const { toast } = useToast();

  return (
    <div className="flex flex-col justify-between gap-4 px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-transparent.png"
              width={48}
              height={48}
              alt="logo"
            />
            <div>
              <div className="flex flex-col">
                <div className="text-sm uppercase">Rift</div>
                <div className="text-xs text-secondary-foreground">
                  Creator Dashboard
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => router.push("/home")}
            >
              <ChevronLeft />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 font-medium text-muted-foreground">
          <Button
            variant={router.pathname === "/creator" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator")}
          >
            <Home size={20} />
            Dashboard
          </Button>
          {/* <Button
            variant={router.pathname === "/explore" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/explore")}
          >
            <Explore size={20} />
            Explore
          </Button> */}
          <Button
            variant={
              router.pathname === "/creator/products" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator/products")}
          >
            <Product size={20} />
            Your Products
          </Button>
          <Button
            variant={router.pathname === "/creator/chat" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2 blur-[3px]`}
            onClick={() => void router.push("/creator/chat")}
          >
            <Chat size={20} />
            Chat
          </Button>
          <Button
            variant={
              router.pathname === "/creator/members" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator/members")}
          >
            <Members size={18} />
            Customers
          </Button>
          <Button
            variant={
              router.pathname === "/creator/settings" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            // onClick={() => void router.push("/creator/settings")}
            onClick={() =>
              toast({
                title: "Not yet implemented!",
                description: "The settings page has not yet been implemented.",
              })
            }
          >
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://picsum.photos/64"
            alt="profile photo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <span>PyBash</span>
            <span className="text-xs font-medium text-muted-foreground">
              0x000000000000
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Profile settings have not yet been implemented!",
            })
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export const UserSidebar = () => {
  const router = useRouter();

  const { toast } = useToast();

  return (
    <div className="flex flex-col justify-between gap-4 px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-transparent.png"
            width={48}
            height={48}
            alt="logo"
          />
          <div>
            <div className="flex flex-col">
              <div className="text-sm uppercase">Rift</div>
              <div className="text-xs text-secondary-foreground">Dashboard</div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 font-medium text-muted-foreground">
          <Button
            variant={router.pathname === "/home" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/home")}
          >
            <Home size={20} />
            Home
          </Button>
          <Button
            variant={router.pathname === "/explore" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/explore")}
          >
            <Explore size={20} />
            Explore
          </Button>
          <Button
            variant={router.pathname === "/products" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/products")}
          >
            <Product size={20} />
            Products
          </Button>
          <Button
            variant={router.pathname === "/creator" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator")}
          >
            <Creator size={20} />
            Creator
          </Button>
          {/* <Button
            variant={router.pathname === "/chat" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/chat")}
          >
            <Chat size={20} />
            Chat
          </Button> */}
          <Button
            variant={router.pathname === "/settings" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            // onClick={() => void router.push("/settings")}
            onClick={() =>
              toast({
                title: "Not yet implemented!",
                description: "The settings page has not yet been implemented.",
              })
            }
          >
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://picsum.photos/64"
            alt="profile photo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <span>PyBash</span>
            <span className="text-xs font-medium text-muted-foreground">
              0x000000000000
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Profile settings have not yet been implemented!",
            })
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
