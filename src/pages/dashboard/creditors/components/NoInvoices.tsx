import Lottie from "react-lottie";
import animationData from "../../../../assets/no-data.json";

export default function NoInvoices() {
  return (
    <div className="flex-row justify-content-center align-items-center h-full w-300 gap-1 content-center">
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
        height={250}
        width={250}
      />
      <p className="text-muted-foreground text-center">
        No Invoices for the selected criteria.
      </p>
    </div>
  );
}
