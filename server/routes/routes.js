const express = require('express');
const router = express.Router();
const User = require("../models/UsersModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authenticate = require('../Authentication/Authentication');
const cloudinary = require('cloudinary').v2;

const JWT_SECRET = process.env.JWT_SECRET;

cloudinary.config({
    cloud_name: process.env.CLOUT_NAME,
    api_key: process.env.CLOUT_API_KEY,
    api_secret: process.env.CLOUT_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Verify user
router.post('/verify-token', authenticate, (req, res) => {
    res.json({
        isAuthenticated: true,
    });
});

// See add car
router.post('/addCar', authenticate, upload.array('image', 10), async (req, res) => {
    try {
        const imageUrls = [];

        const uploadToCloudinary = async (file) => {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                reject('Error uploading to Cloudinary: ' + error.message);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(file.buffer);
                });

                return result.secure_url;
            } catch (error) {
                console.error(error);
                throw new Error('Error uploading image');
            }
        };


        for (let i = 0; i < req.files.length; i++) {
            const imageUrl = await uploadToCloudinary(req.files[i]);
            imageUrls.push(imageUrl);
        }

        const { title, description, tags } = req.body;
        console.log(title, description, tags, imageUrls);
        const newCar = {
            title,
            description,
            tags,
            images: imageUrls,
            createdAt: new Date(),
        };


        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.cars.push(newCar);

        await user.save();

        res.status(200).json({ message: 'Car details added successfully' });

    } catch (error) {
        console.error('Error during image upload or saving car details:', error);
        res.status(500).json({ error: 'Error uploading image or saving car details' });
    }
});

// See all cars
router.get('/allCars', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const carDetails = user.cars;

        res.status(200).json(carDetails);
    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).json({ error: 'Error fetching car details' });
    }
});

// See car
router.get("/carDetails/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const car = user.cars.id(id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json(car);
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Car
router.put("/carDetails/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const car = user.cars.id(id);
        if (!car) return res.status(404).json({ message: "Car not found" });

        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags || car.tags;

        await user.save();
        res.json(car);
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Car
router.delete("/carDetails/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const carIndex = user.cars.id(id);
        if (!carIndex) return res.status(404).json({ message: "Car not found" });

        user.cars.pull(id);

        await user.save();

        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        return res.json({ message: 'Login successful', token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Docs
router.get("/docs", (req, res) => {
    res.send("Docs");
})


module.exports = router;
