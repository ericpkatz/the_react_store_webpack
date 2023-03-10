import axios from 'axios';
import { faker } from '@faker-js/faker';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Products from './Products';
import Header from './Header';
import ProductForm from './ProductForm';

const { useState, useEffect } = React;
const App = ()=> {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(()=> {
    const fetchUsers = async()=> {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    };
    fetchProducts();
  }, []);


  const create = async(product)=> {
    const response = await axios.post('/api/products', product);
    setProducts([...products, response.data]);
  };

  const createRandom = async(ev)=> {
    try {
      const product = { name: faker.commerce.product() };
      const response = await axios.post('/api/products', product);
      setProducts([...products, response.data]);
    }
    catch(ex){
      setError(ex.response.data.error.errors[0].message);
    }
  };

  const destroy = async(product)=> {
    await axios.delete(`/api/products/${product.id}`);
    setProducts(products.filter(_product => _product.id !== product.id ));
  };

  const increment = async(product)=> {
    const response = await axios.put(`/api/products/${product.id}`, {
      rating: product.rating + 1
    });
    product = response.data;
    setProducts(products.map(_product => {
      if(_product.id === product.id){
        return product;
      }
      return _product;
    }));
  };

  const decrement = async(product)=> {
    const response = await axios.put(`/api/products/${product.id}`, {
      rating: product.rating - 1
    });
    product = response.data;
    setProducts(products.map(_product => {
      if(_product.id === product.id){
        return product;
      }
      return _product;
    }));
  };


  return (
    <div>
      <Header products={ products } />
      <ProductForm create={ create } users={ users }/>
      <button onClick={ createRandom }>Create Random Product</button>
      <Products
        products = { products }
        increment = { increment }
        decrement = { decrement }
        destroy = { destroy }
        users = { users }
      />
      <Header products={ products } />
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);
