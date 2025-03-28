import { FaFileAlt } from "react-icons/fa";

const Card = ({ title }: { title: string }) => {
  return (
    <div className="p-4 bg-red-100 flex items-center gap-2 rounded-md shadow-md cursor-pointer hover:bg-red-200">
      <FaFileAlt className="text-red-600" />
      <span>{title}</span>
    </div>
  );
};

export default Card;
