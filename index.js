const express = require('express')
const multer = require('multer');
const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');
const predictImage = require('./imageProcess');

const app = express()

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.post('/image',upload.single('image'), async (req, res) => {
    const bufferImg = req.file.buffer;
    console.log(bufferImg);
    // const decodedImage = tf.node.decodeImage(bufferImg);

    if (!/^image\/(jpe?g|png|gif)$/i.test(req.file.mimetype)){
        console.log('unsupported image type: ' + req.file.mimetype);
        res.json({error: 'unsupported image type: ' + req.file.mimetype})
    }

    const resizeImage = await sharp(bufferImg).resize(224,224).toBuffer();

    const result = await predictImage(resizeImage)
    res.send(result)
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})