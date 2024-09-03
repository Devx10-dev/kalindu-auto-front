import Lottie from "react-lottie";
import animationData from "../../../../assets/data-analysis.json";
import { colors } from "node_modules/react-select/dist/declarations/src/theme";

export default function DataProcessing() {
  return (
    <div className="flex-row justify-content-center align-items-center h-full w-300 gap-1 content-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animationData,
          // grayscale: true,
          colors: {
            primary: "#000000",
            secondary: "#000000",
          },
        }}
        height={200}
        width={200}
      />
      <p className="text-muted-foreground text-center">
        Please wait we are processing your data...
      </p>
    </div>
  );
}
