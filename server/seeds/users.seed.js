import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import User from "../models/user.model.js";
import { connectDB } from "../lib/dbConnection.js";


const seedUsers = [
  // Female Users
  {
    email: "emmathompson@example.com",
    fullName: "Emma Thompson",
    password: "12345610",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "oliviamiller@example.com",
    fullName: "Olivia Miller",
    password: "12345601",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophiadavis@example.com",
    fullName: "Sophia Davis",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "avawilson@example.com",
    fullName: "Ava Wilson",
    password: "123456009",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabellabrown@example.com",
    fullName: "Isabella Brown",
    password: "123456121",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "miajohnson@example.com",
    fullName: "Mia Johnson",
    password: "12345667",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlottewilliams@example.com",
    fullName: "Charlotte Williams",
    password: "123400056",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "ameliagarcia@example.com",
    fullName: "Amelia Garcia",
    password: "1345623456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },


  // Male Users
  {
    email: "jamesanderson@example.com",
    fullName: "James Anderson",
    password: "1237875456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "williamclark@example.com",
    fullName: "William Clark",
    password: "123097456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamintaylor@example.com",
    fullName: "Benjamin Taylor",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucasmoore@example.com",
    fullName: "Lucas Moore",
    password: "123676456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henryjackson@example.com",
    fullName: "Henry Jackson",
    password: "12023456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    fullName: "Alexander Martin",
    password: "1300023456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    fullName: "Daniel Rodriguez",
    password: "12883456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];


const seedDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();