const productsDB = [
    {
        id: 101,
        name: 'Safety Wet Floor Sign',
        price: 700,
        oldPrice: 1200,
        category: 'Home & Decor',
        image: '⚠️',
        gallery: ['⚠️', '🟡', '📐', '📦'],
        subtitle: 'Filipino-engineered double-sided caution sign with anti-slip base. Foldable, lightweight, and built for heavy commercial use. Perfect for offices, malls, and households.',
        stars: 4.9,
        reviewCount: 28,
        stock: 'In Stock',
        seller: {
            name: 'SafetyPro PH',
            avatar: 'S',
            rating: 4.9,
            productsSold: 312,
            memberSince: '2022'
        },
        specs: [
            { key: 'Material', val: 'High-density HDPE plastic' },
            { key: 'Height', val: '60cm (Standard) / 90cm / 120cm' },
            { key: 'Weight', val: '0.8 kg' },
            { key: 'Color', val: 'Yellow, Red, Blue' },
            { key: 'Design', val: 'Double-sided A-frame' },
            { key: 'Base Type', val: 'Anti-slip weighted' },
            { key: 'Made in', val: 'Philippines 🇵🇭' }
        ],
        variants: [
             { name: 'Color', options: ['Yellow', 'Red', 'Blue'] },
             { name: 'Size', options: ['Standard (60cm)', 'Large (90cm)', 'XL (120cm)'] }
        ],
        reviews: [
            { user: 'Maria Santos', date: 'February 18, 2026', rating: 5, text: 'Sobrang ganda ng kalidad! We bought 5 pieces for our office building and they\'ve been incredibly sturdy.', avatar: '👩' },
            { user: 'Jose Reyes', date: 'January 30, 2026', rating: 5, text: 'Great product, proudly Filipino-made! We run a small restaurant and these signs have been essential.', avatar: '👨' }
        ]
    },
    {
        id: 102,
        name: 'Herbal Muscle Relief Balm',
        price: 450,
        category: 'Health & Wellness',
        image: '🌿',
        gallery: ['🌿', '🥣', '🍃', '✨'],
        subtitle: 'The undisputed champion of relief. Over 50,000 jars sold nationwide. Made from 100% organic Lagundi and Sambong extracts.',
        stars: 5.0,
        reviewCount: 2400,
        stock: 'In Stock',
        seller: { name: 'HerbalPH', avatar: 'H', rating: 5.0, productsSold: 50000, memberSince: '2020' },
        specs: [
            { key: 'Ingredients', val: 'Beeswax, Coconut Oil, Lagundi, Sambong' },
            { key: 'Volume', val: '50g' },
            { key: 'Origin', val: 'Davao, Philippines' }
        ],
        variants: [ { name: 'Scent', options: ['Original', 'Menthol', 'Lavender'] } ],
        reviews: []
    },
    {
        id: 103,
        name: 'Solar Garden Lamp',
        price: 950,
        oldPrice: 1500,
        category: 'Lighting',
        image: '💡',
        gallery: ['💡', '🌞', '🔋', '🏡'],
        subtitle: 'Eco-friendly lighting for your garden. Charges during the day, lights up automatically at night.',
        stars: 4.8,
        reviewCount: 510,
        stock: 'In Stock',
        seller: { name: 'EcoLight PH', avatar: 'E', rating: 4.8, productsSold: 1200, memberSince: '2023' },
        specs: [
            { key: 'Battery', val: '2000mAh' },
            { key: 'Material', val: 'Aluminum & Glass' },
            { key: 'Waterproof', val: 'IP65' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 104,
        name: 'Bamboo Shelf Organizer',
        price: 380,
        category: 'Organization',
        image: '📦',
        gallery: ['📦', '🎋', '🏠', '✨'],
        subtitle: 'Minimalist bamboo shelf to declutter your space. Sustainable, durable, and stylish.',
        stars: 4.9,
        reviewCount: 1850,
        stock: 'In Stock',
        seller: { name: 'BambooCrafts', avatar: 'B', rating: 4.9, productsSold: 3000, memberSince: '2021' },
        specs: [
            { key: 'Material', val: '100% Treated Bamboo' },
            { key: 'Dimensions', val: '30x20x15cm' },
            { key: 'Load Capacity', val: '5kg' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 105,
        name: 'Men\'s Prestige Perfume',
        price: 700,
        category: 'Beauty',
        image: '🌊',
        gallery: ['🌊', '🧴', '💎', '🎁'],
        subtitle: 'A long-lasting fragrance that embodies confidence and sophistication. Locally blended.',
        stars: 4.8,
        reviewCount: 920,
        stock: 'Low Stock',
        seller: { name: 'ScentManila', avatar: 'S', rating: 4.7, productsSold: 800, memberSince: '2024' },
        specs: [
            { key: 'Volume', val: '100ml' },
            { key: 'Type', val: 'Eau de Parfum' },
            { key: 'Scent Profile', val: 'Aquatic, Woody' }
        ],
        variants: [],
        reviews: []
    },
     {
        id: 201,
        name: 'Virgin Coconut Oil',
        price: 250,
        category: 'Health',
        image: '🥥',
        gallery: ['🥥', '🌴', '🥄', '✨'],
        subtitle: 'Pure, cold-pressed virgin coconut oil for cooking, skincare, and hair care.',
        stars: 5.0,
        reviewCount: 432,
        stock: 'In Stock',
        seller: { name: 'CocoBest', avatar: 'C', rating: 4.9, productsSold: 1500, memberSince: '2022' },
        specs: [
             { key: 'Volume', val: '250ml' },
             { key: 'Process', val: 'Cold Pressed' },
             { key: 'Origin', val: 'Quezon Province' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 202,
        name: 'Davao Dark Chocolate',
        price: 180,
        category: 'Food',
        image: '🍫',
        gallery: ['🍫', '🍬', '😋', '🎁'],
        subtitle: 'Premium single-origin dark chocolate from Davao. Rich, intense, and ethically sourced.',
        stars: 4.9,
        reviewCount: 389,
        stock: 'In Stock',
        seller: { name: 'DavaoCacao', avatar: 'D', rating: 4.9, productsSold: 2200, memberSince: '2021' },
         specs: [
             { key: 'Cocoa Content', val: '70%' },
             { key: 'Weight', val: '100g' },
             { key: 'Origin', val: 'Davao City' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 203,
        name: 'Cebu Dried Mangoes',
        price: 320,
        category: 'Food',
        image: '🥭',
        gallery: ['🥭', '☀️', '🏖️', '🍽️'],
        subtitle: 'The world-famous dried mangoes from Cebu. Sweet, chewy, and naturally delicious.',
        stars: 5.0,
        reviewCount: 312,
        stock: 'In Stock',
        seller: { name: 'CebuSweets', avatar: 'M', rating: 5.0, productsSold: 4000, memberSince: '2020' },
         specs: [
             { key: 'Weight', val: '200g' },
             { key: 'Ingredients', val: 'Mango, Sugar' },
             { key: 'Origin', val: 'Cebu' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 106,
        name: 'Eco Mop Set',
        price: 550,
        category: 'Cleaning',
        image: '🧹',
        gallery: ['🧹', '🧼', '✨', '🏠'],
        subtitle: 'Eco-friendly cleaning solution. Durable, efficient, and made from sustainable materials.',
        stars: 4.6,
        reviewCount: 120,
        stock: 'In Stock',
        seller: { name: 'CleanGreen', avatar: 'C', rating: 4.7, productsSold: 500, memberSince: '2023' },
        specs: [
            { key: 'Handle', val: 'Bamboo' },
            { key: 'Head', val: 'Microfiber & Cotton' },
            { key: 'Bucket', val: 'Includes wringer' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 107,
        name: 'Rattan Planter',
        price: 1200,
        category: 'Home Decor',
        image: '🪴',
        gallery: ['🪴', '🎋', '🏡', '✨'],
        subtitle: 'Handwoven rattan planter basket. Adds a touch of nature and elegance to your indoor plants.',
        stars: 4.9,
        reviewCount: 85,
        stock: 'In Stock',
        seller: { name: 'NativeCrafts', avatar: 'N', rating: 4.9, productsSold: 320, memberSince: '2022' },
        specs: [
            { key: 'Material', val: 'Natural Rattan' },
            { key: 'Diameter', val: '30cm' },
            { key: 'Height', val: '35cm' }
        ],
        variants: [],
        reviews: []
    },
    {
        id: 110,
        name: 'Natural Moisturizing Bar Soap',
        price: 250,
        oldPrice: 380,
        category: 'Beauty',
        image: '🌸',
        gallery: ['🌸', '🧼', '✨', '🛁'],
        subtitle: 'Handmade organic soap with essential oils. Moisturizes and nourishes skin.',
        stars: 4.2,
        reviewCount: 41,
        stock: 'In Stock',
        seller: { name: 'PureNature', avatar: 'P', rating: 4.5, productsSold: 200, memberSince: '2023' },
        specs: [{ key: 'Scent', val: 'Floral' }, { key: 'Weight', val: '135g' }],
        variants: [],
        reviews: []
    },
    {
        id: 111,
        name: 'Smart Cable Organizer',
        price: 700,
        category: 'Technology',
        image: '🔌',
        gallery: ['🔌', '🔋', '📱', '💻'],
        subtitle: 'Keep your desk tidy with this smart cable management solution.',
        stars: 4.0,
        reviewCount: 15,
        stock: 'In Stock',
        seller: { name: 'TechEase', avatar: 'T', rating: 4.3, productsSold: 80, memberSince: '2024' },
        specs: [{ key: 'Material', val: 'Silicone' }, { key: 'Colors', val: 'Black, White' }],
        variants: [],
        reviews: []
    },
    {
        id: 112,
        name: 'Handwoven Fabric Tote Bag',
        price: 580,
        category: 'Fashion',
        image: '🎀',
        gallery: ['🎀', '👜', '🧵', '👗'],
        subtitle: 'Traditional handwoven fabric transformed into a stylish tote bag.',
        stars: 5.0,
        reviewCount: 89,
        stock: 'In Stock',
        seller: { name: 'WovenPh', avatar: 'W', rating: 4.9, productsSold: 400, memberSince: '2021' },
        specs: [{ key: 'Material', val: 'Cotton Blend' }, { key: 'Size', val: 'Medium' }],
        variants: [],
        reviews: []
    },
    {
        id: 113,
        name: 'Organic Calamansi Jam',
        price: 320,
        category: 'Food',
        image: '🍃',
        gallery: ['🍃', '🍞', '🍊', '🥄'],
        subtitle: 'Sweet and tangy calamansi jam made from organic farm-fresh fruits.',
        stars: 4.5,
        reviewCount: 53,
        stock: 'In Stock',
        seller: { name: 'FarmFresh', avatar: 'F', rating: 4.8, productsSold: 150, memberSince: '2023' },
        specs: [{ key: 'Weight', val: '250g' }, { key: 'Ingredients', val: 'Calamansi, Sugar' }],
        variants: [],
        reviews: []
    },
    {
        id: 114,
        name: 'Burnay Clay Decorative Pot',
        price: 1200,
        category: 'Art',
        image: '🖐️',
        gallery: ['🖐️', '🏺', '🏠', '🎨'],
        subtitle: 'Authentic Burnay clay pot, handcrafted by master potters.',
        stars: 5.0,
        reviewCount: 44,
        stock: 'In Stock',
        seller: { name: 'ClayWorks', avatar: 'C', rating: 5.0, productsSold: 90, memberSince: '2020' },
        specs: [{ key: 'Material', val: 'Clay' }, { key: 'Height', val: '40cm' }],
        variants: [],
        reviews: []
    }
];

function getProductById(id) {
    return productsDB.find(p => p.id === parseInt(id));
}
