const StatCard = ({ count, title, icon }) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 w-44">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-xl font-semibold">{count}</h2>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;