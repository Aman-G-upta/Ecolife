require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const demoUsers = [
    { name: "Aarav Mehta", email: "aarav.demo@ecolife.ai", greenScore: 480, streak: 12, badges: ["Early Bird", "Streak Master"] },
    { name: "Priya Nair", email: "priya.demo@ecolife.ai", greenScore: 410, streak: 8, badges: ["Recycler"] },
    { name: "Kabir Shah", email: "kabir.demo@ecolife.ai", greenScore: 355, streak: 5, badges: [] },
    { name: "Ishita Rao", email: "ishita.demo@ecolife.ai", greenScore: 290, streak: 3, badges: ["First Log"] },
    { name: "Devansh Iyer", email: "devansh.demo@ecolife.ai", greenScore: 210, streak: 2, badges: [] },
    { name: "Meera Kapoor", email: "meera.demo@ecolife.ai", greenScore: 150, streak: 1, badges: [] },
    { name: "Rohan Bose", email: "rohan.demo@ecolife.ai", greenScore: 95, streak: 0, badges: [] },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected for seeding...");

        const password = await bcrypt.hash("demoPass123", 10);

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`Skipping ${u.email}, already exists`);
                continue;
            }
            await User.create({ ...u, password });
            console.log(`Created ${u.name}`);
        }

        console.log("Done seeding demo users.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();