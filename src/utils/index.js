export const validateFile = (file) => {
    if (file.size >= 1.5 * 1024 * 1024) {
        throw Error("File size must be less than 1.5MB");
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)) {
        throw Error("Unsupported file format. Please upload JPG, PNG, or GIF");
    }
    return
}

export const logoIconUpdate = async (file) => {
    try {
        if (file && file.logo) {
            const logo = file.logo;
            validateFile(logo);
            const ab = await logo.arrayBuffer();
            const buf = new Uint8Array(ab)
            let path = imagePath();
            path = 'public/' + path.logoIcon.path;
            await uploadImage(buf, path, null, null, 'logo.png')
        }
        if (file && file.favicon) {
            const favicon = file.favicon;
            validateFile(favicon);
            const ab = await favicon.arrayBuffer();
            const buf = new Uint8Array(ab)
            const path = imagePath();
            await uploadImage(buf, 'public/' + path.logoIcon.path, path.favicon.size, null, 'favicon.png')
        }
        return { message: 'Logo & favicon has been updated' };
    }
    catch (error) {
        return { error: error.message };
    }
}

export const verificationCode = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getNumber = (length = 8) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

export const imagePath = () => {
    let data = {}
    data['image'] = {
        default: 'images/default.png',
    }
    data['logoIcon'] = {
        path: 'images/logoIcon',
    }
    data['favicon'] = {
        size: '128x128',
    }
    data['extensions'] = {
        path: 'images/extensions',
        size: '36x36',
    }
    data['seo'] = {
        path: 'images/seo',
        size: '600x315'
    }
    data['profile'] = {
        user: {
            path: 'images/user/profile',
            size: '350x300'
        },
        admin: {
            path: 'admin/images/profile',
            size: '400x400'
        }
    }
    return data
}

export const getImage = async (image, size = null) => {
    const imagePath = path.join(process.cwd(), `public/${image}`);
    if (fs.existsSync(imagePath)) {
        return `/${image}`;
    }
    return `/images/default.png`;
};

// vercel_blob_rw_JmvPRqI3cZj5CAV5_mkABTozTeV3c8nmIOV3zGHxuBlAKb2

/*


export const uploadImage = async (file, location, size = null, oldFile = null, fname = null) => {
  const uploadPath = path.join(process.cwd(), location);
  fs.mkdirSync(uploadPath, { recursive: true });
  if (oldFile) {
    removeFile(path.join(uploadPath, oldFile));
  }
  
  const filename = fname ? fname : `${Date.now()}-${randomBytes(4).toString('hex')}.jpg`;
  const filePath = path.join(uploadPath, filename);

  const image = sharp(file);
  if (size) {
    const [width, height] = size.split('x').map(Number);
    await image.resize({width, height, fit: 'inside', withoutEnlargement:true}).toFile(filePath);
  } else {
    await image.toFile(filePath);
  }
  return filename;
};

// Function to upload general files
export const uploadFile = async (file, location, oldFile = null) => {
  const uploadPath = path.join(process.cwd(), location);
  fs.mkdirSync(uploadPath, { recursive: true });
  if (oldFile) removeFile(path.join(uploadPath, oldFile));

  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}.${file.mimetype.split('/')[1]}`;
  fs.writeFileSync(path.join(uploadPath, filename), file.buffer);
  return filename;
};

// Function to remove a file
export const removeFile = async (filePath, r=false) => {
  if (r) {
    const removePath = path.join(process.cwd(), 'public/' + filePath);
    if (fs.existsSync(removePath)) fs.unlinkSync(removePath);
  }else{
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

*/