import Lottie from "react-lottie";
import animationData from "../../../../assets/not-selected.json";

export default function NotSelected(
  { message = "No Invoices for the selected criteria." },
  { messsage: string },
) {
  return (
    <div className="flex-row justify-content-center align-items-center h-full w-300 gap-1 content-center p-5 opacity-60">
      <Lottie
        options={{
          loop: false,
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
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}
