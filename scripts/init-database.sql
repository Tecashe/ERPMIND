-- Kenya ERP Database Schema
-- Comprehensive multi-module ERP system with Kenya-specific features

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Companies/Organizations
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  kra_pin VARCHAR(20) UNIQUE,
  registration_number VARCHAR(50) UNIQUE,
  industry VARCHAR(100),
  country_code VARCHAR(2) DEFAULT 'KE',
  currency_code VARCHAR(3) DEFAULT 'KES',
  fiscal_year_start_month INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules/Subscriptions
CREATE TABLE IF NOT EXISTS erp_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50), -- finance, sales, inventory, hr, procurement, production, crm, reporting, fixed_assets, tax_compliance
  price_per_user_monthly DECIMAL(10, 2),
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Module Subscriptions
CREATE TABLE IF NOT EXISTS company_module_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES erp_modules(id) ON DELETE CASCADE,
  num_users INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, module_id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, email)
);

-- ============================================================================
-- FINANCE & ACCOUNTING MODULE
-- ============================================================================

-- General Ledger Accounts
CREATE TABLE IF NOT EXISTS gl_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50), -- asset, liability, equity, revenue, expense
  subaccount_type VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  opening_balance DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  posting_date DATE,
  description VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft', -- draft, posted
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entry Lines
CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  gl_account_id UUID NOT NULL REFERENCES gl_accounts(id),
  debit_amount DECIMAL(18, 2) DEFAULT 0,
  credit_amount DECIMAL(18, 2) DEFAULT 0,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  account_number VARCHAR(50) NOT NULL,
  account_type VARCHAR(50), -- checking, savings
  currency_code VARCHAR(3) DEFAULT 'KES',
  swift_code VARCHAR(20),
  iban VARCHAR(50),
  balance DECIMAL(18, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, account_number)
);

-- Bank Transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
  transaction_date DATE NOT NULL,
  description VARCHAR(500),
  reference VARCHAR(50),
  amount DECIMAL(18, 2) NOT NULL,
  transaction_type VARCHAR(50), -- deposit, withdrawal, transfer, fee
  status VARCHAR(50) DEFAULT 'pending', -- pending, reconciled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices (AP/AR)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  invoice_type VARCHAR(50), -- sales, purchase
  invoice_date DATE NOT NULL,
  due_date DATE,
  party_id UUID, -- Can reference customer or supplier
  description TEXT,
  subtotal DECIMAL(18, 2) DEFAULT 0,
  tax_amount DECIMAL(18, 2) DEFAULT 0,
  total_amount DECIMAL(18, 2) DEFAULT 0,
  paid_amount DECIMAL(18, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, received, paid, overdue
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, invoice_number)
);

-- ============================================================================
-- SALES & DISTRIBUTION MODULE
-- ============================================================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  pin_number VARCHAR(20),
  kra_pin VARCHAR(20),
  billing_address TEXT,
  shipping_address TEXT,
  country VARCHAR(100) DEFAULT 'Kenya',
  city VARCHAR(100),
  postal_code VARCHAR(20),
  credit_limit DECIMAL(18, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Orders
CREATE TABLE IF NOT EXISTS sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_date DATE NOT NULL,
  delivery_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, confirmed, shipped, delivered, cancelled
  subtotal DECIMAL(18, 2) DEFAULT 0,
  tax_amount DECIMAL(18, 2) DEFAULT 0,
  total_amount DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, order_number)
);

-- Sales Order Items
CREATE TABLE IF NOT EXISTS sales_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id UUID,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(18, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  line_total DECIMAL(18, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INVENTORY MANAGEMENT MODULE
-- ============================================================================

-- Products/Items
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_of_measure VARCHAR(20) DEFAULT 'pcs', -- pcs, kg, liters, etc
  reorder_level INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, code)
);

-- Stock Levels
CREATE TABLE IF NOT EXISTS stock_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  quantity_on_hand INTEGER DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_available INTEGER DEFAULT 0,
  last_count_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, product_id, warehouse_id)
);

-- Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  movement_type VARCHAR(50), -- receipt, issue, adjustment, return
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- sales_order, purchase_order, adjustment
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- HUMAN RESOURCES & PAYROLL MODULE
-- ============================================================================

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  national_id VARCHAR(20),
  kra_pin VARCHAR(20),
  nssf_number VARCHAR(20),
  nhif_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  employment_type VARCHAR(50), -- permanent, contract, casual
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, terminated
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(100),
  salary_currency VARCHAR(3) DEFAULT 'KES',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id)
);

-- Employee Salary Structure
CREATE TABLE IF NOT EXISTS salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  effective_date DATE NOT NULL,
  basic_salary DECIMAL(18, 2) NOT NULL,
  house_allowance DECIMAL(18, 2) DEFAULT 0,
  transport_allowance DECIMAL(18, 2) DEFAULT 0,
  meal_allowance DECIMAL(18, 2) DEFAULT 0,
  other_allowances DECIMAL(18, 2) DEFAULT 0,
  total_allowances DECIMAL(18, 2) GENERATED ALWAYS AS (house_allowance + transport_allowance + meal_allowance + other_allowances) STORED,
  gross_salary DECIMAL(18, 2) GENERATED ALWAYS AS (basic_salary + house_allowance + transport_allowance + meal_allowance + other_allowances) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id, effective_date)
);

-- Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  payroll_period VARCHAR(20) NOT NULL, -- e.g., 2024-03
  payment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, processed, paid
  total_gross DECIMAL(18, 2) DEFAULT 0,
  total_deductions DECIMAL(18, 2) DEFAULT 0,
  total_net DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Details
CREATE TABLE IF NOT EXISTS payroll_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  gross_salary DECIMAL(18, 2),
  paye_tax DECIMAL(18, 2) DEFAULT 0,
  nssf_contribution DECIMAL(18, 2) DEFAULT 0,
  nhif_deduction DECIMAL(18, 2) DEFAULT 0,
  other_deductions DECIMAL(18, 2) DEFAULT 0,
  total_deductions DECIMAL(18, 2) GENERATED ALWAYS AS (paye_tax + nssf_contribution + nhif_deduction + other_deductions) STORED,
  net_salary DECIMAL(18, 2) GENERATED ALWAYS AS (gross_salary - total_deductions) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type VARCHAR(50), -- annual, sick, maternity, unpaid
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  attendance_date DATE NOT NULL,
  status VARCHAR(50), -- present, absent, late, half_day
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id, attendance_date)
);

-- ============================================================================
-- PROCUREMENT & PURCHASE MODULE
-- ============================================================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  kra_pin VARCHAR(20),
  registration_number VARCHAR(50),
  billing_address TEXT,
  shipping_address TEXT,
  country VARCHAR(100) DEFAULT 'Kenya',
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  po_number VARCHAR(50) NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  po_date DATE NOT NULL,
  expected_delivery_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, confirmed, received, cancelled
  subtotal DECIMAL(18, 2) DEFAULT 0,
  tax_amount DECIMAL(18, 2) DEFAULT 0,
  total_amount DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, po_number)
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(18, 2) NOT NULL,
  line_total DECIMAL(18, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PRODUCTION MODULE
-- ============================================================================

-- Bill of Materials (BOM)
CREATE TABLE IF NOT EXISTS bill_of_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  finished_product_id UUID NOT NULL REFERENCES products(id),
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, finished_product_id, version)
);

-- BOM Items
CREATE TABLE IF NOT EXISTS bom_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_id UUID NOT NULL REFERENCES bill_of_materials(id) ON DELETE CASCADE,
  raw_material_id UUID NOT NULL REFERENCES products(id),
  quantity_required DECIMAL(10, 3) NOT NULL,
  unit_of_measure VARCHAR(20),
  waste_percentage DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Orders
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  po_number VARCHAR(50) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity_ordered INTEGER NOT NULL,
  quantity_produced INTEGER DEFAULT 0,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, po_number)
);

-- ============================================================================
-- CRM MODULE
-- ============================================================================

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  industry VARCHAR(100),
  lead_source VARCHAR(100), -- website, referral, marketing, cold_call, trade_show
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, proposal, lost
  assigned_to UUID REFERENCES users(id),
  expected_value DECIMAL(18, 2),
  probability_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  lead_id UUID REFERENCES leads(id),
  stage VARCHAR(50), -- prospecting, qualification, proposal, negotiation, closed_won, closed_lost
  expected_value DECIMAL(18, 2),
  close_date DATE,
  probability_percentage INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- FIXED ASSETS MODULE
-- ============================================================================

-- Asset Classes
CREATE TABLE IF NOT EXISTS asset_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  useful_life_years INTEGER,
  depreciation_method VARCHAR(50), -- straight_line, declining_balance
  salvage_percentage DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, name)
);

-- Fixed Assets
CREATE TABLE IF NOT EXISTS fixed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  asset_code VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  asset_class_id UUID NOT NULL REFERENCES asset_classes(id),
  gl_account_id UUID REFERENCES gl_accounts(id),
  acquisition_date DATE NOT NULL,
  acquisition_cost DECIMAL(18, 2) NOT NULL,
  location VARCHAR(255),
  custodian_employee_id UUID REFERENCES employees(id),
  status VARCHAR(50) DEFAULT 'active', -- active, disposed, retired
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, asset_code)
);

-- Asset Depreciation
CREATE TABLE IF NOT EXISTS asset_depreciation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixed_asset_id UUID NOT NULL REFERENCES fixed_assets(id) ON DELETE CASCADE,
  depreciation_period VARCHAR(20), -- YYYY-MM
  depreciation_amount DECIMAL(18, 2) NOT NULL,
  accumulated_depreciation DECIMAL(18, 2),
  book_value DECIMAL(18, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TAX & COMPLIANCE MODULE (KENYA-SPECIFIC)
-- ============================================================================

-- Tax Configuration
CREATE TABLE IF NOT EXISTS tax_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tax_type VARCHAR(50), -- vat, corporate_tax, excise_duty, withholding_tax
  tax_percentage DECIMAL(5, 2) NOT NULL,
  effective_date DATE,
  is_active BOOLEAN DEFAULT true,
  kra_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, tax_type, effective_date)
);

