const product ={
  _id: ObjectId,
  name: String,               // e.g. "Oversized Graphic Tee"
  description: String,        // Full product description
  price: Number,              // Base price (may vary with size or color)

  images: [String],           // URLs to product images

  category: String,           // "Men", "Women", "Unisex", etc.
  subcategory: String,        // "T-Shirts", "Jeans", "Hoodies", etc.

  brandId: ObjectId,          // Reference to seller (brand)

  availableColors: [String],  // Hex or color names e.g. ["#000000", "Red"]
  availableSizes: [String],   // ["S", "M", "L", "XL"]
  fit:[String],               // ["Regular", "Slim", "Oversized",...etc]

  stock: [                    // Stock per size and color
    {
      size: String,
      color: String,
      quantity: Number
    }
  ],

  tags: [String],             // ["summer", "casual", "sale"]

  visibility:Boolean,
  isFeatured: Boolean,        // For homepage highlights
  isOnSale: Boolean,
  salePrice: Number,          // If applicable

  rating: {
    average: Number,          // 4.5
    count: Number             // 130 reviews
  },

  createdAt: Date,
  updatedAt: Date
}
