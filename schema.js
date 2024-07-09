const Joi = require('joi');

// listing: Joi.object().required() --> mtlb listing name ki object honi hi chahiye (required) 


// pta nhi image me dikkt agyi --> hopscotch se sb shi chl rha hai--> lekin form se (validation error: listing.image.url not allowed) likha aa rha hai



const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow("", null).required()
        }),
    }).required()
});



const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        created_at: Joi.date().allow("", null)
    }).required()
})


module.exports = { listingSchema, reviewSchema };