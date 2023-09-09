import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
    templateType: {
        type: String,
        enum: ['login', 'signup'],
        default: 'login'
    },
    language: {
        type: String,
        required: true
    },
    templateId: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    senderEmail: {
        type: String,
        required: true,
       
    },
    senderName: {
        type: String,
        required: true
    }
}, { timestamps: true });


const template = mongoose.model('template', templateSchema)

export default template
