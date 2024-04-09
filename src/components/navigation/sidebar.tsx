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
  Logout,
} from "../icons";
import { Button } from "../ui/button";
import Image from "next/image";
import { api } from "~/utils/api";
import Link from "next/link";

const walletAbbr = (inputString: string | undefined | null) => {
  if (!inputString) return "Wallet Not Added";
  return inputString.slice(0, 4) + "..." + inputString.slice(-4);
};

export const CreatorSidebar = () => {
  const router = useRouter();

  const { data: user } = api.user.get.useQuery();
  const { mutateAsync: logout } = api.auth.logout.useMutation();

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
            className={`flex items-center justify-start gap-2 disabled:cursor-not-allowed`}
            onClick={() => void router.push("/creator/chat")}
            disabled
          >
            <Chat size={20} />
            Chat
          </Button>
          <Button
            variant={
              router.pathname === "/creator/customers" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator/customers")}
            disabled
          >
            <Members size={18} />
            Customers
          </Button>
          <Button
            variant={router.pathname === "/settings" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/settings")}
          >
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={
              user?.profile.avatar ??
              `https://placehold.co/32/333/777.webp?text=${user?.profile.name?.substring(0, 1)}`
            }
            alt="profile photo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <Link href={`/${user?.profile.username}`}>
              {user?.profile.name ?? "No Name"}
            </Link>
            <span className="text-xs font-medium text-muted-foreground">
              {walletAbbr(user?.profile.wallet)}
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            void logout();
            void router.push("/");
          }}
        >
          <Logout />
        </Button>
      </div>
    </div>
  );
};

export const UserSidebar = () => {
  const router = useRouter();

  const { data: user } = api.user.get.useQuery();

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
            onClick={() => void router.push("/settings")}
          >
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={
              user?.profile.avatar ??
              "https://placehold.co/32.webp?text=" +
                user?.profile.name?.substring(0, 1)
            }
            alt="profile photo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <Link href={`/${user?.profile.username}`}>
              {user?.profile.name ?? "No Name"}
            </Link>
            <span className="text-xs font-medium text-muted-foreground">
              {walletAbbr(user?.profile.wallet)}
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => router.push(`/${user?.profile.username}`)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
