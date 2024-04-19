import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <span className="font-bold ml-4 text-blue-50">KALINDU AUTO</span>
      <div className="flex gap-5 items-center">
        <Avatar className="mr-5">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

export default Navbar;
