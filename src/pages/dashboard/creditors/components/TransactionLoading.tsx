import Lottie from "react-lottie";
import animationData from "../../../../assets/timeline-load.json";

export default function TransactionLoading(
  { message = "No Invoices for the selected criteria." },
  { messsage: string },
) {
  return (
    <div className="flex-row justify-content-center align-items-center h-full w-full content-center p-0">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animationData,
          grayscale: true,
          colors: {
            primary: "#000000",
            secondary: "#000000",
          },
        }}
        height={250}
        width={250}
      />
    </div>
  );
}