-- VAT Returns (Kenya specific)
CREATE TABLE IF NOT EXISTS vat_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  return_period VARCHAR(20) NOT NULL, -- YYYY-QQ or YYYY-MM
  total_output_tax DECIMAL(18, 2),
  total_input_tax DECIMAL(18, 2),
  net_vat_payable DECIMAL(18, 2),
  status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved
  kra_reference VARCHAR(100),
  submission_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, return_period)
);

-- ============================================================================
-- MOBILE MONEY & PAYMENT INTEGRATION (KENYA-SPECIFIC)
-- ============================================================================

-- Mobile Money Settings
CREATE TABLE IF NOT EXISTS mobile_money_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider VARCHAR(50), -- mpesa, airtel_money, equity_bank_ussd
  account_number VARCHAR(50),
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, provider)
);

-- Mobile Money Transactions
CREATE TABLE IF NOT EXISTS mobile_money_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  transaction_reference VARCHAR(50) UNIQUE,
  provider VARCHAR(50),
  customer_phone VARCHAR(20),
  amount DECIMAL(18, 2),
  currency VARCHAR(3) DEFAULT 'KES',
  transaction_type VARCHAR(50), -- payment, refund, payout
  status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
  related_invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MULTI-CURRENCY SUPPORT
-- ============================================================================

-- Exchange Rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(18, 6) NOT NULL,
  rate_date DATE NOT NULL,
  source VARCHAR(100), -- CBK, NBK, manual
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, from_currency, to_currency, rate_date)
);

-- ============================================================================
-- LOCAL BANKING INTEGRATION (KENYA-SPECIFIC)
-- ============================================================================

-- Bank Integration Settings
CREATE TABLE IF NOT EXISTS bank_integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  bank_name VARCHAR(100), -- Equity, KCB, Stanbic, I&M, Absa
  api_endpoint VARCHAR(500),
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, bank_name)
);

-- ============================================================================
-- REPORTING & ANALYTICS
-- ============================================================================

-- Financial Reports
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  report_type VARCHAR(50), -- balance_sheet, income_statement, cash_flow, trial_balance
  report_date DATE NOT NULL,
  report_data JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_companies_kra_pin ON companies(kra_pin);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_journal_entries_company_id ON journal_entries(company_id);
CREATE INDEX idx_journal_entries_posting_date ON journal_entries(posting_date);
CREATE INDEX idx_sales_orders_company_id ON sales_orders(company_id);
CREATE INDEX idx_sales_orders_customer_id ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_purchase_orders_company_id ON purchase_orders(company_id);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_stock_movements_company_id ON stock_movements(company_id);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_payroll_runs_company_id ON payroll_runs(company_id);
CREATE INDEX idx_payroll_runs_payroll_period ON payroll_runs(payroll_period);
CREATE INDEX idx_bank_transactions_bank_account_id ON bank_transactions(bank_account_id);
CREATE INDEX idx_bank_transactions_transaction_date ON bank_transactions(transaction_date);
CREATE INDEX idx_mobile_money_transactions_company_id ON mobile_money_transactions(company_id);
CREATE INDEX idx_mobile_money_transactions_status ON mobile_money_transactions(status);
CREATE INDEX idx_vat_returns_company_id ON vat_returns(company_id);
CREATE INDEX idx_company_module_subscriptions_company_id ON company_module_subscriptions(company_id);
CREATE INDEX idx_company_module_subscriptions_is_active ON company_module_subscriptions(is_active);

-- ============================================================================
-- DEFAULT MODULES
-- ============================================================================

INSERT INTO erp_modules (name, description, category, price_per_user_monthly, icon) VALUES
  ('Finance & Accounting', 'General Ledger, Accounts Payable/Receivable, Banking', 'finance', 15000, '💼'),
  ('Sales & Distribution', 'Sales Orders, Quotations, Customer Management', 'sales', 12000, '📊'),
  ('Inventory Management', 'Stock Tracking, Warehouses, Goods Receipt/Issue', 'inventory', 10000, '📦'),
  ('Human Resources', 'Employee Records, Payroll, Attendance, Leave Management', 'hr', 18000, '👥'),
  ('Procurement', 'Purchase Orders, Supplier Management, RFQ', 'procurement', 10000, '🛒'),
  ('Production', 'Bill of Materials, Production Orders, Scheduling', 'production', 14000, '⚙️'),
  ('CRM', 'Leads, Opportunities, Customer Interactions', 'crm', 12000, '🎯'),
  ('Tax & Compliance', 'VAT, KRA Reporting, Withholding Tax', 'tax_compliance', 8000, '📋'),
  ('Fixed Assets', 'Asset Management, Depreciation Tracking', 'fixed_assets', 6000, '🏢'),
  ('Reporting & Analytics', 'Dashboard, Financial Reports, KPIs', 'reporting', 10000, '📈')
ON CONFLICT DO NOTHING;
