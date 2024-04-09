import { api } from "~/utils/api";
import { Explore, ArrowTopRight, Add } from "../icons";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

interface CreatorNavProps {
  title: string;
  minimal?: boolean;
}

export const CreatorTopNav = ({ title, minimal = false }: CreatorNavProps) => {
  const router = useRouter();

  const { data: user } = api.user.get.useQuery();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[28px]">{title}</div>
      <div className="flex gap-2">
        {/* <Button
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
        <Notifications /> */}
        {!minimal ? (
          <>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() =>
                // toast({
                //   title: "Not yet implemented!",
                //   description: "Preview sites have not yet been implemented!",
                // })
                void router.push(`/${user?.profile.username}`)
              }
            >
              <Explore />
              Visit site
              <ArrowTopRight />
            </Button>
            <Button onClick={() => router.push("/creator/create")}>
              <Add />
              Create
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};
