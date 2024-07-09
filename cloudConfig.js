const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// here we pass configuration details
// configuration means cheezo ko jodna 
// .env me to hum --> keys ke kuch bhi naam rkh skte hai --> but yaha (cloudConfig.js) me bydefault isi style se and yhi naam rkhne hote hai

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


// jaise google drive pr ek folder bna lia jisme hum files ko upload kr rhe hai
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});


module.exports = {
    cloudinary,
    storage
}

