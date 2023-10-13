import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import error404 from "../assets/error404.json";
import Button from "../components/Button";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Error404Page: React.FC = ({}) => {
  const navigate = useNavigate();
  useEffect(() => {
    // Prevent scrolling on the entire page
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when the component is unmounted
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClick = () => {
    navigate(`/`)
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#24a791" }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Button styleType="white" className="z-30 my-4 mx-4 flex flex-row w-32" onClick={handleClick}>
          <span className="inline-flex items-center">
            <AiOutlineArrowLeft /> <span className="ml-2">Go Back</span> 
          </span>
        </Button>
        <Lottie
          animationData={error404}
          loop={true}
          className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full object-cover z-20"
        />
      </div>
    </div>
  );
};

export default Error404Page;
