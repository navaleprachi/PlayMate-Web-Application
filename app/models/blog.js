import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Blog Schema with all the required fiields
const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        get: function (date) {
            // Format the date as "MM/dd/yyyy" when retrieving from the database
            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            });
        }
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    });

// Exporting the model created
const BlogModel = mongoose.model('blog', BlogSchema);
export default BlogModel;