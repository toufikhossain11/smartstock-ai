# SmartStock AI

**SmartStock AI** is an inventory and sales management application
designed to help businesses track products, monitor stock levels, review
sales performance, and receive AI-powered business insights.

## Live Demo

-   **Application:** https://smartstock-ai-one.vercel.app/login

### Demo Login

Use the following credentials to try the deployed application:

-   **Email:** `toufikh@gmail.com`
-   **Password:** `11111111`

> **Demo-account note:** These credentials are included because they
> were provided for the assessment demo. Use them only for a dedicated
> demo account. Never reuse this password for a personal account or
> expose real user credentials.

## Project Features

The application is intended to provide the following features. Please
verify each feature in the deployed version and update this list if any
item is not yet implemented.

-   **Authentication:** Login and access to protected application pages.
-   **Product Management:** Create, view, update, and delete product
    records.
-   **Inventory Tracking:** Monitor current stock, record stock changes,
    and identify low-stock products.
-   **Sales Management:** Record sales and keep inventory quantities
    consistent with sales.
-   **Dashboard & Analytics:** Summarize product, sales, and revenue
    information.
-   **AI Insights:** Provide useful business recommendations based on
    available sales and inventory data.
-   **Responsive UI:** Support desktop, tablet, and mobile screen sizes.
-   **Feedback States:** Display appropriate loading, empty, success,
    and error states.

## Technology Stack

-   **Frontend:** Next.js, JavaScript, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **AI Integration:** Server-side AI API integration (configure the
    provider and key in the backend environment)

## Application Flow

1.  The user signs in through the login page.
2.  The frontend requests protected data from the backend.
3.  The backend validates authentication and authorization.
4.  The backend reads or updates the relevant MongoDB records.
5.  For AI insights, the backend calculates reliable metrics from sales
    and inventory data, then sends only the necessary aggregated
    information to the AI provider.
6.  The frontend displays the returned data and handles loading, empty,
    and error states.

## AI Feature: Insights and Recommendations

The AI Insights page is designed to help a user understand business
performance. Depending on the data available, it can provide:

-   **Top Performing Product:** Identifies products with the highest
    sales over a selected period.
-   **Potential Stock Shortage:** Highlights low stock and may estimate
    how soon a product could run out using recent sales velocity.
-   **Sales Trend:** Compares sales across equivalent time periods.
-   **Business Recommendations:** Suggests actions based on verified
    sales and inventory metrics.
-   **Additional Insights:** May show profit margin, strong sales days,
    or product-bundle opportunities when the required data exists.

### AI Inputs and Outputs

**Inputs:** Relevant aggregated metrics, such as units sold, revenue,
current stock, minimum stock thresholds, and recent sales velocity.

**Outputs:** Short recommendations with supporting reasons and
limitations.

**Limitations:** Predictions depend on data quality and history. AI
recommendations can be inaccurate and should be reviewed by the user.
Exact calculations such as totals and percentage changes should be
performed by backend business logic, not guessed by the AI. If there is
not enough data, the application should show an
unavailable/insufficient-data state rather than inventing results.

## Setup Instructions

> The repository URLs, exact folder names, and environment-variable
> names were not provided here. Adjust the commands below to match the
> actual repository structure and the variable names used in the source
> code.

### Prerequisites

