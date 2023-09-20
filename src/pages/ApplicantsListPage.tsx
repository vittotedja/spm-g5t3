import ProgressBar from "../components/ProgressBar";

const ApplicantsListPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg lg:mb-0">
          <section className="rounded-lg m-2 border border-solid border-gray-200 mb-10">
            <div className="max-w-4xl p-10 pb-0 flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/3 p-4 pr-8 mb-4 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
                  Jungler
                </h2>
                <p className="text-l text-gray-600 mb-0 text-left">
                  Created at 14 Sep 2023
                </p>
              </div>
              <div className="w-full lg:w-1/3 p-4 mb-4 lg:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  No of Applicants
                </h3>
                <p className="text-l text-gray-600 text-left">5</p>
              </div>
              <div className="w-full lg:w-1/3 p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  Department
                </h3>
                <p className="text-l text-gray-600 mb-8 text-left">IT</p>
              </div>
              <div className="w-full lg:w-1/3 p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  Application Close Date
                </h3>
                <p className="text-l text-gray-600 mb-8 text-left">30 Sep 2023</p>
              </div>
              
              </div>
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "-1px",
            }}
          >
            <button
              className="bg-green-900 text-white py-2 px-6 rounded-md text-lg font-semibold"
              style={{
                borderBottomRightRadius: "0",
                borderBottomLeftRadius: "0",
                marginLeft: "1px",
              }}
            >
              Applicants
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-500 active:bg-green-900 text-white py-2 px-6 rounded-md text-lg font-semibold"
              style={{
                borderBottomRightRadius: "0",
                borderBottomLeftRadius: "0",
              }}
            >
              Shortlisted
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              className="min-w-full border-collapse border"
              style={{
                borderRadius: "10px",
                borderTopLeftRadius: "0",
                overflow: "hidden",
              }}
            >
              <thead className="border-b-2">
                <tr className="bg-green-900 text-white">
                  <th className="p-2">Staff Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Current Role</th>
                  <th className="p-2">Current Department</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Skill Match (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-100">
                  <td className="p-2">John Doe</td>
                  <td className="p-2">john.doe@example.com</td>
                  <td className="p-2">Manager</td>
                  <td className="p-2">Sales</td>
                  <td className="p-2">USA</td>
                  <td className="p-2">
                    <ProgressBar percentage={80} />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-100">
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">jane.smith@example.com</td>
                  <td className="p-2">Developer</td>
                  <td className="p-2">Engineering</td>
                  <td className="p-2">Canada</td>
                  <td className="p-2">
                    <ProgressBar percentage={35} />
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsListPage;
