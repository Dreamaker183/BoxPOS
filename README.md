# BoxPOS - Modern Point of Sale System

BoxPOS is a modern, touch-optimized Point of Sale (POS) system designed for flexibility and ease of use. It supports multiple user roles, including Admins, Merchants, and Tenants, providing a comprehensive solution for managing sales, inventory, and business operations.

## Tech Stack

This project is built with a modern, robust, and scalable technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Library**: [React](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or a compatible package manager

### Installation & Running the App

1.  **Install dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Run the development server:**
    Once the dependencies are installed, start the Next.js development server:
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Key Features

-   **Touch-Optimized POS Interface**: An intuitive and responsive interface designed for touch-based devices like iPads and tablets.
-   **Role-Based Access Control (RBAC)**: Distinct dashboards and functionalities for different user roles:
    -   **Admin**: Full system oversight, tenant management, and system-level reporting.
    -   **Merchant**: Manages their own booths, products, inventory, and sales.
    -   **Tenant**: A simplified view to manage their products and view their own sales reports.
    -   **Cashier**: Access to the core Point of Sale screen for processing transactions.
-   **Real-Time Dashboards**: Clean and clear data visualizations for sales trends, inventory levels, and other key metrics.
-   **Cloud-based Receipt Generation**: Utilizes Genkit to dynamically generate and format receipts that can be printed or sent digitally.
-   **Offline Mode Support**: Designed to handle intermittent internet connectivity, ensuring sales operations are not interrupted.
-   **Barcode/QR Code Scanning**: Integrated camera support for quick product lookups and inventory management.
-   **White-labeling Support**: Easily customizable branding, including logos and color schemes, to match any brand identity.
