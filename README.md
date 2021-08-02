
# Zerodha Statement 

An Application to process Zerodha Statement and add tags to the statements


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SESSION`

`PUBLIC_TOKEN`


Please grab the cookies from [https://console.zerodha.com](https://console.zerodha.com)
  
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

Sync Data

```bash
  npm run sync
```

Generate the Page

```bash
  npm run build
```

  
## Todo


Things to do

~~Use [puppeteer](https://github.com/puppeteer/puppeteer/) to ask user to login and auto grab CSRF and cookie~~