// Deterministic mock data generator.
// A seeded PRNG keeps the dataset identical across reloads so KPIs, charts
// and tables always agree with each other instead of re-randomizing.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20250601);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 2) => +(rand() * (max - min) + min).toFixed(decimals);

export const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors', 'Beauty & Personal Care', 'Books & Media'];
export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
export const ORDER_STATUSES = ['Delivered', 'Processing', 'Shipped', 'Cancelled', 'Returned'];

const PRODUCT_NAMES = {
  Electronics: ['Wireless Earbuds Pro', 'Smart Watch Series 4', '4K Action Camera', 'Portable SSD 1TB', 'Bluetooth Speaker Mini', 'Mechanical Keyboard', 'Noise Cancelling Headphones', 'USB-C Hub 7-in-1'],
  Apparel: ['Classic Denim Jacket', 'Running Sneakers', 'Merino Wool Sweater', 'Slim Fit Chinos', 'Everyday Hoodie', 'Linen Summer Shirt', 'Performance Leggings', 'Rain Shell Jacket'],
  'Home & Kitchen': ['Ceramic Cookware Set', 'Stand Mixer 5.5L', 'Air Fryer XL', 'Memory Foam Pillow', 'French Press Carafe', 'Cotton Bedding Set', 'Knife Block Set', 'Robot Vacuum'],
  'Sports & Outdoors': ['Yoga Mat Premium', 'Trail Running Backpack', 'Adjustable Dumbbell Set', 'Insulated Water Bottle', 'Camping Tent 2P', 'Resistance Band Kit', 'Cycling Helmet', 'Foldable Kayak Paddle'],
  'Beauty & Personal Care': ['Vitamin C Serum', 'Hydrating Face Mask Set', 'Electric Toothbrush', 'Argan Hair Oil', 'SPF 50 Sunscreen', 'Bamboo Skincare Set', 'Ceramic Hair Straightener', 'Aromatherapy Diffuser'],
  'Books & Media': ['The Growth Mindset', 'Atlas of Modern Design', 'Deep Work Workbook', 'Culinary Journeys', 'Startup Field Guide', 'Mindful Mornings', 'Data Stories', 'The Art of Focus'],
};

function buildProducts() {
  const products = [];
  let id = 1;
  for (const category of CATEGORIES) {
    for (const name of PRODUCT_NAMES[category]) {
      const basePrice = randFloat(12, 320, 2);
      const cost = +(basePrice * randFloat(0.42, 0.68)).toFixed(2);
      products.push({
        id: `P${String(id).padStart(3, '0')}`,
        name,
        category,
        price: basePrice,
        cost,
        stock: randInt(0, 400),
      });
      id++;
    }
  }
  return products;
}

const FIRST_NAMES = ['Aditi', 'Rahul', 'Priya', 'Karthik', 'Sneha', 'Arjun', 'Divya', 'Vikram', 'Meera', 'Rohan', 'Ananya', 'Suresh', 'Kavya', 'Nikhil', 'Pooja', 'Manoj', 'Isha', 'Vivek', 'Nandini', 'Sanjay', 'Lakshmi', 'Harish', 'Deepa', 'Ravi', 'Shreya', 'Kiran', 'Naveen', 'Radhika', 'Ajay', 'Swati'];
const LAST_NAMES = ['Sharma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Menon', 'Rao', 'Pillai', 'Verma', 'Krishnan', 'Chandran', 'Bose', 'Kapoor', 'Joshi', 'Desai', 'Mehta'];

function buildCustomers(count) {
  const customers = [];
  for (let i = 1; i <= count; i++) {
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    customers.push({
      id: `C${String(i).padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}${i}@example.com`,
      region: pick(REGIONS),
      joined: randomDateWithinDays(540),
    });
  }
  return customers;
}

function randomDateWithinDays(daysAgo, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() - randInt(0, daysAgo));
  d.setHours(randInt(8, 21), randInt(0, 59), 0, 0);
  return d;
}

function buildOrders(products, customers, count, now) {
  const orders = [];
  for (let i = 1; i < count + 1; i++) {
    const product = pick(products);
    const customer = pick(customers);
    const quantity = randInt(1, 6);
    // Seasonal-ish weighting: bias more orders toward recent months.
    const daysAgo = Math.floor(Math.pow(rand(), 1.6) * 365);
    const date = randomDateWithinDays(daysAgo, now);
    const revenue = +(product.price * quantity).toFixed(2);
    const cost = +(product.cost * quantity).toFixed(2);
    const status = weightedStatus();
    const profit = status === 'Cancelled' || status === 'Returned' ? -+(cost * 0.15).toFixed(2) : +(revenue - cost).toFixed(2);
    orders.push({
      id: `ORD-${String(10000 + i)}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      customerId: customer.id,
      customerName: customer.name,
      region: customer.region,
      date: date.toISOString(),
      quantity,
      unitPrice: product.price,
      revenue: status === 'Cancelled' ? 0 : revenue,
      cost,
      profit,
      status,
    });
  }
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  return orders;
}

function weightedStatus() {
  const r = rand();
  if (r < 0.62) return 'Delivered';
  if (r < 0.78) return 'Shipped';
  if (r < 0.9) return 'Processing';
  if (r < 0.96) return 'Returned';
  return 'Cancelled';
}

export function generateDataset(now = new Date()) {
  const products = buildProducts();
  const customers = buildCustomers(130);
  const orders = buildOrders(products, customers, 900, now);
  return { products, customers, orders };
}

export const DATASET = generateDataset();