-   Node.js (use a version compatible with the project's dependencies)
-   npm
-   MongoDB database or MongoDB Atlas account
-   AI provider API key, if AI recommendations are enabled

### 1. Clone the repository

Replace the placeholder with the actual Git repository URL:

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Install dependencies

If the project has separate frontend and backend folders, install
dependencies in each folder:

``` bash
cd client
npm install

cd ../server
npm install
```

If your folder names differ, use the actual names in your repository.

### 3. Configure environment variables

Create local `.env` files using the variables required by the code.
Never commit real `.env` files or API keys.

Example frontend environment file (`client/.env.example`):

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Example backend environment file (`server/.env.example`):

``` env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
AI_API_KEY=your_ai_provider_api_key
```

These are illustrative variable names. Confirm the names used by the
application before running it. Keep secret keys on the server; do not
expose them through `NEXT_PUBLIC_` variables.

### 4. Run the backend

``` bash
cd server
npm install
npm run dev
```

The backend port and scripts depend on the actual `server/package.json`
and environment configuration.

### 5. Run the frontend

In a separate terminal:

``` bash
cd client
npm install
npm run dev
```

Open the local URL printed by Next.js, commonly `http://localhost:3000`.

## Environment Variables

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `NEXT_PUBLIC_API_URL`               Frontend API base URL, if used by
                                      the project

  `PORT`                              Backend server port

  `MONGODB_URI`                       MongoDB connection string

  `CLIENT_URL`                        Allowed frontend origin for CORS

  `AI_API_KEY`                        Server-side AI provider key
  -----------------------------------------------------------------------

The names above are examples and must be reconciled with the actual
source code before submission. Do not include real secret values in this
README.

## API Documentation

Document the actual endpoints implemented by the project here. The
following are examples of possible routes, not a claim that they already
exist:

  -----------------------------------------------------------------------------
  Example endpoint                          Purpose
  ----------------------------------------- -----------------------------------
  `GET /api/health`                         Check whether the API is running

  `GET /api/products`                       Retrieve products

  `POST /api/products`                      Create a product

  `GET /api/sales`                          Retrieve sales records

  `POST /api/sales`                         Create a sale and update stock
                                            safely

  `GET /api/insights/overview`              Retrieve calculated business
                                            metrics

  `POST /api/insights/ai-recommendations`   Generate AI recommendations
  -----------------------------------------------------------------------------

Update this table with the exact routes, authentication requirements,
request bodies, and response formats from the implemented backend.

## Security and Validation

-   Protect private API routes with the project's authentication
    mechanism.
-   Ensure users can access only their own authorized records.
-   Validate request data on the server.
-   Reject sales that exceed available stock.
-   Keep database credentials and AI keys in environment variables.
-   Configure CORS for trusted frontend origins in production.
-   Avoid returning sensitive fields or internal error details to
    clients.
-   Do not commit `.env` files, credentials, or tokens.

## Testing

Add and run tests for critical behavior before submission. Suggested
cases include:

-   Valid and invalid product input.
-   Stock cannot become negative after a sale.
-   Sales and inventory updates remain consistent.
-   Sales trend calculations handle a previous period with zero revenue.
-   Protected endpoints reject unauthenticated or unauthorized requests.
-   AI provider errors are handled without breaking standard dashboard
    insights.

List the actual test command and test results once verified:

``` bash
npm test
```

> Run this command in the package that defines the test script. Do not
> claim tests pass until you have run them.

## Known Limitations

Update this section to reflect the actual deployed implementation.
Potential limitations to consider:

-   AI insights depend on the quality and volume of sales history.
-   Stock-shortage estimates assume recent sales patterns may continue;
    real demand can change.
-   Profit calculations require accurate product costs and relevant
    adjustments.
-   AI output may be incorrect, so recommendations should be reviewed.
-   Some insights may be unavailable when the database does not contain
    sufficient information.

## Submission Checklist

Before submitting the assessment, verify the following:

-   [ ] The live link opens and the demo login works.
-   [ ] The Git repository URL is added above or below.
-   [ ] Setup instructions match the current source code.
-   [ ] `.env.example` files contain variable names but no secrets.
-   [ ] CRUD operations persist data in MongoDB.
-   [ ] Authentication, authorization, and validation work.
-   [ ] Loading, success, empty, and error states are handled.
-   [ ] The AI feature is demonstrated and its inputs, outputs,
    usefulness, and limitations are explained.
-   [ ] Critical calculations and workflows have been tested.
-   [ ] Git history contains meaningful commits.
-   [ ] All submitted code is understood and can be explained during the
    live review.

## Repository

-   **GitHub Repository:** `<ADD_YOUR_GITHUB_REPOSITORY_URL>`
-   **Live Application:** https://smartstock-ai-one.vercel.app/login

------------------------------------------------------------------------

Prepared for the NT Tech Innovation Full Stack Developer practical
assessment. Ensure every feature and setup detail in this README matches
the actual code before submission.
