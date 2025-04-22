# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


### Sections for the app
Layout-Level Components
<Sidebar />

Handles navigation (Settings, Categories, Linked Accounts, Budget Config, etc.)

Collapsible / responsive for mobile

<TopNav /> or <Header />

Shows user info, quick access to settings, logout button, date filter

<MainDashboard />

Container that dynamically loads dashboard widgets based on page route or tabs

🔹 Dashboard Components
<BudgetAllocationCard />

Visual display (pie chart, progress bars) of current budget allocations

<TransactionList />

Shows recent transactions

Supports filtering/sorting

Each item = <TransactionItem />

<SpendingOverTimeChart />

Line/bar chart showing trends

Pulls data from selected date range

<EstimatedSpendingWidget />

Projected total spending based on current rate

May involve predictive logic

<AdvicePanel />

Dynamic tips, warnings, or suggestions based on user behavior

Could be AI/logic-driven

🔹 Settings & Config Pages
<SettingsPage />

Container for sub-settings

<CategoryManager />

CRUD interface for budgeting categories

<AccountsManager />

Linked bank accounts, manual accounts, balances

<BudgetConfig />

Set desired monthly budget per category

Could include sliders, inputs, auto-suggestion logic

🔹 Other Utility Components
<DateRangePicker />

Select time frame for dashboard stats

<Modal />

Reusable for confirmation, transaction details, etc.

<NotificationBanner />

System messages, alerts, budget warnings

<Tooltip />, <Dropdown />, <Tabs />, etc.

For UX polish and interactivity

🔹 Forms / Inputs
<TransactionForm />

Manual entry or edit of transactions

<CategoryForm />

For creating/updating a category

<GoalForm /> (optional)

If you want users to track specific savings or payoff goals

🧠 Optional (Power User) Features
<ForecastingWidget />

Budget trajectory / prediction

<GoalTracker />

Visual goal progress

<SharedAccessManager />

Invite/manage collaborators (if budget sharing is supported)