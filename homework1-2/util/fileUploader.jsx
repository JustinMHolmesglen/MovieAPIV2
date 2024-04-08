module.exports = {
    fileUploader(file, location, filename) {
        console.log(file);
        let ext = file.name.split('.').pop()
        ext = "." + ext.toLowerCase()
        const filePath = location + Date.now() + '_' + filename + ext
        file.mv(filePath)
        return filePath
    },
    validateFile(file, maxSize, fileTypes) {
        if (!file) {
            return ({ error: "No file uploaded" })
        }
        if (file.size > maxSize) {
            return ({ error: "The file is to large" })
        }
        console.log(file)
        const ext = file.name.split('.').pop().toLowerCase();
        if (!fileTypes.includes(ext)) {
          return { error: `Please upload a file with one of the following extensions: ${fileTypes.join("jpg, png")}` };
        }
    }
}