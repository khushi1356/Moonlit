const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const StylistProfile = require('./models/StylistProfile');

const stylists = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@moonlit.com',
    phone: '+91 98765 43210',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Expert in bridal makeup and hair styling with 8 years of experience.',
    specialization: ['Bridal Makeup', 'Hair Styling', 'Blow Dry'],
    experience: 8,
  },
  {
    name: 'Ananya Kapoor',
    email: 'ananya.kapoor@moonlit.com',
    phone: '+91 98765 43211',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Specialist in advanced skincare treatments and facials.',
    specialization: ['Facials', 'Skin Care', 'Hydra Facial'],
    experience: 6,
  },
  {
    name: 'Ritika Mehra',
    email: 'ritika.mehra@moonlit.com',
    phone: '+91 98765 43212',
    profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'Creative colorist with expertise in balayage and highlights.',
    specialization: ['Hair Color', 'Balayage', 'Highlights'],
    experience: 5,
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@moonlit.com',
    phone: '+91 98765 43213',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Nail art specialist and manicure expert.',
    specialization: ['Manicure', 'Pedicure', 'Nail Art'],
    experience: 4,
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya.reddy@moonlit.com',
    phone: '+91 98765 43214',
    profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
    bio: 'Body spa and massage therapy expert.',
    specialization: ['Body Massage', 'Spa Therapy', 'Aromatherapy'],
    experience: 7,
  },
  {
    name: 'Pooja Nair',
    email: 'pooja.nair@moonlit.com',
    phone: '+91 98765 43215',
    profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
    bio: 'Hair treatment specialist with a focus on scalp health.',
    specialization: ['Hair Treatment', 'Keratin', 'Scalp Care'],
    experience: 5,
  },
  {
    name: 'Divya Singh',
    email: 'divya.singh@moonlit.com',
    phone: '+91 98765 43216',
    profilePic: 'https://randomuser.me/api/portraits/women/7.jpg',
    bio: 'Threading and waxing expert with a gentle touch.',
    specialization: ['Threading', 'Waxing', 'Eyebrow Shaping'],
    experience: 6,
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@moonlit.com',
    phone: '+91 98765 43217',
    profilePic: 'https://randomuser.me/api/portraits/women/8.jpg',
    bio: 'Senior makeup artist specializing in party and event looks.',
    specialization: ['Party Makeup', 'Airbrush', 'Contouring'],
    experience: 9,
  },
  {
    name: 'Sunita Verma',
    email: 'sunita.verma@moonlit.com',
    phone: '+91 98765 43218',
    profilePic: 'https://randomuser.me/api/portraits/women/9.jpg',
    bio: 'Precision hair cutting expert for all hair types.',
    specialization: ['Hair Cut', 'Layering', 'Fringes'],
    experience: 10,
  },
  {
    name: 'Ishaan Khanna',
    email: 'ishaan.khanna@moonlit.com',
    phone: '+91 98765 43219',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Unisex stylist specializing in modern cuts and beard grooming.',
    specialization: ['Men Haircut', 'Beard Grooming', 'Hair Styling'],
    experience: 5,
  },
  {
    name: 'Aarav Malhotra',
    email: 'aarav.malhotra@moonlit.com',
    phone: '+91 98765 43220',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Expert in hair spa treatments and rejuvenation therapies.',
    specialization: ['Hair Spa', 'Deep Conditioning', 'Smoothening'],
    experience: 6,
  },
  {
    name: 'Riya Chatterjee',
    email: 'riya.chatterjee@moonlit.com',
    phone: '+91 98765 43221',
    profilePic: 'https://randomuser.me/api/portraits/women/10.jpg',
    bio: 'Lash and brow specialist with an eye for detail.',
    specialization: ['Lash Extensions', 'Brow Tinting', 'Lash Lift'],
    experience: 4,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const hashedPassword = await bcrypt.hash('Stylist@123', 10);

    let created = 0;
    let skipped = 0;

    for (const s of stylists) {
      const existing = await User.findOne({ email: s.email });
      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${s.email}`);
        skipped++;
        continue;
      }

      const user = await User.create({
        name: s.name,
        email: s.email,
        phone: s.phone,
        profilePic: s.profilePic,
        password: hashedPassword,
        role: 'stylist',
        isEmailVerified: true,
      });

      await StylistProfile.create({
        userId: user._id,
        bio: s.bio,
        specialization: s.specialization,
        experience: s.experience,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0 random rating
      });

      console.log(`✅ Created: ${s.name} (${s.email})`);
      created++;
    }

    console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
    console.log(`\n🔑 Login password for all stylists: Stylist@123`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();
