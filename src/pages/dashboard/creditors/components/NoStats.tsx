import Lottie from "react-lottie";
import animationData from "../../../../assets/no-stats.json";

export default function NoStats(
  { message = "No Invoices for the selected criteria." },
  { messsage: string },
) {
  return (
    <div className="flex justify-content-center align-items-center h-full w-300 gap-1 content-center p-5">
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
        height={120}
        width={120}
      />
      <div className="flex-row justify-content-left h-full gap-2 content-center p-5">
        <p className="text-lg text-left mb-2">No Statistics yet</p>
        <p className="text-muted-foreground text-left">
          These will be available once the data is populated.
        </p>
      </div>
    </div>
  );
}
