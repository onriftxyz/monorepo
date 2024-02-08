import { ThreeDots } from "@dynamic-labs/sdk-react-core";
import { matter } from "~/components/fonts";
import { Like, Comment } from "~/components/icons";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import Image from "next/image";

const Members = () => {
  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Members" />
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Name</TableHead>
                <TableHead className="w-fit">Address</TableHead>
                <TableHead className="w-fit">Email</TableHead>
                <TableHead className="w-fit">Joined On</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(7)
                .fill("member")
                .map(() => (
                  <TableRow key={Math.random() * 100}>
                    <TableCell className="flex items-center gap-3">
                      <Image
                        src={
                          "https://picsum.photos/64" +
                          "?random=" +
                          Math.random() * 10
                        }
                        alt="cover image"
                        width={64}
                        height={64}
                        className="h-12 w-12 flex-shrink-0 rounded-full"
                      />
                      <div className="w-full text-base">User Name</div>
                    </TableCell>
                    <TableCell>
                      0x{Math.round(Math.random() * 10000)}abcd
                      {Math.round(Math.random() * 10000)}efgh
                      {Math.round(Math.random() * 10000)}ijkl
                    </TableCell>
                    <TableCell>user@domain.com</TableCell>
                    <TableCell>
                      {new Date(
                        Number(new Date()) - Math.round(Math.random() * (Math.random() * 1000000) * 1000000),
                      ).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric"})}
                    </TableCell>
                    <TableCell className="w-6">
                      <Button size="icon" variant="ghost">
                        <ThreeDots />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default Members;
