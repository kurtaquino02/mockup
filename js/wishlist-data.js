const defaultWishlistItems = [
    {
        id: 101, 
        name: "Safety Wet Floor Sign",
        price: 700,
        oldPrice: 1200,
        rating: 4.9,
        reviews: 28,
        image: "⚠️",
        category: "home",
        catDisplay: "🏠 Home & Decor Maintenance",
        stock: "available",
        badge: "sale",
        badgeText: "−42%"
    },
    {
        id: 105,
        name: "Men's Prestige Perfume",
        price: 700,
        oldPrice: null,
        rating: 5.0,
        reviews: 12,
        image: "🌊",
        category: "beauty",
        catDisplay: "💄 Beauty & Personal Care",
        stock: "available",
        badge: "new",
        badgeText: "New"
    },
    {
        id: 112,
        name: "Handwoven Fabric Tote Bag",
        price: 580,
        oldPrice: null,
        rating: 4.8,
        reviews: 45,
        image: "🎀",
        category: "fashion",
        catDisplay: "👗 Fashion & Accessories",
        stock: "low",
        badge: null,
        badgeText: null
    },
    {
        id: 102,
        name: "Herbal Muscle Relief Balm",
        price: 450,
        oldPrice: null,
        rating: 4.9,
        reviews: 156,
        image: "🌿",
        category: "health",
        catDisplay: "🌿 Health & Wellness",
        stock: "available",
        badge: "bestseller",
        badgeText: "Best Seller"
    },
    {
        id: 113,
        name: "Organic Calamansi Jam",
        price: 320,
        oldPrice: null,
        rating: 4.7,
        reviews: 32,
        image: "🍊",
        category: "food",
        catDisplay: "🍜 Food & Beverage",
        stock: "available",
        badge: null,
        badgeText: null
    },
    {
        id: 114,
        name: "Burnay Clay Decorative Pot",
        price: 1200,
        oldPrice: 1500,
        rating: 5.0,
        reviews: 8,
        image: "🏺",
        category: "arts",
        catDisplay: "🎨 Arts & Crafts",
        stock: "available",
        badge: "sale",
        badgeText: "−20%"
    }
];

function getWishlist() {
    let list = localStorage.getItem('imbento-wishlist');
    if (!list) {
        list = JSON.stringify(defaultWishlistItems);
        localStorage.setItem('imbento-wishlist', list);
    }
    return JSON.parse(list);
}
