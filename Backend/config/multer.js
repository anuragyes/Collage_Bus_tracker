import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.post("/signup", upload.fields([
  { name: "aadhaar", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]), driverSignup);