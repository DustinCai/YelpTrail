const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');  

// to prevent XSS 
const extension = (joi) => ({
    type: 'string', 
    base: joi.string(), 
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [], 
                    allowedAttributes: {},
                }); 
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean; 
            }
        }
    }
})


// blueprint of our database 

const Joi = BaseJoi.extend(extension); 
module.exports.campgroundSchema = Joi.object({
    // using joi methods to define our pattern
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(), 
        price: Joi.number().required().min(0), 
        location: Joi.string().required().escapeHTML(), 
        description: Joi.string().required().escapeHTML(), 
    }).required(), 
    deleteImages: Joi.array() 
}); 


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), 
        body: Joi.string().required().escapeHTML(), 
    }).required()
});