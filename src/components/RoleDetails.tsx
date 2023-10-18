import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { setInitial } from "../utilities/Services";
import formatDate from "../utilities/Utiliities";
import LoadingState from "../components/loadingState";

interface RoleDetailsProps {
  listing_id: number | undefined;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ listing_id: listing_id }) => {
  const [roleData, setRoleData] = useState<any>(null);
  const [listingData, setListingData] = useState<any>(null);


  useEffect(() => {
    async function fetchData() {
        let listingData = await setInitial(setListingData, `api/listing?listing_id=${listing_id}`,false)
        setInitial(setRoleData, `api/role?role_id=${listingData.role_id}`,false);
    }
    fetchData();
  }, []);

  const vacancy = listingData? listingData.vacancy : null;
  const location = listingData? listingData.listing_location : null;


  if (roleData == null || roleData == undefined) {
    return <div>Error 404 There is no Listing with the ID {listing_id}</div>;
  }

  const close_date = formatDate(listingData.application_close_date ? new Date(listingData.application_close_date):null)

  return (
    <div className="w-full mb-8 lg:mb-0">
      <section className="rounded-lg mr-2 p-8 min-h-[600px] relative border border-solid border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="flex-grow">
            <div className="flex items-start">
              <div className="flex-grow">
                <h2 className="text-xl text-gray-600 mb-2 text-left">
                  {roleData.role_department}
                </h2>
              </div>
              <div className="text-right ml-4">
                <h2 className="text-l text-gray-600 mb-2">
                  Application Close Date
                </h2>
                <h2 className="text-l text-emerald-900 font-bold italic">
                  {close_date}
                </h2>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
              {roleData.role_name}
            </h2>
            <div className="flex items-center mb-4">
              <FaLocationDot className="text-gray-400 mr-2" />
              <p className="text-l text-emerald-900 italic text-left">
                {location}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <p className="text-l text-gray-800 text-left mr-6">Vacancy</p>
              <p className="text-l text-gray-800 italic text-left">
                {vacancy}
              </p>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">
              Description
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">
              {roleData.role_desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleDetails;
