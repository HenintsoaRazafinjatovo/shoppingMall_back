require('dotenv').config();
const express = require('express');
const cors = require('cors');

// endPoints
const itemRoutes = require('./routes/erp/itemRoutes');
const customerRoutes = require('./routes/erp/customerRoutes');
const supplierRoutes = require('./routes/erp/supplierRoutes');
const purchaseInvoiceRoutes = require('./routes/erp/purchaseInvoiceRoutes');
const salesInvoiceRoutes = require('./routes/erp/salesInvoiceRoutes');
const bomRoutes = require('./routes/erp/BOMRoutes');
const workOrderRoutes = require('./routes/erp/workOrderRoutes');
const EmployeeSeparationRoutes = require('./routes/erp/employeeSeparationRoutes');
const attendanceRoutes = require('./routes/erp/attendanceRoutes');
const employeeRoutes = require('./routes/erp/employeeRoutes');
const timesheetRoutes = require('./routes/erp/timesheetRoutes');
const salarySlipRoutes = require('./routes/erp/salarySlipRoutes');
const salaryStructureRoutes = require('./routes/erp/salaryStructureRoutes');
const salaryComponentRoutes = require('./routes/erp/salaryComponentRoutes');
const binRoutes = require('./routes/erp/binRoutes');

const authRoutes = require('./routes/auth/AuthRoutes');


const importRoutes = require("./routes/import/importRoutes");

const resetRoutes = require("./routes/reset/resetRoutes");

const userRoutes = require("./routes/app/userRoutes");
const companyRoutes = require("./routes/app/companyRoutes");


const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/items', itemRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-invoices", purchaseInvoiceRoutes);
app.use("/api/sales-invoices", salesInvoiceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/boms", bomRoutes);
app.use("/api/work-orders", workOrderRoutes);
app.use("/api/employee-separations", EmployeeSeparationRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/salary-slips", salarySlipRoutes);
app.use("/api/salary-structures", salaryStructureRoutes);
app.use("/api/salary-components", salaryComponentRoutes);
app.use("/api/bins", binRoutes);

app.use('/api/auth', authRoutes);

app.use("/api/import", importRoutes);
app.use("/api/reset", resetRoutes);


app.use("/api/app", userRoutes);
app.use("/api/app", companyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
