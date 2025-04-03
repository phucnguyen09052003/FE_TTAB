const OrgChart = () => {
    return (
      <div className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-bold">SƠ ĐỒ TỔ CHỨC</h2>
  
        <div className="flex flex-col items-center mt-4">
          <div className="bg-blue-300 px-6 py-2 rounded-md text-white font-bold">BOD</div>
  
          <div className="flex justify-center mt-4">
            <div className="bg-gray-300 px-6 py-2 rounded-md mx-2">INTERNAL AUDIT</div>
            <div className="bg-gray-300 px-6 py-2 rounded-md mx-2">BOARD</div>
            <div className="bg-gray-300 px-6 py-2 rounded-md mx-2">SECRETORY OF BOD</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default OrgChart;
  