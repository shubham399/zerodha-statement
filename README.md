
# Zerodha Statement 

An Application to process Zerodha Statement and add tags to the statements


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CSRF`

`COOKIE`


Please grab the CSRF token and All the Cookies from [https://console.zerodha.com](https://console.zerodha.com)
  
## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd zerodha-statment
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run sync
```

  
## Todo


Things to do

Use [puppeteer](https://github.com/puppeteer/puppeteer/) to ask user to login and auto grab CSRF and cookie