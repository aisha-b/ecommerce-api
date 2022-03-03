# Ecommerce REST API

A RESTful api for your e-commerce or shopping application

## Installation

### :point_right: Clone the repository from github

```bash
git clone git@github.com:aisha-b/ecommerce-api.git
npm install
```

### :point_right: Setup DB

Rename .env-sample to .env then replace the string with your MongoDB URI

## Run

### :point_right: Start and run on port 4000

```bash
npm start
```

### :point_right: Start and run in development mode

```bash
npm run dev
```

## REST Endpoints

### :point_right: Products

#### Get all products

```javascript
fetch('http://localhost:4000/api/products/', {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((response) => console.log(response))
```

#### Get all active products

```javascript
fetch('http://localhost:4000/api/products/active', {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((response) => console.log(response))
```

#### Get a specific product

```javascript
fetch('http://localhost:4000/api/products/:productId/get', {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((response) => console.log(response))
```

#### Create a product

```javascript
fetch('http://localhost:4000/api/products/create', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "name",
    imageURL: "imageURL",
    description: "description",
    price: 00,
    specifications: [
      {key: "key1", value: "value1"},
      {key: "key2", value: "value2"}
    ]
  })
})
  .then((response) => response.json())
  .then((response) => console.log(response))
```

### :point_right: User

### :point_right: Wishlist

### :point_right: Cart

### :point_right: Order
