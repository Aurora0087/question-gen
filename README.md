
# Qus-Ai Frontend

Qus-Ai a AI-Powered Question Generator's Frontend.


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

```
NUXT_PUBLIC_AVAILABLE="true"


# APPWRITE
APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT

# razerpay
RAZORPAY_API_KEY_ID=YOURRAZORPAY_KEY_ID


# backend
BACKEND_URL=http://localhost:8002

```
## Installation

1. Clone the repository:

```bash
git https://github.com/Aurora0087/question-gen.git
cd question-gen
```

2. Install dependencies:

```bash
bun i
```

3. Run [backend](https://github.com/Aurora0087/question-gen-backend) server.

3. Add environment variables to your `.env` file.

4. Start the development server:

```bash
bun dev
```

5. In default server is Running on [http://localhost:3000](http://localhost:3000).

## Edit Content

If you want to edit the content, navigate to `./content/en/` and modify the files as needed. Additionally, update `./app/app.config.ts` to adjust the data accordingly.