import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({
    open,
    onClose,
    filters,
    updateFilter,
    clearFilters,
    categories,
    brands,
}) => {
    return (
        <AnimatePresence>

            {open && (

                <>
                    {/* Overlay */}

                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}

                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto p-6"
                    >

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Filters
                            </h2>

                            <button
                                onClick={onClose}
                                className="text-xl"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        <FilterSidebar
                            mobile={true}
                            filters={filters}
                            updateFilter={updateFilter}
                            clearFilters={clearFilters}
                            categories={categories}
                            brands={brands}
                        />

                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-primary text-white py-3 rounded-xl"
                        >
                            Apply Filters
                        </button>

                    </motion.div>

                </>

            )}

        </AnimatePresence>
    );
};

export default MobileFilterDrawer;