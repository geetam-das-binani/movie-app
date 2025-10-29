import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User2 } from "lucide-react";

interface ProfileMenuProps {
  user: { name: string; email: string ,createdAt:string};
  onLogout: () => void;
}

const ProfileMenu = ({ user, onLogout }: ProfileMenuProps) => {
   const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50 text-indigo-700"
        >
          <User2 className="h-4 w-4" />
          <span className="font-medium">{user?.name || "User"}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 bg-white rounded-lg shadow-lg p-2"
      >
        {/* User Info */}
       <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
          <p className="text-xs text-gray-400 mt-2">
            <span className="font-medium text-gray-500">Joined:</span>{" "}
            {formattedDate || "N/A"}
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600 font-medium focus:bg-red-50 cursor-pointer flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
