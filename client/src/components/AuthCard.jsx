const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center leading-tight">{title}</h1>
        <p className="text-gray-500 text-center text-sm mt-2">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
