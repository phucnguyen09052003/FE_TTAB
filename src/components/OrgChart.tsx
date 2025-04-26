const OrgChart = () => {
  const positions = [
    { title: "BOD", members: 2 },
    { title: "INTERNAL AUDIT", members: 3 },
    { title: "SECRETARY OF BOD", members: 1 },
    { title: "BOARD", members: 4 },
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <div className="text-center">
            {/* BOD Card */}
            <div className="relative flex flex-col items-center">
              <div className="w-64 border border-indigo-200 rounded-lg bg-gradient-to-br from-indigo-50 to-white shadow-md">
                <div className="border-b border-indigo-200 p-3 font-bold text-indigo-900 text-center text-sm md:text-base bg-indigo-50">
                  BOD
                </div>
                <div className="p-4 text-center">
                  <p className="text-orange-600 font-medium text-sm">Nhân viên</p>
                  <div className="flex space-x-2 mt-3 justify-center">
                    {[...Array(2)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <img 
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                          alt="user" 
                          className="w-6 h-6 opacity-70"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors duration-200">
                    2 thành viên
                  </button>
                </div>
              </div>
              <div className="border-l-2 border-indigo-300 h-12 mt-2"></div>
            </div>

            {/* Second Row */}
            <div className="flex justify-center space-x-8 mt-6 relative">
              <div className="absolute top-[-24px] left-6 right-0 flex justify-center">
                <div className="border-t-2 border-indigo-300 w-[calc(200px*3+16px*2)]"></div>
              </div>

              {positions.slice(1).map((pos, index) => (
                <div key={index} className="relative">
                  <div className="relative flex flex-col items-center">
                    <div className="w-64 border border-indigo-200 rounded-lg bg-gradient-to-br from-indigo-50 to-white shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="border-b border-indigo-200 p-3 font-bold text-indigo-900 text-center text-sm md:text-base bg-indigo-50">
                        {pos.title}
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-orange-600 font-medium text-sm">Nhân viên</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                          {[...Array(pos.members)].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <img 
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                                alt="user" 
                                className="w-6 h-6 opacity-70"
                              />
                            </div>
                          ))}
                        </div>
                        <button className="mt-3 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors duration-200">
                          {pos.members} thành viên
                        </button>
                      </div>
                    </div>
                    <div className="border-l-2 border-indigo-300 h-6 absolute top-[-24px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
