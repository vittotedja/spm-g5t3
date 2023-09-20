import React, { useEffect } from "react";

interface RoleDetailsProps {
  roleID: number;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ roleID }) => {
  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, [roleID]);

  return (
    <div className="w-full lg:w-3/4 mb-8 lg:mb-0">
      <section className="rounded-lg m-2 p-8 min-h-[100%] relative border border-solid border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
              Jungler
            </h2>
            <p className="text-l text-gray-600 mb-8 text-left">
              Created at 14 Sep 2023
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
              Description
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
              Responsibility
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
              Department
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">IT</p>
          </div>
        
        </div>
      </section>
    </div>
  );
};

export default RoleDetails;
