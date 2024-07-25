// Import the Mongoose library for MongoDB schema and model creation
import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create a schema for the sports entries within a user's personalized profile
const SportSchema = new Schema({
    // Define the type and required constraint for all fields
    sports_interest: {
        type: String,
        required: true
    },
    skill_level: {
        type: String,
        required: true
    },
    play_frequency: {
        type: String,
        required: true
    }
});

// Create a schema for the entire personalized profile
const PersonalizedProfileSchema = new Schema({
     // Define the type and required constraint for all fields
    dynamic_Id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    sports_entries: [SportSchema]
},
{
    // Disable the version key in the MongoDB documents
    versionKey: false
});

// Create a Mongoose model named 'PersonalizedProfile' based on the defined schema
const PersonalizedProfileModel = mongoose.model('personalizedProfile', PersonalizedProfileSchema);

// Export the PersonalizedProfileModel for use in other parts of the application
export default PersonalizedProfileModel;
