import * as fs from "fs";
import * as path from "path";

export function removeFile(fileName: string) {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName);
    return true;
  } else {
    return null;
  }
};

export function moveFile(oldPath: string, newPath: string) {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    return true;
  } else {
    return false;
  }
};


export function removeFolder(sourcePath: string) {
  if (!fs.existsSync(sourcePath)) { return false; }

  const source = path.resolve(sourcePath);
  if (fs.existsSync(source)) {
      const files = fs.readdirSync(source);
      for (const file of files) {
          const fileName = path.join(source, file);
          const stat = fs.lstatSync(fileName);
    
          if (stat.isDirectory()) {
          
              removeFolder(fileName);
          } else {
              removeFile(fileName);
          }
      }
      fs.rmdirSync(source);
      return true;
  } else {
      return null;
  }
};

export function copyFolder(source: string, destination: string) {
  // check if source exists
  if (!fs.existsSync(source)) {
      return false;
  }
  // check if destination exists
  if (!fs.existsSync(destination)) {
      return createDirectoryPath(destination);
  }
  // get all file names in the directory and iterate through them
  const files = fs.readdirSync(source);
  for (const file of files) {
      const fileName = path.join(source, file);
      const destinationFileName = path.join(destination, file);
      const stat = fs.lstatSync(fileName);
      // check if file is a directory
      if (stat.isDirectory()) {
          // recursive check if it contains files
          return copyFolder(fileName, destinationFileName);
      } else {
          const readFile = fs.createReadStream(fileName);
          const writeFile = fs.createWriteStream(destinationFileName);
          readFile.pipe(writeFile);
      }
  }
  return true;
};

export function createFolder(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    return true;
  }
  return null;
}

export function createDirectoryPath(dirPath: string) {
  const resolvedPath = path.resolve(dirPath);
  const directories = resolvedPath.split(/[\/\\]/g);
  let currentDir = directories[0].length ? directories[0] : "/";
  for (let i = 1; i < directories.length; i++) {
      currentDir = path.join(currentDir, directories[i]);
      createFolder(currentDir);
  }
  return true;
};