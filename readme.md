# clearYoutubePlaylist


## Overview

This website is to clear the user's youtube playlist using google api .

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed .
- Make sure you have enabled the consent screen in google cloud console.
- Get the CLIENT_ID , CLIENT_SECRET and REDIRECT_URI


## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

Clone the repository to your local machine and navigate into the project directory:

    git clone https://github.com/SwanHtetMyintAung/clearYoutubePlaylist.git
    cd clearYoutubePlaylist

### 2. Install Dependencies

Install the required dependencies using the package manager.

For **npm**:

    npm install

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project. This file should contain all necessary secrets and configuration variables.

Example `.env` file:

   CLIENT_ID = your-client-id
   CLIENT_SECRET = your-client-secret
   REDIRECT_URI = your-redirec-uri

Replace the placeholder values with your actual secrets

### 4. Run the Project

Start the project using the appropriate command for your environment.

For **npm**:

    npm run dev (for development)
    npm start
