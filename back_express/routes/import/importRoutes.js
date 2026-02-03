const express = require("express");
const multer = require("multer");
// const { importEmployees } = require("../../controllers/import/importController");
const { importItemCSV, importCSV, importBomCSV, importPurchaseCSV, importWorkOrderCSV, importSalesCSV, importEmployeeCSV, importSalaryStructureCSV, importSalarySlipCSV, importAttendanceCSV, importSeparationCSV, importTimesheetCSV, importAssetCSV } = require("../../controllers/import/importController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/items", upload.single("file"), importItemCSV);
router.post("/parties", upload.single("file"), importCSV);

router.post("/purchases", upload.single("file"), importPurchaseCSV);
router.post("/boms", upload.single("file"), importBomCSV);
router.post("/workorders", upload.single("file"), importWorkOrderCSV);
router.post("/sales", upload.single("file"), importSalesCSV);
router.post("/sales", upload.single("file"), importSalesCSV);
router.post("/employees", upload.single("file"), importEmployeeCSV);
router.post("/salary-structures", upload.single("file"), importSalaryStructureCSV);
router.post("/salary-slips", upload.single("file"), importSalarySlipCSV);
router.post("/attendances", upload.single("file"), importAttendanceCSV);
router.post("/assets", upload.single("file"), importAssetCSV);
router.post("/timesheets", upload.single("file"), importTimesheetCSV);
router.post("/separations", upload.single("file"), importSeparationCSV);
module.exports = router;
