import Lottie from "react-lottie";
import animationData from "../../../../assets/allcaughtup.json";
import animationData2 from "../../../../assets/list-completed.json";
import { OpacityIcon } from "@radix-ui/react-icons";

export default function AllCaughtUp({
  caughtUpText,
}: {
  caughtUpText: string;
}) {
  return (
    <div className="flex-row justify-content-center align-items-center h-full w-300 gap-1 content-center opacity-50 color-gray-500">
      <Lottie
        options={{
          loop: false,
          autoplay: true,
          animationData: animationData,
          // grayscale: true,
          colors: {
            primary: "#000000",
            secondary: "#000000",
          },
        }}
        height={200}
        className="opacity-50"
      />
      <p className="text-muted-foreground text-center">
        {caughtUpText ? caughtUpText : "All caught up!"}
      </p>
    </div>
  );
}
