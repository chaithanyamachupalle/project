const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(value) {
                // Regex to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format'
        }
    },
    phoneNumber: {
        type: String, // Changed from Number to String to apply regex validation
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
            validator: function(value) {
                // Regex to validate phone number format (10 digits)
                const phonePattern = /^\d{10}$/;
                return phonePattern.test(value);
            },
            message: 'Phone number must be 10 digits'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
});

// Export the model
module.exports = mongoose.model('User', userSchema);
