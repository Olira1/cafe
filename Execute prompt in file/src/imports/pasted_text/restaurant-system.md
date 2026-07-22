You are an expert Senior React Architect, Senior UI/UX Designer, and Senior Frontend Engineer.

Your task is to build a complete Restaurant Management System frontend only.

Technology Stack

- React 19
- React Router
- Vite
- JavaScript (No TypeScript)
- Material UI (MUI)
- React Hook Form
- Context API
- LocalStorage as temporary database
- Responsive Design
- Modern Dashboard UI
- Clean Folder Structure
- Reusable Components
- Professional Enterprise Design

This is NOT a demo UI.

Every page must be fully functional using localStorage.

Pretend localStorage is the backend database.

Never use mock static arrays inside components.

Create reusable services for CRUD operations.

==================================================

SYSTEM FEATURES

1. Authentication
2. Role Based Access
3. Dashboard
4. POS
5. Kitchen Display
6. Menu Management
7. Inventory
8. Reports
9. QR Menu
10. Orders
11. Employees
12. Tables
13. Customers
14. Settings

==================================================

There are five actors.

1. Admin
2. Cashier
3. Waiter
4. Chef
5. Consumer

Each actor has a different dashboard.

Hide pages they are not allowed to access.

==================================================

LOGIN

Create Login page.

Use localStorage users.

Create default users.

Admin

email:
admin@restaurant.com

password:
123456

Cashier

cashier@restaurant.com

123456

Chef

chef@restaurant.com

123456

Waiter

waiter@restaurant.com

123456

==================================================

ADMIN DASHBOARD

Pages

Dashboard

Employee Management

Role Management

Menu Management

Category Management

Inventory

Supplier

Purchase Orders

Tables

Orders

Sales Reports

Expense Reports

Customers

Audit Logs

Restaurant Settings

Every page must perform CRUD using localStorage.

==================================================

EMPLOYEE MANAGEMENT

Add Employee

Edit Employee

Delete Employee

Search Employee

Pagination

Status Active/Inactive

Role Assignment

==================================================

MENU MANAGEMENT

Category CRUD

Food CRUD

Drink CRUD

Image Upload

Price

Description

Availability

Search

Filter

==================================================

INVENTORY

Ingredient CRUD

Stock Quantity

Unit

Minimum Stock

Expiration Date

Low Stock Badge

==================================================

SUPPLIERS

CRUD Supplier

Purchase History

==================================================

PURCHASES

Create Purchase

Receive Purchase

Automatically increase inventory

==================================================

TABLES

Restaurant Floor

Grid Layout

Available

Occupied

Reserved

Cleaning

Click table to view order

==================================================

ORDERS

View All Orders

Filter

Pending

Cooking

Ready

Served

Completed

Cancelled

==================================================

REPORTS

Daily Sales

Weekly Sales

Monthly Sales

Revenue Cards

Charts

Top Selling Foods

Low Inventory

Recent Orders

==================================================

EXPENSES

CRUD

Rent

Salary

Utilities

Maintenance

==================================================

CUSTOMERS

Customer List

Search

History

Favorite Foods

==================================================

SETTINGS

Restaurant Name

Logo

Tax

Currency

Opening Hours

==================================================

CASHIER DASHBOARD

Pages

Dashboard

POS

Orders

Payments

Receipts

Today's Sales

==================================================

POS PAGE

This page should look like a modern POS.

Left

Categories

Search

Food Grid

Right

Cart

Increase Quantity

Decrease Quantity

Delete Item

Subtotal

Tax

Discount

Grand Total

Payment Method

Cash

Card

Mobile

Complete Order

Save order into localStorage.

Reduce inventory automatically.

==================================================

WAITER DASHBOARD

Pages

Dashboard

Tables

Create Order

Active Orders

Request Bill

Notifications

==================================================

TABLE PAGE

Visual restaurant tables.

Click table.

Open order page.

Add menu.

Send to kitchen.

==================================================

CHEF DASHBOARD

Kitchen Display System

Pages

Dashboard

Order Queue

Order Detail

Inventory Alerts

==================================================

Kitchen Board

Kanban Layout

Pending

Cooking

Ready

Buttons

Start Cooking

Ready

Completed

==================================================

CONSUMER

Public Website

Pages

Home

About

Menu

Food Detail

Cart

Track Order

Contact

==================================================

QR MENU

Create QR Menu page.

Beautiful food cards.

Categories.

Search.

Responsive.

==================================================

COMMON REQUIREMENTS

Use reusable layout.

Sidebar

Navbar

Breadcrumb

Dark Mode Toggle

Notification Bell

Profile Menu

Responsive Drawer

==================================================

Create reusable components.

Button

Modal

Table

Search

Pagination

Card

Stat Card

Chart

Form

Loading

Empty State

Confirm Dialog

==================================================

Create reusable hooks.

==================================================

Create reusable services.

Example

menuService.js

employeeService.js

inventoryService.js

orderService.js

customerService.js

Each service performs CRUD using localStorage.

==================================================

Create Context API

AuthContext

ThemeContext

NotificationContext

==================================================

Protect routes.

Admin only

Cashier only

Chef only

Waiter only

Consumer public

==================================================

Folder Structure

src

components

layouts

pages

services

hooks

contexts

routes

utils

assets

data

==================================================

Every CRUD must work.

Every button must work.

Every modal must work.

Every form must validate.

Every table must support

Search

Sort

Pagination

==================================================

Generate a modern enterprise UI inspired by

Toast POS

Square POS

Lightspeed Restaurant

Oracle MICROS

Do not create a simple dashboard.

Create a production-quality frontend that can later connect to REST APIs with minimal changes.

Maintain clean architecture, reusable components, consistent styling, and proper separation of concerns.

Generate the project incrementally, starting with the project structure, routing, layouts, authentication, and shared components before implementing each module.