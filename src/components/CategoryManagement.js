import React from 'react';

const CategoryManagement = ({ categories, setShowAddCategoryModal, handleDeleteCategory }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Category Management</h2>
                <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    {categories?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className="flex justify-between items-center p-4 border rounded-lg"
                                >
                                    <span className="font-medium">{category}</span>
                                    <button
                                        onClick={() => handleDeleteCategory(category)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No categories found. Add your first category!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
