import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, isImage } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user

  app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("hello");
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res
        .status(400)
        .json({ success: false, message: "Please supply an Image url" });
    }

    //validate image
    //@ts-ignore
    if (!isImage(image_url)) {
      return res
        .status(400)
        .json({ success: false, message: "Please supply a valid image url " });
    }

    //filter image
    //@ts-ignore
    filterImageFromURL(image_url).then((imagePath) => {
      res.status(200).sendFile(imagePath, () => {
        deleteLocalFiles([imagePath]);
      });
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
