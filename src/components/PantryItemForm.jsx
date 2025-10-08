import React, { useState } from 'react';

const categories = [
  'Fresh Produce',
  'Dairy & Eggs',
  'Meat & Protein',
  'Grains & Pasta',
  'Canned Goods',
  'Pantry Staples',
  'Frozen',
  'Other'
];

const units = ['units', 'kg', 'g', 'L', 'mL'];

const PantryItemForm = ({ initialValues, onSubmit, onCancel, submitLabel = 'Add to Pantry' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: 1,
    unit: 'units',
    purchaseDate: new Date().toISOString().slice(0, 10),
    expirationDate: '',
    price: '',
    ...initialValues,
  });

 const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Strip dollar sign from price field
  if (name === 'price') {
    const cleanedPrice = value.replace(/[^0-9.]/g, '');
    setFormData({
      ...formData,
      [name]: cleanedPrice,
    });
  } 
  // Auto-suggest expiration date when category changes
  else if (name === 'category' && !formData.expirationDate) {
    const suggestedExpiration = suggestExpirationDate(value);
    setFormData({
      ...formData,
      [name]: value,
      expirationDate: suggestedExpiration,
    });
  } 
  else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};
// Auto-suggest expiration date based on category
const suggestExpirationDate = (category) => {
  const today = new Date();
  let daysToAdd = 365; // Default: 1 year
  
  switch(category) {
    case 'Fresh Produce':
      daysToAdd = 5; // 5 days
      break;
    case 'Dairy & Eggs':
      daysToAdd = 7; // 1 week
      break;
    case 'Meat & Protein':
      daysToAdd = 3; // 3 days
      break;
    case 'Grains & Pasta':
      daysToAdd = 180; // 6 months
      break;
    case 'Canned Goods':
      daysToAdd = 730; // 2 years
      break;
    case 'Pantry Staples':
      daysToAdd = 365; // 1 year
      break;
    case 'Frozen':
      daysToAdd = 90; // 3 months
      break;
    default:
      daysToAdd = 30; // 1 month for unknown
  }
  
  const expirationDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  return expirationDate.toISOString().slice(0, 10);
};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    onSubmit(formData);
  };

const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Cancel clicked/touched");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name*
        </label>
        <input
          required
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g. Chicken Breast"
        />
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Quantity and Unit */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="0.01"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
    value={formData.purchaseDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiration Date
          </label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2">$</span>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          onTouchEnd={handleCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[#FF8C42] text-white rounded-md hover:bg-[#F97316] transition-colors font-semibold shadow-md border-2 border-[#FF8C42]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PantryItemForm;