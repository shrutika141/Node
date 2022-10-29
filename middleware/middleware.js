
module.exports = {
    ImageUpload: (req, res, imageName) => {
        console.log(imageName);
        console.log(req.files.img.path);
        const oldPath = req.files.img.path;
        const newPath = `${path.join(
			__dirname,
			"../public/assets/"
		)}/${imageName}`;
        const rawData = fs.readFileSync(oldPath);
        console.log(newPath);
        // eslint-disable-next-line consistent-return
        fs.writeFile(newPath, rawData, err => {
            if (err) {
                console.log(err);
                return Response.errorResponseData(
                    res,
                    res.__("somethingWentWrong"),
                    500
                );
            }
        });
    },
}