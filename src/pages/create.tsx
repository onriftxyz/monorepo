import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { PostSchema } from "~/utils/forms";

export default function Create() {
  const createPost = api.product.create.useMutation();

  const postForm = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      userId: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
    try {
      const post = await createPost.mutateAsync({
        ...data,
      });

      toast({
        title: "Post Created...",
      });
    } catch (error) {
      toast({
        title: "Something went wrong...",
      });
    }
  };

  return (
    <div>
      <div className="text-sm text-secondary-foreground">Create a post.</div>{" "}
      <Form {...postForm}>
        <form onSubmit={postForm.handleSubmit(onSubmit)}>
          <FormField
            control={postForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-foreground">
                  Title
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={postForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-foreground">
                  Content
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Content" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="bg-white text-black transition duration-200 ease-in-out hover:bg-white/80"
            type="submit"
            variant="secondary"
          >
            Create Post
          </Button>
        </form>
      </Form>
    </div>
  );
}
