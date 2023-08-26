const tf = require('@tensorflow/tfjs');
const classes = require('./class_name');

const TOP_K = 1;

async function predictImage(imageData){
    const model = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    )

    const uni8Array = new Uint8Array(imageData.buffer);
    const decodeImageData = tf.node.decodeImage(uni8Array);
    const resizedImage = tf.image.resizeBilinear(decodeImageData);
    const normalizedImage = resizedImage.div(255.0).expandDims();

    const prediction = model.predict(normalizedImage);

    const topK = await prediction.topk(TOP_K);
    const classIndex = topK.indices.dataSync()[0];
    const label = classes[classIndex];

    return {classIndex,label}

}

module.exports = predictImage;