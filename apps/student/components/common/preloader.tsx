import LoadingScreen from "@workspace/ui/components/loading-screen";

interface PreloaderProps {
  show?: boolean;
}

const Preloader = ({ show = true }: PreloaderProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-95 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <LoadingScreen />
    </div>
  );
};

export default Preloader;
