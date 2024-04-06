// import { useState, useEffect } from "react";
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
//   CommandSeparator,
//   CommandShortcut,
// } from "./ui/command";
// import {
//   PersonIcon,
//   EnvelopeClosedIcon,
//   GearIcon,
// } from "@radix-ui/react-icons";
// import { Dialog, DialogContent } from "./ui/dialog";
// import { Home, Post } from "./icons";

// export const CommandPalette = () => {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((open) => !open);
//       }
//     };
//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, []);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="overflow-hidden p-0">
//         <Command className="h-fit rounded-lg border shadow-md">
//           <CommandInput placeholder="Type a command or search..." />
//           <CommandList>
//             <CommandEmpty>No results found.</CommandEmpty>
//             <CommandGroup heading="Posts">
//               <CommandItem>
//                 <Home size={20} />
//                 <span className="pl-1">Dashboard</span>
//               </CommandItem>
//               <CommandItem>
//                 <Post size={20} />
//                 <span className="ml-1">Overview</span>
//               </CommandItem>
//               <CommandItem>
//                 <Post size={20} />
//                 <span className="ml-1">Drafts</span>
//               </CommandItem>
//               <CommandItem>
//                 <Post size={20} />
//                 <span className="ml-1">Scheduled</span>
//               </CommandItem>
//               <CommandItem>
//                 <Post size={20} />
//                 <span className="ml-1">Published</span>
//               </CommandItem>
//             </CommandGroup>
//             <CommandSeparator />
//             <CommandGroup heading="Settings">
//               <CommandItem>
//                 <PersonIcon className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//                 <CommandShortcut>⌘P</CommandShortcut>
//               </CommandItem>
//               <CommandItem>
//                 <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
//                 <span>Mail</span>
//                 <CommandShortcut>⌘B</CommandShortcut>
//               </CommandItem>
//               <CommandItem>
//                 <GearIcon className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//                 <CommandShortcut>⌘S</CommandShortcut>
//               </CommandItem>
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </DialogContent>
//     </Dialog>
//   );
// };
