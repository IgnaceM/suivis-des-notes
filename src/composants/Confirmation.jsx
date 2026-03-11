
const Confirmation = ({ message, confirm, type }) => {


  if (!confirm) return null;

  const className = {
    add: 'bg-green-500',
    edit: 'bg-sky-400 dark:bg-sky-600',
    delete: 'bg-red-500',
    error: "bg-red-500"
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`fixed bottom-24 px-3 py-1 rounded-lg z-50 text-sm text-white ${className[type]}`}
      >
        {message}
      </div>
    </div>
  );
};

export default Confirmation;