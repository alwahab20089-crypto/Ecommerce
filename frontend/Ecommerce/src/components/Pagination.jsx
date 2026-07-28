const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12 gap-2">

      {Array.from(
        { length: totalPages },
        (_, i) => i + 1
      ).map((page) => (

        <button
          key={page}
          onClick={() =>
            onPageChange(page)
          }
          className={`w-10 h-10 rounded-lg transition ${
            currentPage === page
              ? "bg-primary text-white"
              : "bg-white border"
          }`}
        >
          {page}
        </button>

      ))}

    </div>
  );
};

export default Pagination;