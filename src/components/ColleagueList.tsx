const colleagues = [
    { name: "Nguyễn Hoàng Phúc", email: "phucnguyen.090503@gmail.com", phone: "0934057253", photo: "https://via.placeholder.com/40" },
    { name: "Nguyễn Hoàng Phúc", email: "phucnguyen.090503@gmail.com", phone: "0934057253", photo: "https://via.placeholder.com/40" }
  ];
  
  const ColleagueList = () => {
    return (
      <div className="mt-6 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-bold mb-4">THÔNG TIN ĐỒNG NGHIỆP</h2>
        
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-2">Photo</th>
              <th className="p-2">Họ tên</th>
              <th className="p-2">Email</th>
              <th className="p-2">Điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {colleagues.map((colleague, index) => (
              <tr key={index} className="border-t">
                <td className="p-2"><img src={colleague.photo} alt="avatar" className="w-10 h-10 rounded-full" /></td>
                <td className="p-2">{colleague.name}</td>
                <td className="p-2 text-blue-500">{colleague.email}</td>
                <td className="p-2">{colleague.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ColleagueList;
  