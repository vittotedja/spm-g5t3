import img from "../assets/glasswindow_loading.gif";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-60">
      <img
        src={img}
        alt="Loading..."
        className="w-20 h-20 mb-6"
      />
      <h5 className="text-emerald-700 font-medium">Loading...</h5>
    </div>
  );
};

export default LoadingState;

// CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.rules.length);

styleSheet.insertRule(`
  .animate-spin-slow {
    animation: spin 2.5s linear infinite; /* Adjust animation-duration to make it slower */
  }
`, styleSheet.rules.length);
