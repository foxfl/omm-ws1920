var express = require("express");
var router = express.Router();
const fsPromises = require("fs").promises;
const path = require("path");
const nodeUrl = require("url");

const databsePath = path.resolve(__dirname, "../data/imagedatabase.json");

const makeUploadPath = (fileName) =>
  path.resolve(__dirname, `../uploads/${fileName}`);

async function writeToDatabase(newImage) {
  return fsPromises
    .readFile(databsePath)
    .then((data) => {
      var json = JSON.parse(data);
      json.push(newImage);

      return fsPromises.writeFile(databsePath, JSON.stringify(json));
    })
    .catch((err) => false);
}

/* GET images listing. */
router.get("/:category?", function(req, res, next) {
  fsPromises
    .readFile(databsePath)
    .then((data) => {
      const imageDatabase = JSON.parse(data);
      const category = req.params.category;
      const location = req.query.location;
      let filteredImages = imageDatabase;
      if (category) {
        filteredImages = imageDatabase.filter((image) =>
          image.categories.includes(category)
        );
      }
      if (location) {
        filteredImages = filteredImages.filter((image) =>
          image.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      res.json({ images: filteredImages });
    })
    .catch((error) => res.status(500).send("Error accessing database"));
});

router.post("/:category", async (req, res, next) => {
  const category = req.params.category;
  const {
    files: { image } = {},
    body: { url, location = "" }
  } = req || {};
  if (!category) {
    res.status(400).send("Category is required for image upload");
  }

  if (url) {
    console.log("url present");
    await writeToDatabase({
      url,
      location,
      categories: [category]
    });
    res.status(200).send("Uploaded Image");
  } else if (image) {
    const { name, mv } = image;
    mv(makeUploadPath(name), async function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      await writeToDatabase({
        url: nodeUrl.format({
          protocol: req.protocol,
          host: req.get("host"),
          pathname: name
        }),
        location,
        categories: [category]
      });
      res.status(200).send("Uploaded Image");
    });
  } else {
    res.status(400).send("url or image is required");
  }
});

module.exports = router;
