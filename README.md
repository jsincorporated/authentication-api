# authentication-api
a simple authentication api using express and mongodb

# Usage
1. Clone this repository
2. Create a .env file in the root directory
3. Specify your desired `API_PORT`, `MONGO_URI`, and `TOKEN_KEY` in the .env file.
4. `TOKEN_KEY` can be any randomly generated string, it is used for signing JSON Web Tokens.
5. Run `npm run dev` in the terminal.

# Endpoints
`POST` /register

Allows users to register by providing their email, password, user role, designation, company, first name and last name. 

`POST` /login

Allows users to login by providing their email address and password. After successful login, the API returns a JSON Web Token (JWT) that can be used to authenticate subsequent requests. 

`GET` /myinfo

Allows users to retrieve their own information, including first and last names, email address, role, designation and company.

`PATCH` /update

Allows users to update their own information, including first and last names, password, email address, designation and company.
